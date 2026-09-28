import React from 'react';
import { Appointment } from '../../types';
import { LOGO_URL } from '../../constants';

interface RunSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  dateStr: string;
}

export const RunSheetModal: React.FC<RunSheetModalProps> = ({
  isOpen,
  onClose,
  appointments,
  dateStr,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112e20]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#c2c8c2]/50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#eaefeb]">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="StyleX" className="h-8 w-auto object-contain" />
            <div>
              <span className="text-[11px] text-[#9b4521] uppercase tracking-wider font-bold">
                Admin Reception Run Sheet
              </span>
              <h3 className="font-serif text-2xl text-[#112e20]">Daily Manifest • {dateStr}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#112e20] text-white text-xs font-semibold hover:bg-[#284435] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#727973] hover:text-[#181d1b] rounded-full hover:bg-[#f0f5f1] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="mt-6 border border-[#eaefeb] rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0f5f1] text-[#424844] font-bold uppercase tracking-wider text-[11px] border-b border-[#eaefeb]">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Service & Ritual</th>
                <th className="py-3 px-4">Stylist & Station</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaefeb]">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-[#f0f5f1]/40">
                  <td className="py-3 px-4 font-bold text-[#112e20]">{apt.time}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#181d1b] block">{apt.clientName}</span>
                    <span className="text-[10px] text-[#727973]">{apt.clientPhone}</span>
                  </td>
                  <td className="py-3 px-4 text-[#181d1b]">
                    <span className="font-medium block">{apt.serviceName}</span>
                    <span className="text-[10px] text-[#727973]">{apt.durationMin} mins</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#112e20] block">{apt.stylistName}</span>
                    <span className="text-[10px] text-[#727973]">{apt.station}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                      apt.status === 'CANCELLED'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : apt.status === 'IN_PROGRESS'
                        ? 'bg-[#9b4521] text-white'
                        : apt.status === 'COMPLETED'
                        ? 'bg-[#e5e9e6] text-[#112e20]'
                        : 'bg-[#caead5] text-[#042014]'
                    }`}>
                      {apt.status === 'CANCELLED' ? 'Cancelled' : apt.status === 'IN_PROGRESS' ? 'In Progress' : apt.status === 'COMPLETED' ? 'Completed' : 'Booked'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#424844] italic max-w-xs truncate">
                    {apt.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-[#727973] pt-2 border-t border-[#eaefeb]">
          <span>StyleX Signature Salon • Tirur Outlet</span>
          <span>Verified Run Sheet Manifest • Station Sync Active</span>
        </div>
      </div>
    </div>
  );
};
