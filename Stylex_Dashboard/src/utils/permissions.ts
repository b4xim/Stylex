import { SystemRole } from '../types';

export interface RolePermissions {
  canDeleteUsers: boolean;
  canEditUsers: boolean;
  canAddUsers: boolean;
  canEditStylists: boolean;
  canDeleteStylists: boolean;
  canManageStylistLeaves: boolean;
  canEditSettings: boolean;
  canCreateBookings: boolean;
  canEditTreatments: boolean;
  canManagePromotions: boolean;
  canBlockSlots: boolean;
  isViewOnly: boolean;
}

export const getRolePermissions = (role?: SystemRole | string): RolePermissions => {
  switch (role) {
    case 'Admin':
    case 'Developer':
      return {
        canDeleteUsers: true,
        canEditUsers: true,
        canAddUsers: true,
        canEditStylists: true,
        canDeleteStylists: true,
        canManageStylistLeaves: true,
        canEditSettings: true,
        canCreateBookings: true,
        canEditTreatments: true,
        canManagePromotions: true,
        canBlockSlots: true,
        isViewOnly: false,
      };

    case 'Manager':
      return {
        canDeleteUsers: false,         // Manager: No access to delete users (Admin/Dev only)
        canEditUsers: false,           // Manager: No access to edit users (Admin/Dev only)
        canAddUsers: false,            // Manager: No access to add users (Admin/Dev only)
        canEditStylists: false,        // Manager: No access to delete or edit stylists
        canDeleteStylists: false,      // Manager: No access to delete or edit stylists
        canManageStylistLeaves: false, // Manager: No access to Stylists leaves etc
        canEditSettings: false,        // Manager: No access to change settings except dark mode
        canCreateBookings: true,
        canEditTreatments: true,
        canManagePromotions: true,
        canBlockSlots: true,
        isViewOnly: false,
      };

    case 'Staff':
    case 'Normal User':
    default:
      return {
        canDeleteUsers: false,
        canEditUsers: false,
        canAddUsers: false,
        canEditStylists: false,
        canDeleteStylists: false,
        canManageStylistLeaves: false,
        canEditSettings: false,
        canCreateBookings: false,
        canEditTreatments: false,
        canManagePromotions: false,
        canBlockSlots: false,
        isViewOnly: true,              // Staff: View-only access, no edit or delete anywhere
      };
  }
};
