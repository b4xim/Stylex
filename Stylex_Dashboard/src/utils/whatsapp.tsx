import React from 'react';

/**
 * Generates direct WhatsApp chat link with optional pre-filled reservation message
 */
export const getWhatsAppUrl = (
  phone: string,
  clientName?: string,
  serviceName?: string,
  dateStr?: string,
  time?: string
): string => {
  if (!phone) return 'https://wa.me/';

  const digits = phone.replace(/[^0-9]/g, '');
  // Format for WhatsApp: ensure country code (defaulting to India +91 if 10-digit mobile)
  let cleanPhone = digits;
  if (digits.length === 10) {
    cleanPhone = `91${digits}`;
  } else if (digits.length === 11 && digits.startsWith('0')) {
    cleanPhone = `91${digits.slice(1)}`;
  }

  let message = `Hi ${clientName || 'there'}, this is StyleX Luxury Salon Tirur.`;
  if (serviceName && time) {
    message = `Hi ${clientName || 'there'}, this is StyleX Salon regarding your reservation for ${serviceName}${dateStr ? ` on ${dateStr}` : ''} at ${time}. Please let us know if you need any assistance or adjustments!`;
  } else if (serviceName) {
    message = `Hi ${clientName || 'there'}, this is StyleX Salon regarding your ${serviceName} booking. How can we assist you today?`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Official SVG WhatsApp icon component
 */
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.184 1.564 5.938l-1.564 5.714 5.861-1.537c1.701.927 3.651 1.457 5.72 1.457 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
  </svg>
);
