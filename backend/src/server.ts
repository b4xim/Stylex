import { app } from './app';
import { env } from './config/env';
import { prisma } from './config/db';
import { WhatsAppBotService } from './services/whatsappBotService';

const server = app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`✨ StyleX Signature Salon API Server Running!`);
  console.log(`🌐 Port: ${env.PORT} | Environment: ${env.NODE_ENV}`);
  console.log(`📍 API Gateway: http://localhost:${env.PORT}/api/v1`);
  console.log(`🩺 Health: http://localhost:${env.PORT}/api/v1/health`);
  console.log(`======================================================\n`);

  // Initialize self-hosted WhatsApp Web Bot asynchronously in background
  WhatsAppBotService.initialize().catch((err) => {
    console.warn('⚠️ [WhatsApp Bot] Background initialization notice:', err?.message || err);
  });
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Gracefully shutting down StyleX API...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ PostgreSQL connection disconnected. Process exited.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
