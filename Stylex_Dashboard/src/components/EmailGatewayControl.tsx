import React, { useState, useEffect } from 'react';
import { DashboardApi } from '../services/api';

interface EmailStatusData {
  configured: boolean;
  smtpUser: string | null;
  smtpHost: string;
  smtpPort: number;
  fromAddress: string;
}

interface EmailGatewayControlProps {
  disabled?: boolean;
}

export const EmailGatewayControl: React.FC<EmailGatewayControlProps> = ({ disabled = false }) => {
  const [status, setStatus] = useState<EmailStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testFeedback, setTestFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchEmailStatus = async () => {
    try {
      const data = await DashboardApi.getEmailStatus();
      if (data) {
        setStatus(data);
      }
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailStatus();
  }, []);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim() || isSendingTest) return;

    setIsSendingTest(true);
    setTestFeedback(null);
    try {
      const res = await DashboardApi.sendEmailTest(testEmail.trim());
      if (res?.success) {
        setTestFeedback({
          type: 'success',
          text: `✅ Verification email successfully dispatched to ${testEmail.trim()}! Check your inbox or spam folder.`,
        });
        setTestEmail('');
      } else {
        setTestFeedback({
          type: 'error',
          text: res?.message || '❌ Failed to send verification email. Verify your Gmail SMTP credentials in .env.',
        });
      }
    } catch (err: any) {
      setTestFeedback({
        type: 'error',
        text: err?.message || '❌ Communication error with email gateway service.',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const isConfigured = Boolean(status?.configured);

  return (
    <section className="bg-white dark:bg-[#15201a] rounded-xl p-6 shadow-sm flex flex-col gap-5 border border-[#c2c8c2]/30 dark:border-white/10 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#c2c8c2]/30 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">mail</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#112e20] dark:text-white">
                Automated Email Gateway
              </h2>
              {isLoading ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  Checking...
                </span>
              ) : isConfigured ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SMTP Ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Pending .env Setup
                </span>
              )}
            </div>
            <p className="text-xs text-[#424844] dark:text-neutral-400 mt-0.5">
              Dispatches branded appointment passes, calendar invites, and reschedule notices via Gmail SMTP.
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#f7faf8] dark:bg-black/20 p-3.5 rounded-xl border border-[#c2c8c2]/30 dark:border-white/5">
          <span className="text-[11px] font-semibold text-[#727973] dark:text-neutral-400 uppercase tracking-wider block">
            SMTP Server
          </span>
          <span className="text-sm font-bold text-[#112e20] dark:text-white mt-1 block">
            {status?.smtpHost || 'smtp.gmail.com'}:{status?.smtpPort || 587}
          </span>
        </div>

        <div className="bg-[#f7faf8] dark:bg-black/20 p-3.5 rounded-xl border border-[#c2c8c2]/30 dark:border-white/5">
          <span className="text-[11px] font-semibold text-[#727973] dark:text-neutral-400 uppercase tracking-wider block">
            Sender Account
          </span>
          <span className="text-sm font-bold text-[#112e20] dark:text-white mt-1 block truncate" title={status?.smtpUser || 'Not configured'}>
            {status?.smtpUser || (isConfigured ? 'Connected' : 'Not configured')}
          </span>
        </div>

        <div className="bg-[#f7faf8] dark:bg-black/20 p-3.5 rounded-xl border border-[#c2c8c2]/30 dark:border-white/5">
          <span className="text-[11px] font-semibold text-[#727973] dark:text-neutral-400 uppercase tracking-wider block">
            Display Sender
          </span>
          <span className="text-sm font-bold text-[#112e20] dark:text-white mt-1 block truncate" title={status?.fromAddress || ''}>
            {status?.fromAddress || 'StyleX Signature Salon'}
          </span>
        </div>
      </div>

      {/* Test Email Dispatch Form */}
      <div className="pt-2 border-t border-[#c2c8c2]/30 dark:border-white/10">
        <span className="text-xs font-bold text-[#112e20] dark:text-white block mb-2">
          Verify Email Dispatch
        </span>
        <form onSubmit={handleSendTest} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Enter your email (e.g. name@gmail.com)..."
            disabled={disabled || isSendingTest}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#c2c8c2] dark:border-white/15 bg-white dark:bg-neutral-800 text-[#112e20] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#112e20] dark:focus:ring-white/40 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || isSendingTest || !testEmail.trim()}
            className="px-4 py-2 bg-[#112e20] hover:bg-[#185341] dark:bg-white dark:text-[#112e20] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            {isSendingTest ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 dark:border-[#112e20]/30 border-t-white dark:border-t-[#112e20] rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Send Test Email</span>
              </>
            )}
          </button>
        </form>

        {testFeedback && (
          <div
            className={`mt-2.5 p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
              testFeedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
            }`}
          >
            <span>{testFeedback.text}</span>
          </div>
        )}
      </div>
    </section>
  );
};
