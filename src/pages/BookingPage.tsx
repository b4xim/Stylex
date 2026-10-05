import React from 'react';
import { BookingEngine } from '../components/BookingEngine.tsx';
import { SALON_DATA } from '../data/salonData.ts';
import { BookingState } from '../types.ts';

interface BookingPageProps {
  selectedServiceId?: string;
  onConfirmBooking: (booking: BookingState) => void;
  onNavigateHome: () => void;
  onScrollToSection: (sectionId: string) => void;
  isEngineActive?: boolean;
  onTriggerPausedModal?: () => void;
  bookingKey?: number;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  selectedServiceId = 'hair-1',
  onConfirmBooking,
  onNavigateHome: _onNavigateHome,
  isEngineActive = true,
  onTriggerPausedModal,
  bookingKey,
}) => {
  return (
    <div className="w-full bg-[#f6faf7] min-h-screen">
      {/* Dedicated Booking Hero Banner (Slimmed for Mobile, Rich for Desktop) */}
      <section className="w-full bg-gradient-to-b from-[#031b14] via-[#05261d] to-[#041d16] text-white pt-6 sm:pt-14 pb-8 sm:pb-14 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b border-[#144e3d]">
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#fe753c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#185341]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 space-y-2 sm:space-y-6 text-center">
          {/* Mobile Badge */}
          <div className="inline-flex sm:hidden items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#caead5] text-[10.5px] font-semibold border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fe753c] animate-pulse"></span>
            <span>Tirur Flagship • Pay at Salon</span>
          </div>

          {/* Page Heading */}
          <div className="space-y-1 sm:space-y-3">
            <h1 className="text-xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display-hero text-white leading-tight">
              Reserve Your Appointment
            </h1>
            <p className="hidden sm:block max-w-2xl mx-auto text-[#caead5]/90 text-[14.5px] sm:text-[16px] leading-relaxed">
              Curate your look with our master stylists. Select your signature service, preferred stylist, and reservation slot with instantaneous WhatsApp confirmation.
            </p>
          </div>

          {/* Trust Value Badges Grid (Desktop Only - keeps mobile clean & above the fold) */}
          <div className="hidden sm:flex pt-2 flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[11.5px] sm:text-[12.5px] font-semibold">
            <div className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[#caead5] shadow-sm">
              <span className="material-symbols-outlined text-[#fe753c] text-[16px]">bolt</span>
              <span>Instant Confirmation</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[#caead5] shadow-sm">
              <span className="material-symbols-outlined text-[#fe753c] text-[16px]">schedule</span>
              <span>Open Daily: 10 AM – 1 AM</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[#caead5] shadow-sm">
              <span className="material-symbols-outlined text-[#fe753c] text-[16px]">credit_card_off</span>
              <span>Zero Prepayment Required</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[#caead5] shadow-sm">
              <span className="material-symbols-outlined text-[#fe753c] text-[16px]">location_on</span>
              <span>One Arcade, Near Lenskart</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Booking Engine Card Section */}
      <section className="w-full relative z-20">
        <BookingEngine
          key={`booking-page-${bookingKey || 0}`}
          initialServiceId={selectedServiceId}
          onConfirmBooking={onConfirmBooking}
          showHeader={false}
          isEngineActive={isEngineActive}
          onTriggerPausedModal={onTriggerPausedModal}
        />
      </section>

      {/* Mobile-Only Streamlined Trust & Support Strip (Clean, Modern, Zero Clutter) */}
      <section className="md:hidden max-w-sm mx-auto px-4 pt-2 pb-8 text-center space-y-2.5">
        <div className="flex items-center justify-center gap-3 text-[11px] text-[#424844] font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-emerald-600">verified</span>
            <span>Zero Prepayment</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-emerald-600">check_circle</span>
            <span>WhatsApp Confirmation</span>
          </span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <a
            href={`tel:${SALON_DATA.phoneNumberClean}`}
            className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#c2c8c2]/50 text-[#112e20] font-semibold text-[11.5px] flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-[#fe753c]">call</span>
            <span>Call Desk</span>
          </a>
          <a
            href={`https://wa.me/${SALON_DATA.whatsappNumber}?text=${encodeURIComponent('Hello StyleX Concierge, I need assistance with my booking.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-xl bg-[#042018] text-white font-semibold text-[11.5px] flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-[#fe753c]">chat</span>
            <span>WhatsApp Help</span>
          </a>
        </div>
      </section>

      {/* VIP Atelier Privileges & Guarantees (Desktop Only - keeps mobile clean & uncluttered) */}
      <section className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#9b4521]">
            The StyleX Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#112e20] font-headline-lg">
            Why Reserve at StyleX Tirur Outlet?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#c2c8c2]/50 shadow-md space-y-3 flex flex-col justify-between hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#042018] flex items-center justify-center text-[#fe753c]">
              <span className="material-symbols-outlined text-[24px]">content_cut</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-[17px] font-bold text-[#112e20]">Master Artisans & Stylists</h3>
              <p className="text-[13px] text-[#424844] leading-relaxed">
                Trained in contemporary precision cutting, European color chemistry, and bespoke spa therapies tailored specifically for Indian hair textures.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-bold text-[#185341] uppercase tracking-wider flex items-center gap-1">
              <span>Personalized Consultation</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#c2c8c2]/50 shadow-md space-y-3 flex flex-col justify-between hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#042018] flex items-center justify-center text-[#fe753c]">
              <span className="material-symbols-outlined text-[24px]">spa</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-[17px] font-bold text-[#112e20]">Premium Imported Care</h3>
              <p className="text-[13px] text-[#424844] leading-relaxed">
                We utilize only 100% authentic dermatologically certified serums, salon-grade hair spas, and botox formulations for long-lasting mirror shine.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-bold text-[#185341] uppercase tracking-wider flex items-center gap-1">
              <span>Zero Counterfeit Guarantee</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#c2c8c2]/50 shadow-md space-y-3 flex flex-col justify-between hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#042018] flex items-center justify-center text-[#fe753c]">
              <span className="material-symbols-outlined text-[24px]">chat</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-[17px] font-bold text-[#112e20]">Seamless WhatsApp Dispatch</h3>
              <p className="text-[13px] text-[#424844] leading-relaxed">
                Your appointment details, reference code, and Google Calendar sync are dispatched instantly to your WhatsApp with zero friction.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-bold text-[#185341] uppercase tracking-wider flex items-center gap-1">
              <span>Real-Time Notifications</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Policies & FAQs (Desktop Only) */}
      <section className="hidden md:block bg-white border-y border-[#c2c8c2]/40 py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#9b4521]">
              Essential Information
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#112e20]">
              Reservation Guidelines & Salon Policies
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#f6faf7] border border-[#112e20]/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#112e20] text-[15px]">
                <span className="material-symbols-outlined text-[#fe753c]">check_circle</span>
                <h4>Walk-ins vs Pre-booking</h4>
              </div>
              <p className="text-[13px] text-[#424844] leading-relaxed">
                Walk-ins are warmly accepted daily until 1:00 AM. However, reserving online secures your preferred stylist and gives you priority seating without wait times.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f6faf7] border border-[#112e20]/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#112e20] text-[15px]">
                <span className="material-symbols-outlined text-[#fe753c]">event_repeat</span>
                <h4>Rescheduling & Cancellation</h4>
              </div>
              <p className="text-[13px] text-[#424844] leading-relaxed">
                Plans change! You can reschedule or cancel at any time via WhatsApp or by calling our desk with zero cancellation charges.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f6faf7] border border-[#112e20]/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#112e20] text-[15px]">
                <span className="material-symbols-outlined text-[#fe753c]">payments</span>
                <h4>Payment at Salon Checkout</h4>
              </div>
              <p className="text-[13px] text-[#424844] leading-relaxed">
                Pay conveniently upon service completion at our Tirur desk using UPI (GPay/PhonePe), Credit/Debit Cards, or Cash. No advance prepayment required.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f6faf7] border border-[#112e20]/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#112e20] text-[15px]">
                <span className="material-symbols-outlined text-[#fe753c]">diamond</span>
                <h4>Bridal & Group Bookings</h4>
              </div>
              <p className="text-[13px] text-[#424844] leading-relaxed">
                For wedding party styling, pre-bridal packages, or private group sessions, connect with our bridal concierge directly on WhatsApp for tailored trials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Concierge Callout Bar (Desktop Only) */}
      <section className="hidden md:block max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#031b14] text-white border border-[#185341] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-display-hero">
              Need Assistance With Your Booking?
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#a6d0be]">
              Our concierge desk is active daily from 10:00 AM to 1:00 AM to assist you.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:${SALON_DATA.phoneNumberClean}`}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-[13px] border border-white/15 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[17px] text-[#fe753c]">call</span>
              <span>{SALON_DATA.phoneDisplay}</span>
            </a>

            <a
              href={`https://wa.me/${SALON_DATA.whatsappNumber}?text=${encodeURIComponent('Hello StyleX Concierge, I would like assistance with an appointment booking.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#fe753c] hover:bg-[#e8652d] text-white font-bold text-[13px] shadow-[0_4px_16px_rgba(254,117,60,0.4)] transition-all flex items-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">chat</span>
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

