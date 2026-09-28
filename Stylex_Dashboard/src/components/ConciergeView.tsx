import React, { useState } from 'react';
import { ConciergeInquiry } from '../types';

interface ConciergeViewProps {
  inquiries: ConciergeInquiry[];
  onResolveInquiry: (id: string) => void;
  onReplyInquiry: (id: string, replyText: string) => void;
  onDeleteInquiry?: (id: string) => void;
  globalSearchQuery?: string;
}

export const ConciergeView: React.FC<ConciergeViewProps> = ({
  inquiries,
  onResolveInquiry,
  onReplyInquiry,
  onDeleteInquiry,
  globalSearchQuery = '',
}) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [inquiryToDelete, setInquiryToDelete] = useState<ConciergeInquiry | null>(null);

  const filtered = inquiries.filter((inq) => {
    if (!globalSearchQuery) return true;
    const q = globalSearchQuery.toLowerCase();
    return (
      inq.clientName.toLowerCase().includes(q) ||
      inq.serviceRequested.toLowerCase().includes(q) ||
      inq.message.toLowerCase().includes(q)
    );
  });

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;
    onReplyInquiry(id, replyText);
    setReplyText('');
    setActiveReplyId(null);
  };

  const pendingCount = inquiries.filter((i) => i.status === 'Unread').length;

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c2c8c2]/30 dark:border-white/10 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#112e20] dark:text-white tracking-tight">
            Concierge Desk
          </h1>
          <p className="text-sm text-[#424844] dark:text-[#a0aca4] mt-1">
            Direct guest communications, appointment inquiries, and custom requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#735c00] dark:bg-amber-950/60 text-white dark:text-amber-300 text-xs font-bold uppercase tracking-wider border border-transparent dark:border-amber-500/30 shadow-2xs">
            {pendingCount} Pending Inquir{pendingCount === 1 ? 'y' : 'ies'}
          </span>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl p-6 shadow-sm border transition-all ${
              item.status === 'Unread'
                ? 'bg-white dark:bg-[#15201a] border-[#9b4521]/40 dark:border-[#ff9266]/40 ring-1 ring-[#9b4521]/20 dark:ring-[#ff9266]/20'
                : item.status === 'In Progress'
                ? 'bg-white dark:bg-[#15201a] border-[#c2c8c2]/40 dark:border-white/10'
                : 'bg-white/90 dark:bg-[#15201a]/80 border-[#c2c8c2]/30 dark:border-white/10 opacity-90'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#eaefeb] dark:border-white/10">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    item.status === 'Unread'
                      ? 'bg-[#ff5520] animate-pulse ring-2 ring-[#ff5520]/20'
                      : item.status === 'In Progress'
                      ? 'bg-amber-400 ring-2 ring-amber-400/20'
                      : 'bg-emerald-500'
                  }`}
                ></span>
                <span className="font-serif text-xl text-[#112e20] dark:text-white font-semibold">
                  {item.clientName}
                </span>
                <span className="text-xs text-[#727973] dark:text-[#a0aca4]">{item.phone}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs text-[#727973] dark:text-[#88998f]">{item.timeAgo}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    item.status === 'Unread'
                      ? 'bg-[#ffdbcf] dark:bg-red-950/50 text-[#380d00] dark:text-red-300 border-transparent dark:border-red-500/30'
                      : item.status === 'In Progress'
                      ? 'bg-[#ffe088] dark:bg-amber-950/50 text-[#241a00] dark:text-amber-300 border-transparent dark:border-amber-500/30'
                      : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-transparent dark:border-emerald-500/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#112e20] dark:text-white flex-wrap">
                <span className="text-[#9b4521] dark:text-[#ff9266] uppercase tracking-wider font-bold">
                  Inquiry:
                </span>
                <span>{item.serviceRequested}</span>
                <span className="text-[#727973] dark:text-[#a0aca4] font-normal">
                  • Requested {item.preferredDate}
                </span>
              </div>

              <p className="text-sm text-[#181d1b] dark:text-[#e2ece5] leading-relaxed bg-[#f0f5f1] dark:bg-[#1a2520] p-4 rounded-xl border border-[#eaefeb] dark:border-white/10 shadow-2xs">
                "{item.message}"
              </p>
            </div>

            {/* Quick reply section */}
            {activeReplyId === item.id ? (
              <div className="mt-4 pt-4 border-t border-[#eaefeb] dark:border-white/10 space-y-3">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your official concierge response (sent via SMS/Email)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#192720] border border-[#c2c8c2] dark:border-[#2a3c31] text-sm text-[#181d1b] dark:text-white placeholder:text-[#727973] dark:placeholder:text-[#7d9085] focus:ring-1 focus:ring-[#112e20] dark:focus:ring-emerald-400 outline-none shadow-2xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#424844] dark:text-[#a0aca4] hover:bg-[#eaefeb] dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendReply(item.id)}
                    className="px-5 py-1.5 rounded-full bg-[#112e20] dark:bg-[#1f3a2c] hover:bg-[#284435] dark:hover:bg-emerald-600 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    Send Direct Dispatch
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-3.5 border-t border-[#eaefeb] dark:border-white/10 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-[#727973] dark:text-[#88998f]">
                  Connected to StyleX Private Concierge System
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveReplyId(item.id)}
                    className="px-4 py-1.5 rounded-full bg-[#112e20] dark:bg-[#1f3a2c] hover:bg-[#284435] dark:hover:bg-emerald-600 text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    Reply
                  </button>
                  {item.status !== 'Resolved' && (
                    <button
                      onClick={() => onResolveInquiry(item.id)}
                      className="px-4 py-1.5 rounded-full bg-[#eaefeb] dark:bg-[#1f2d25] text-[#112e20] dark:text-[#caead5] hover:bg-[#dfe4e0] dark:hover:bg-[#283b30] text-xs font-semibold transition-colors cursor-pointer border border-transparent dark:border-white/10"
                    >
                      Mark Resolved
                    </button>
                  )}
                  {onDeleteInquiry && (
                    <button
                      onClick={() => setInquiryToDelete(item)}
                      title="Delete message"
                      className="p-1.5 rounded-full text-[#727973] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* In-UI Confirmation Dialog for Inquiry Message Deletion */}
      {inquiryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl w-full max-w-md border border-[#c2c8c2]/40 dark:border-white/10 p-6 overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">delete_forever</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-[#112e20] dark:text-white leading-tight">
                  Delete Concierge Message?
                </h3>
                <p className="text-xs text-[#526058] dark:text-[#a0aca4] mt-2 leading-relaxed">
                  Are you sure you want to permanently delete this message from <span className="font-bold text-[#112e20] dark:text-white">{inquiryToDelete.clientName}</span>?
                </p>
                <div className="flex items-center gap-2.5 mt-5 justify-end">
                  <button
                    type="button"
                    onClick={() => setInquiryToDelete(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#424844] dark:text-[#a0aca4] hover:bg-[#eaefeb] dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const id = inquiryToDelete.id;
                      setInquiryToDelete(null);
                      onDeleteInquiry?.(id);
                    }}
                    className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Yes, Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
