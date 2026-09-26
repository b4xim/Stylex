import React, { useState } from 'react';

interface ContactAndMapProps {
  onOpenDirections: () => void;
}

export const ContactAndMap: React.FC<ContactAndMapProps> = ({ onOpenDirections }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFullName('');
      setEmail('');
      setMessage('');
    }, 2000);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 1.8));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.8));
  };

  return (
    <section className="w-full bg-[#f0f5f1] py-20 px-4 sm:px-6 lg:px-12 border-t border-[#c2c8c2]/40" id="contact-location">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <span className="font-label-caps text-[11px] uppercase tracking-wider text-[#9b4521] font-bold">
            Concierge & Destination
          </span>
          <h2 className="font-headline-lg text-[32px] sm:text-[40px] text-[#112e20] leading-tight">
            Visit Our Atelier & Contact Us
          </h2>
          <p className="font-body-lg text-[15px] sm:text-[16px] text-[#424844]">
            Private valet at your arrival. Walk-ins accommodated based on daily artisan availability.
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
                  Get in Touch
                </h3>
                <p className="font-body-md text-[13px] sm:text-[14px] text-[#424844]">
                  Have a question, media inquiry, or special request? Send us a message and our atelier concierge
                  team will respond shortly.
                </p>
              </div>

              {/* Direct Info Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-[#f0f5f1] p-3 rounded-2xl border border-[#112e20]/5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#9b4521]/10 flex items-center justify-center text-[#9b4521] flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-caption text-[10px] text-[#424844] uppercase font-bold tracking-wider">Direct Line</p>
                    <p className="font-label-md text-[12px] text-[#112e20] font-semibold truncate">+1 (555) 789-2539</p>
                  </div>
                </div>

                <div className="bg-[#f0f5f1] p-3 rounded-2xl border border-[#112e20]/5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#112e20]/10 flex items-center justify-center text-[#112e20] flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-caption text-[10px] text-[#424844] uppercase font-bold tracking-wider">Concierge Email</p>
                    <p className="font-label-md text-[12px] text-[#112e20] font-semibold truncate">concierge@stylexsalon.com</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-label-caps text-[10px] uppercase tracking-wider text-[#424844] block font-bold">
                      First & Last Name
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Vivienne Laurent"
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/60 text-[#181d1b] font-body-md text-[13px] placeholder-[#424844]/60 focus:outline-none hover:border-[#112e20]/40 focus:border-[#112e20] transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-caps text-[10px] uppercase tracking-wider text-[#424844] block font-bold">
                      Email Address
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="vivienne@atelier.com"
                      type="email"
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
                    <option value="Press & Media">Press & Media</option>
                    <option value="Bridal & Private Events">Bridal & Private Events</option>
                    <option value="Artisan & Stylist Careers">Artisan & Stylist Careers</option>
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
                    placeholder="How can our atelier assist you today?"
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/60 text-[#181d1b] font-body-md text-[13px] placeholder-[#424844]/60 focus:outline-none hover:border-[#112e20]/40 focus:border-[#112e20] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#9b4521] hover:bg-[#fe9167] hover:text-[#752906] text-white font-title-md text-[14px] font-bold shadow-[0_6px_20px_-2px_rgba(155,69,33,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Send Message</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>

                {formSubmitted && (
                  <div className="p-3 bg-[#caead5]/50 border border-[#284435]/20 rounded-xl text-[12px] text-[#112e20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#112e20]">check_circle</span>
                    <span>Thank you! Our concierge team will respond within 2-4 business hours.</span>
                  </div>
                )}
              </form>
            </div>

            <div className="pt-3 border-t border-[#c2c8c2]/40 flex items-center justify-between text-[11px] text-[#424844]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#9b4521]">schedule</span>
                We usually respond within 2-4 business hours.
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#185341]" />
                Atelier Concierge Active
              </span>
            </div>
          </div>

          {/* Right Column: Styled Interactive Dark Emerald Map Canvas (7 cols) */}
          <div className="lg:col-span-7 h-full min-h-[460px] flex flex-col space-y-4">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-xl bg-[#284435] border border-[#112e20]/20 h-full min-h-[460px]">
              {/* Map Canvas Background */}
              <div
                className="absolute inset-0 bg-[#14231b] flex items-center justify-center overflow-hidden transition-transform duration-300"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* SVG Vector Map Grid */}
                <svg className="w-full h-full opacity-25" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <path d="M0 120 L800 120 M0 280 L800 280 M0 450 L800 450" fill="none" stroke="#caead5" strokeWidth="6" />
                  <path d="M180 0 L180 600 M380 0 L380 600 M590 0 L590 600" fill="none" stroke="#caead5" strokeWidth="5" />
                  {/* Diagonal Arterial Avenue */}
                  <path d="M50 0 L750 600" fill="none" stroke="#fe9167" strokeDasharray="10 6" strokeWidth="4" />
                  <circle cx="380" cy="280" fill="#284435" opacity="0.3" r="160" />
                </svg>

                {/* Central Stylized Pin */}
                <div className="absolute flex flex-col items-center z-20" style={{ transform: 'translate(0, -20px)' }}>
                  <div className="bg-[#9b4521] text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 border border-[#ffdbcf]">
                    <span className="material-symbols-outlined text-[20px]">content_cut</span>
                    <span className="font-title-md text-[14px] font-bold">StyleX Atelier</span>
                  </div>
                  <div className="w-4 h-4 bg-[#9b4521] rotate-45 -mt-2" />
                  <div className="w-8 h-2.5 bg-black/50 rounded-full mt-2 blur-xs" />
                </div>

                {/* Surrounding Landmarks */}
                <div className="absolute top-24 left-16 bg-[#112e20]/90 backdrop-blur px-3 py-1.5 rounded-lg text-[#caead5] text-[11px] border border-[#caead5]/20 shadow-md">
                  Mayfair Gardens
                </div>
                <div className="absolute bottom-28 right-24 bg-[#112e20]/90 backdrop-blur px-3 py-1.5 rounded-lg text-[#caead5] text-[11px] border border-[#caead5]/20 shadow-md">
                  Midtown Valet Pavilion
                </div>
              </div>

              {/* Top Left Floating Address Pill */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#112e20]/10 flex items-center gap-2 text-[#112e20] font-label-md text-[13px] font-semibold">
                  <span className="material-symbols-outlined text-[#9b4521] text-[18px]">explore</span>
                  <span>482 Mayfair Boulevard, Suite 100</span>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomIn}
                    aria-label="Zoom In"
                    className="w-10 h-10 rounded-full bg-white text-[#112e20] shadow-lg flex items-center justify-center hover:bg-[#f0f5f1] transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                  <button
                    onClick={handleZoomOut}
                    aria-label="Zoom Out"
                    className="w-10 h-10 rounded-full bg-white text-[#112e20] shadow-lg flex items-center justify-center hover:bg-[#f0f5f1] transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">remove</span>
                  </button>
                </div>

                <button
                  onClick={onOpenDirections}
                  className="px-5 py-2.5 rounded-full bg-[#9b4521] text-white font-label-md text-[13px] font-semibold shadow-xl hover:bg-[#fe9167] hover:text-[#752906] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">near_me</span>
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
