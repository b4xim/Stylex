import React, { useState } from 'react';
import { VIPClient } from '../types';
import { getWhatsAppUrl, WhatsAppIcon } from '../utils/whatsapp';

interface ClientsViewProps {
  clients?: VIPClient[];
  onBookClient: (clientName: string, clientPhone: string) => void;
  onDeleteClient?: (id: string) => void;
  globalSearchQuery?: string;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients = [],
  onBookClient,
  onDeleteClient,
  globalSearchQuery = '',
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [clientToDelete, setClientToDelete] = useState<VIPClient | null>(null);

  const effectiveSearch = (globalSearchQuery || localSearch).toLowerCase().trim();

  const safeClients = Array.isArray(clients) ? clients : [];

  const filtered = safeClients.filter((c) => {
    if (!c) return false;
    if (!effectiveSearch) return true;
    const name = (c.name || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const ritual = (c.favoriteRitual || '').toLowerCase();
    return (
      name.includes(effectiveSearch) ||
      phone.includes(effectiveSearch) ||
      email.includes(effectiveSearch) ||
      ritual.includes(effectiveSearch)
    );
  });

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c2c8c2]/30 dark:border-white/10 pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#112e20] dark:text-white tracking-tight">
            Clients Directory
          </h1>
          <p className="text-sm text-[#424844] dark:text-[#a0aca4] mt-1">
            Guest preferences, contact information, and appointment history.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#424844] dark:text-[#88998f] text-[18px]">
            search
          </span>
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-[#192720] text-[#181d1b] dark:text-white placeholder:text-[#424844] dark:placeholder:text-[#7d9085] text-sm outline-none shadow-xs border border-[#c2c8c2]/30 dark:border-[#2a3c31] focus:ring-1 focus:ring-[#112e20] dark:focus:ring-emerald-400"
            placeholder="Search clients by name, phone, email..."
          />
        </div>
      </div>

      {/* Clients Container */}
      <div className="bg-white dark:bg-[#15201a] rounded-2xl shadow-sm border border-[#c2c8c2]/30 dark:border-white/10 overflow-hidden">
        {/* MOBILE VIEW: Clean Native-Style Client Cards */}
        <div className="md:hidden flex flex-col divide-y divide-[#eaefeb] dark:divide-white/10">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#727973] dark:text-[#a0aca4]">
              No clients found matching your search.
            </div>
          ) : (
            filtered.map((client) => (
              <div key={client.id} className="p-3.5 flex flex-col gap-2.5">
                {/* Header: Avatar, Name & WhatsApp */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#112e20] dark:bg-[#1f3a2c] text-white flex items-center justify-center font-bold text-sm shadow-xs border border-transparent dark:border-emerald-500/20 shrink-0">
                      {client.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#112e20] dark:text-white truncate">
                        {client.name}
                      </div>
                      <div className="text-xs text-[#424844] dark:text-[#a0aca4] flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span>{client.phone}</span>
                        {client.email && (
                          <>
                            <span>•</span>
                            <span className="text-[#2d6a4f] dark:text-[#86efac] truncate max-w-[120px]">{client.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    href={getWhatsAppUrl(client.phone, client.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#0f7a37] dark:text-[#4ade80] hover:text-white dark:hover:text-white transition-all text-[11px] font-semibold group/wa shadow-2xs shrink-0"
                    title={`Chat with ${client.name} on WhatsApp`}
                  >
                    <WhatsAppIcon className="w-3 h-3 text-[#25D366] group-hover/wa:text-white transition-colors" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Ritual & Visits Info */}
                <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[#f8faf8] dark:bg-[#192720] border border-[#c2c8c2]/20 dark:border-white/5">
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-[#181d1b] dark:text-white block truncate">
                      {client.favoriteRitual}
                    </span>
                    <span className="text-[11px] text-[#526058] dark:text-[#a0aca4] block truncate">
                      Stylist: {client.preferredStylist}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-bold text-[#112e20] dark:text-[#caead5] text-xs">
                      {client.totalVisits} sessions
                    </span>
                    <span className="text-[10px] text-[#727973] dark:text-[#88998f] block">
                      Last: {client.lastVisit}
                    </span>
                  </div>
                </div>

                {/* Notes (if present) */}
                {client.notes && (
                  <p className="text-[11px] text-[#526058] dark:text-[#a0aca4] italic bg-white dark:bg-[#131d17] p-2 rounded-lg border border-[#c2c8c2]/20 dark:border-white/5 line-clamp-2">
                    "{client.notes}"
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#dfe4e0]/50 dark:border-white/10">
                  <button
                    onClick={() => onBookClient(client.name, client.phone)}
                    className="flex-1 py-1.5 rounded-lg bg-[#9b4521] hover:bg-[#752906] text-white text-xs font-semibold shadow-2xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                    <span>Book Session</span>
                  </button>
                  {onDeleteClient && (
                    <button
                      onClick={() => setClientToDelete(client)}
                      title={`Delete ${client.name}`}
                      className="p-1.5 rounded-lg text-[#727973] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP VIEW: Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#f0f5f1] dark:bg-[#1a2520] text-[#424844] dark:text-[#a0aca4] text-[11px] uppercase tracking-wider font-semibold border-b border-[#c2c8c2]/30 dark:border-white/10">
                <th className="py-3.5 px-6">Client</th>
                <th className="py-3.5 px-4">Preferred Stylist & Favorite Ritual</th>
                <th className="py-3.5 px-4">Visits</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaefeb] dark:divide-white/10">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-[#f0f5f1]/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#112e20] dark:bg-[#1f3a2c] text-white flex items-center justify-center font-bold text-sm shadow-xs border border-transparent dark:border-emerald-500/20">
                        {client.initials}
                      </div>
                      <div>
                        <div className="text-base font-semibold text-[#112e20] dark:text-white leading-tight flex items-center gap-2 flex-wrap">
                          <span>{client.name}</span>
                          <a
                            href={getWhatsAppUrl(client.phone, client.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#0f7a37] dark:text-[#4ade80] hover:text-white dark:hover:text-white transition-all text-[10px] font-semibold group/wa shadow-2xs"
                            title={`Chat with ${client.name} on WhatsApp`}
                          >
                            <WhatsAppIcon className="w-3 h-3 text-[#25D366] group-hover/wa:text-white transition-colors" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                        <div className="text-xs text-[#424844] dark:text-[#a0aca4] mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span>{client.phone}</span>
                          {client.email && (
                            <>
                              <span>•</span>
                              <span className="inline-flex items-center gap-0.5 text-[#2d6a4f] dark:text-[#86efac] font-medium">
                                <span className="material-symbols-outlined text-[12px]">mail</span>
                                <span>{client.email}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 align-middle">
                    <div className="text-sm font-semibold text-[#181d1b] dark:text-white">
                      {client.favoriteRitual}
                    </div>
                    <div className="text-xs text-[#424844] dark:text-[#a0aca4] mt-0.5">
                      with {client.preferredStylist}
                    </div>
                  </td>

                  <td className="py-4 px-4 align-middle">
                    <div className="text-sm font-bold text-[#112e20] dark:text-[#caead5]">
                      {client.totalVisits} sessions
                    </div>
                    <div className="text-xs text-[#727973] dark:text-[#88998f]">{client.lastVisit}</div>
                  </td>

                  <td className="py-4 px-4 align-middle">
                    <div className="text-xs text-[#424844] dark:text-[#a0aca4] italic max-w-xs line-clamp-2">
                      {client.notes}
                    </div>
                  </td>

                  <td className="py-4 px-6 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onBookClient(client.name, client.phone)}
                        className="px-4 py-1.5 rounded-full bg-[#9b4521] hover:bg-[#752906] dark:bg-[#c2592d] dark:hover:bg-[#9b4521] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      >
                        Book Session
                      </button>
                      {onDeleteClient && (
                        <button
                          onClick={() => setClientToDelete(client)}
                          title={`Delete ${client.name}`}
                          className="p-1.5 rounded-full text-[#727973] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-UI Confirmation Dialog for Client Profile Deletion */}
      {clientToDelete && (
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
                  Delete Client Profile?
                </h3>
                <p className="text-xs text-[#526058] dark:text-[#a0aca4] mt-2 leading-relaxed">
                  Are you sure you want to permanently remove <span className="font-bold text-[#112e20] dark:text-white">{clientToDelete.name}</span> ({clientToDelete.phone}) from the clients directory?
                </p>
                <div className="flex items-center gap-2.5 mt-5 justify-end">
                  <button
                    type="button"
                    onClick={() => setClientToDelete(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#424844] dark:text-[#a0aca4] hover:bg-[#eaefeb] dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const id = clientToDelete.id;
                      setClientToDelete(null);
                      onDeleteClient?.(id);
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
