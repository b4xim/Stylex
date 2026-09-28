import React, { useState } from 'react';
import { SALON_DATA } from '../data/salonData.ts';

const TIRUR_COORDINATES: [number, number] = [10.904776, 75.921187];

interface ContactAndMapProps {}

export const ContactAndMap: React.FC<ContactAndMapProps> = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !message.trim()) return;

    const newInquiry = {
      id: 'inq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      clientName: fullName.trim(),
      clientTier: 'Guest',
      phone: phone.trim(),
      serviceRequested: subject,
      preferredDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      message: message.trim(),
      status: 'Unread' as const,
      timeAgo: 'Just now',
    };

    // 1. Sync to localStorage for immediate cross-tab dashboard detection
    try {
      const existingRaw = localStorage.getItem('stylex_tirur_v6_inquiries');
      let existing: any[] = [];
      if (existingRaw) {
        try {
          const parsed = JSON.parse(existingRaw);
          if (Array.isArray(parsed)) existing = parsed;
        } catch {}
      }
      const updated = [newInquiry, ...existing];
      localStorage.setItem('stylex_tirur_v6_inquiries', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.warn('Could not save inquiry locally:', err);
    }

    // 2. Dispatch to PostgreSQL backend API
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: fullName.trim(),
        phone: phone.trim(),
        serviceRequested: subject,
        message: message.trim(),
      }),
    }).catch((err) => console.warn('Backend inquiry dispatch notice:', err));

    setFormSubmitted(true);
    setTimeout(() => {
      setFullName('');
      setPhone('');
      setMessage('');
      setTimeout(() => setFormSubmitted(false), 3000);
    }, 1500);
  };

  const whatsappInquiryUrl = `https://wa.me/${SALON_DATA.whatsappNumber}?text=${encodeURIComponent('Hello StyleX Tirur Outlet, I would like to inquire about appointments and availability.')}`;

  return (
    <section className="w-full bg-[#f0f5f1] py-20 px-4 sm:px-6 lg:px-12 border-t border-[#c2c8c2]/40" id="contact-location">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#072f23] text-[#a6d0be] border border-[#144e3d] text-[11px] font-semibold tracking-widest uppercase">
            <span className="material-symbols-outlined text-[15px] text-[#fe753c]">map</span>
            <span>Tirur Outlet Directory</span>
          </div>
          <h2 className="font-headline-lg text-[32px] sm:text-[40px] text-[#112e20] leading-tight">
            Visit Our Tirur Outlet & Get in Touch
          </h2>
          <p className="font-body-lg text-[15px] sm:text-[16px] text-[#424844]">
            Conveniently situated at One Arcade on KG Padi Road. Walk-ins and pre-booked private appointments are warmly welcomed daily until 1:00 AM.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Form & Contact Info (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-[#c2c8c2]/60 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="font-label-caps text-[11px] uppercase tracking-wider text-[#9b4521] flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px]">mail</span> Concierge & Enquiries
                </span>
                <h3 className="font-headline-sm text-[22px] font-bold text-[#112e20] leading-snug font-display-hero">
                  Contact Our Desk
                </h3>
                <p className="font-body-md text-[13px] text-[#424844] leading-relaxed">
                  Have a question, bridal booking inquiry, or want to consult with a master artisan? Call or send us a message directly.
                </p>
              </div>

              {/* Direct Info Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={`tel:${SALON_DATA.phoneNumberClean}`}
                  className="bg-[#f0f5f1] hover:bg-[#e4ede6] transition-colors p-3 rounded-2xl border border-[#112e20]/5 flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#9b4521]/10 flex items-center justify-center text-[#9b4521] flex-shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-caption text-[10px] text-[#424844] uppercase font-bold tracking-wider">Direct Desk</p>
                    <p className="font-label-md text-[12px] text-[#112e20] font-semibold truncate">{SALON_DATA.phoneDisplay}</p>
                  </div>
                </a>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f0f5f1] hover:bg-[#e4ede6] transition-colors p-3 rounded-2xl border border-[#112e20]/5 flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#112e20]/10 flex items-center justify-center text-[#112e20] flex-shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px] text-[#fe753c]">chat</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-caption text-[10px] text-[#424844] uppercase font-bold tracking-wider">WhatsApp Chat</p>
                    <p className="font-label-md text-[12px] text-[#112e20] font-semibold truncate">Online Now</p>
                  </div>
                </a>
              </div>

              {/* Operating Hours Card */}
              <div className="bg-[#031b14] text-white p-3.5 rounded-2xl flex items-center justify-between border border-[#185341]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#062c21] flex items-center justify-center text-[#fe753c]">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-white">{SALON_DATA.hours}</p>
                    <p className="text-[11px] text-[#a6d0be]">{SALON_DATA.hoursDetail}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Open Daily
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-label-caps text-[10px] uppercase tracking-wider text-[#424844] block font-bold">
                      Full Name
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Your name"
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/60 text-[#181d1b] font-body-md text-[13px] placeholder-[#424844]/60 focus:outline-none hover:border-[#112e20]/40 focus:border-[#112e20] transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-caps text-[10px] uppercase tracking-wider text-[#424844] block font-bold">
                      Phone Number
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      type="tel"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/60 text-[#181d1b] font-body-md text-[13px] placeholder-[#424844]/60 focus:outline-none hover:border-[#112e20]/40 focus:border-[#112e20] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-label-caps text-[10px] uppercase tracking-wider text-[#424844] block font-bold">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/60 text-[#181d1b] font-body-md text-[13px] focus:outline-none hover:border-[#112e20]/40 focus:border-[#112e20] transition-colors cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Hair Artistry Consultation">Hair Artistry Consultation</option>
                    <option value="VIP Bridal / Groom Booking">VIP Bridal / Groom Booking</option>
                    <option value="HydraFacial / Skin Treatment">HydraFacial / Skin Treatment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-label-caps text-[10px] uppercase tracking-wider text-[#424844] block font-bold">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="How can our salon concierge assist you today?"
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/60 text-[#181d1b] font-body-md text-[13px] placeholder-[#424844]/60 focus:outline-none hover:border-[#112e20]/40 focus:border-[#112e20] transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-5 rounded-full bg-[#9b4521] hover:bg-[#fe9167] hover:text-[#752906] text-white font-title-md text-[13px] font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Send Inquiry</span>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>

                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-5 rounded-full bg-[#042018] hover:bg-[#0a382b] text-white font-title-md text-[13px] font-semibold border border-[#175240] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#fe753c]">chat</span>
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                {formSubmitted && (
                  <div className="p-3 bg-[#caead5]/50 border border-[#284435]/20 rounded-xl text-[12px] text-[#112e20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#112e20]">check_circle</span>
                    <span>Thank you! Our concierge team will connect with you shortly.</span>
                  </div>
                )}
              </form>
            </div>

            <div className="pt-3 border-t border-[#c2c8c2]/40 flex items-center justify-between text-[11px] text-[#424844]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#9b4521]">verified</span>
                Direct Desk Response
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#185341]" />
                Concierge Active
              </span>
            </div>
          </div>

          {/* Right Column: StyleX Luxury Brand Map Overview Snapshot (7 cols) */}
          <div className="lg:col-span-7 h-full min-h-[520px] flex flex-col space-y-4">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-[#031b14] border border-[#185341] h-full min-h-[520px] flex flex-col group select-none">
              
              {/* Static High-Res Brand Cartography Map Image */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src="/images/tirur_map_snapshot.jpg"
                  alt="StyleX Signature Salon Tirur Location Map"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Subtle Luxury Vignette & Brand Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#021811]/90 via-[#021811]/25 to-[#021811]/70 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,24,17,0.6)_100%)] pointer-events-none" />
              </div>

              {/* Top Bar: Address & Verified Flagship Badge */}
              <div className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
                <div className="bg-[#031b14]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-[#185341] flex items-center gap-2 text-white font-label-md text-[12px] sm:text-[13px] font-semibold">
                  <span className="material-symbols-outlined text-[#fe753c] text-[18px]">location_on</span>
                  <span className="truncate">{SALON_DATA.addressLine1}, {SALON_DATA.addressLine2}, Tirur</span>
                </div>

                <div className="bg-[#042018]/90 text-[#a6d0be] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#185341] shadow-xl text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#fe753c] animate-pulse" />
                  <span>Tirur Outlet • Map Overview</span>
                </div>
              </div>

              {/* Center Floating Salon Atelier Interactive Card (links to Maps) */}
              <div className="relative z-10 my-auto mx-auto px-4 pointer-events-auto">
                <a
                  href={SALON_DATA.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 sm:p-5 rounded-2xl bg-[#031b14]/90 backdrop-blur-xl border border-[#185341] shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-center max-w-[280px] sm:max-w-[320px] transition-all transform hover:-translate-y-1 hover:border-[#fe753c] hover:shadow-[0_16px_45px_rgba(254,117,60,0.25)] group/card"
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#fe753c]/20 border border-[#fe753c]/40 flex items-center justify-center text-[#fe753c] group-hover/card:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">storefront</span>
                  </div>
                  <h4 className="font-bold text-white text-[15px] sm:text-[16px]">StyleX Signature Salon</h4>
                  <p className="text-[#a6d0be] text-[12px] mt-0.5">One Arcade, Near Lenskart, KG Padi Rd</p>
                  <p className="text-[#7ea696] text-[11px] mt-1 font-medium">🕒 Open Daily 10:00 AM – 1:00 AM</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fe753c] text-white text-[11px] font-bold shadow-md">
                    <span>Open in Google Maps</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_outward</span>
                  </div>
                </a>
              </div>

              {/* Bottom Actions & Transit Information */}
              <div className="relative z-10 p-4 sm:p-5 mt-auto flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
                {/* Transit Distance Badges */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#caead5]/90">
                  <div className="bg-[#031b14]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Tirur Rly Stn: ~1.2 km</span>
                  </div>
                  <div className="bg-[#031b14]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Bus Stand: ~900 m</span>
                  </div>
                </div>

                {/* Direct Directions Action */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${TIRUR_COORDINATES[0]},${TIRUR_COORDINATES[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#fe753c] hover:bg-[#e8652d] text-white font-label-md text-[12.5px] font-bold shadow-[0_4px_16px_rgba(254,117,60,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[17px]">directions</span>
                  <span>Get Driving Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
