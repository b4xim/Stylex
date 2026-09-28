import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

export class CustomerController {
  public static async listCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, limit = '100', offset = '0' } = req.query;

      const whereClause: any = {};
      if (search && typeof search === 'string') {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [customers, totalCount] = await Promise.all([
        prisma.customer.findMany({
          where: whereClause,
          include: {
            bookings: {
              orderBy: { date: 'desc' },
              take: 5,
              include: { service: true, stylist: true },
            },
            _count: {
              select: { bookings: true },
            },
          },
          orderBy: { totalSpent: 'desc' },
          take: parseInt(limit as string, 10),
          skip: parseInt(offset as string, 10),
        }),
        prisma.customer.count({ where: whereClause }),
      ]);

      const mapped = customers.map((c) => ({
        ...c,
        totalVisits: Math.max(c._count?.bookings || 0, c.totalVisits || 0, 1),
      }));

      res.status(200).json({
        success: true,
        data: mapped,
        total: totalCount,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCustomerDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
          bookings: {
            orderBy: [{ date: 'desc' }, { timeSlot: 'desc' }],
            include: { service: true, stylist: true },
          },
        },
      });

      if (!customer) {
        throw new AppError('Customer not found', 404);
      }

      res.status(200).json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  }

  public static async exportCustomersCsv(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const customers = await prisma.customer.findMany({
        orderBy: { totalSpent: 'desc' },
      });

      // Format as CSV
      const headers = ['ID', 'Full Name', 'Country Code', 'Phone Number', 'Email', 'Total Visits', 'Total Spent (INR)', 'Created At'];
      const rows = customers.map((c) => [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        c.countryCode,
        c.phone,
        c.email || '',
        c.totalVisits,
        c.totalSpent,
        c.createdAt.toISOString().split('T')[0],
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="stylex_customers_crm.csv"');
      res.status(200).send(csvContent);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await prisma.$transaction([
        prisma.booking.deleteMany({ where: { customerId: id } }),
        prisma.customer.delete({ where: { id } }),
      ]);
      res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
