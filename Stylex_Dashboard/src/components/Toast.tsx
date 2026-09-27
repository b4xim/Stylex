import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#112e20] text-white px-4 py-3 rounded-xl shadow-xl border border-white/10 flex items-start gap-3 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          <span className="material-symbols-outlined text-[20px] text-[#aeceba] mt-0.5">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-tight text-white">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-[#aeceba] mt-0.5 leading-snug">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/60 hover:text-white transition-colors p-0.5"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
