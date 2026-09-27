import React, { useState } from 'react';
import { VIPClient } from '../types';
import { getWhatsAppUrl, WhatsAppIcon } from '../utils/whatsapp';

interface ClientsViewProps {
  clients?: VIPClient[];
  onBookClient: (clientName: string, clientPhone: string) => void;
  globalSearchQuery?: string;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients = [],
  onBookClient,
  globalSearchQuery = '',
}) => {
  const [filterTier, setFilterTier] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState('');

  const effectiveSearch = (globalSearchQuery || localSearch).toLowerCase().trim();

  const safeClients = Array.isArray(clients) ? clients : [];

  const filtered = safeClients.filter((c) => {
    if (filterTier !== 'all' && c.tier !== filterTier) return false;
    if (!effectiveSearch) return true;
    return (
      c.name.toLowerCase().includes(effectiveSearch) ||
      c.phone.toLowerCase().includes(effectiveSearch) ||
      c.email.toLowerCase().includes(effectiveSearch) ||
      c.favoriteRitual.toLowerCase().includes(effectiveSearch)
    );
  });

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c2c8c2]/30 dark:border-white/10 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#112e20] dark:text-white tracking-tight">
            Clients & VIP Directory
          </h1>
          <p className="text-sm text-[#424844] dark:text-[#a0aca4] mt-1">
            Personalized guest preferences, formula notes, and VIP concierge tier statuses.
          </p>
        </div>

        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#424844] dark:text-[#88998f] text-[18px]">
            search
          </span>
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-[#192720] text-[#181d1b] dark:text-white placeholder:text-[#424844] dark:placeholder:text-[#7d9085] text-sm outline-none shadow-xs border border-[#c2c8c2]/30 dark:border-[#2a3c31] focus:ring-1 focus:ring-[#112e20] dark:focus:ring-emerald-400"
            placeholder="Search VIP clients, phone, ritual..."
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'VIP Platinum', 'VIP Gold', 'VIP Member'].map((tier) => (
          <button
            key={tier}
            onClick={() => setFilterTier(tier)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filterTier === tier
                ? 'bg-[#112e20] dark:bg-[#203a2c] text-white shadow-xs'
                : 'bg-[#eaefeb] dark:bg-[#1f2d25] text-[#181d1b] dark:text-[#d3ded8] hover:bg-[#e5e9e6] dark:hover:bg-[#293c31]'
            }`}
          >
            {tier === 'all' ? 'All Clients' : tier}
          </button>
        ))}
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-[#15201a] rounded-2xl shadow-sm border border-[#c2c8c2]/30 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#f0f5f1] dark:bg-[#1a2520] text-[#424844] dark:text-[#a0aca4] text-[11px] uppercase tracking-wider font-semibold border-b border-[#c2c8c2]/30 dark:border-white/10">
                <th className="py-3.5 px-6">Client</th>
                <th className="py-3.5 px-4">Tier</th>
                <th className="py-3.5 px-4">Preferred Stylist & Favorite Ritual</th>
                <th className="py-3.5 px-4">Visits</th>
                <th className="py-3.5 px-4">Concierge Notes</th>
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
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ${
                        client.tier === 'VIP Platinum'
                          ? 'bg-[#284435] text-white border-transparent'
                          : client.tier === 'VIP Gold'
                          ? 'bg-[#ffe088] dark:bg-amber-950/60 text-[#241a00] dark:text-amber-300 border-transparent dark:border-amber-500/30'
                          : 'bg-[#ffdbcf] dark:bg-orange-950/60 text-[#380d00] dark:text-orange-300 border-transparent dark:border-orange-500/30'
                      }`}
                    >
                      {client.tier}
                    </span>
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
                    <button
                      onClick={() => onBookClient(client.name, client.phone)}
                      className="px-4 py-1.5 rounded-full bg-[#9b4521] hover:bg-[#752906] dark:bg-[#c2592d] dark:hover:bg-[#9b4521] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      Book Session
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
