import React from 'react';
import { BookingEngine } from '../components/BookingEngine.tsx';
import { SALON_DATA } from '../data/salonData.ts';
import { BookingState } from '../types.ts';

interface BookingPageProps {
  selectedServiceId?: string;
  onConfirmBooking: (booking: BookingState) => void;
  onNavigateHome: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  selectedServiceId = 'hair-1',
  onConfirmBooking,
  onNavigateHome,
}) => {
  return (
    <div className="w-full bg-[#f6faf7] min-h-screen">
      {/* Dedicated Booking Hero Banner (Slimmed for Mobile, Rich for Desktop) */}
      <section className="w-full bg-gradient-to-b from-[#031b14] via-[#05261d] to-[#041d16] text-white pt-4 sm:pt-14 pb-8 sm:pb-20 px-3 sm:px-6 lg:px-12 relative overflow-hidden border-b border-[#144e3d]">
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#fe753c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#185341]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 space-y-3 sm:space-y-6 text-center">
          {/* Breadcrumb / Back Navigation */}
          <div className="flex items-center justify-between sm:justify-center gap-2 text-[12px] font-medium text-[#a6d0be]">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full border border-white/10"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              <span>Back to Home</span>
            </button>
            <span className="text-[#fe753c] font-semibold text-[11px] uppercase tracking-wider sm:hidden">Online Booking</span>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-white/30">/</span>
              <span className="text-[#fe753c] font-semibold">Online Reservation</span>
            </div>
          </div>

          {/* Section Badge (Desktop) */}
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#072f23] text-[#a6d0be] border border-[#144e3d] text-[11px] font-bold tracking-widest uppercase shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#fe753c] animate-pulse" />
            <span>StyleX Direct Concierge • Tirur Flagship</span>
          </div>

          {/* Page Heading */}
          <div className="space-y-1.5 sm:space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display-hero text-white leading-tight">
              Reserve Your Appointment
            </h1>
            <p className="hidden sm:block max-w-2xl mx-auto text-[#caead5]/90 text-[14.5px] sm:text-[16px] leading-relaxed">
              Curate your look with our master stylists. Select your signature service, preferred artisan, and reservation slot with instantaneous WhatsApp confirmation.
            </p>
            <p className="sm:hidden text-[12px] text-[#caead5]/80 font-medium">
              Tirur Flagship • Open Daily 10:00 AM – 1:00 AM • Pay at Salon
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
      <section className="w-full relative z-20 -mt-4 sm:-mt-8">
        <BookingEngine
          initialServiceId={selectedServiceId}
          onConfirmBooking={onConfirmBooking}
          showHeader={false}
        />
      </section>

      {/* Mobile-Only Streamlined Trust & Support Strip (Clean, Fast, Zero Clutter) */}
      <section className="md:hidden max-w-lg mx-auto px-4 pt-2 pb-10 space-y-3.5">
        <div className="bg-white rounded-2xl p-4 border border-[#c2c8c2]/50 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[12px] font-bold text-[#112e20] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px] text-[#fe753c]">verified_user</span>
              <span>StyleX Tirur Guarantee</span>
            </div>
            <span className="text-[10px] font-bold text-[#185341] uppercase tracking-wider bg-[#072f23]/10 px-2 py-0.5 rounded-full">
              Zero Prepayment
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#424844] pt-1 border-t border-[#c2c8c2]/30">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
              <span>Pay at Tirur desk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
              <span>WhatsApp confirmation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
              <span>Free reschedule</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
              <span>Open until 1:00 AM</span>
            </div>
          </div>
        </div>

        {/* 1-Tap Quick Action Buttons on Mobile */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${SALON_DATA.phoneNumberClean}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-[#c2c8c2]/60 text-[#112e20] font-semibold text-[12px] flex items-center justify-center gap-1.5 shadow-sm active:bg-gray-50"
          >
            <span className="material-symbols-outlined text-[16px] text-[#fe753c]">call</span>
            <span>Call Desk</span>
          </a>
          <a
            href={`https://wa.me/${SALON_DATA.whatsappNumber}?text=${encodeURIComponent('Hello StyleX Concierge, I need assistance with my booking.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#042018] text-white font-semibold text-[12px] flex items-center justify-center gap-1.5 shadow-sm active:bg-[#072f23]"
          >
            <svg className="w-[15px] h-[15px] fill-[#fe753c]" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>WhatsApp</span>
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
            Why Reserve at StyleX Tirur Flagship?
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
                All prices are in Indian Rupees (₹) inclusive of GST. Pay conveniently upon service completion using UPI (GPay/PhonePe), Credit/Debit Cards, or Cash.
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

