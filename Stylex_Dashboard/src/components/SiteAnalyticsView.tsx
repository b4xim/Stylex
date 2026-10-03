import React, { useState, useEffect, useRef } from 'react';
import { UserAccount } from '../types';
import { DashboardApi } from '../services/api';

interface SiteAnalyticsViewProps {
  currentUser: UserAccount;
}

interface AnalyticsSummaryData {
  engine: string;
  status: 'ONLINE' | 'STANDBY' | 'EMPTY_LOG';
  logFileFound: boolean;
  logFilePath: string | null;
  logFileSize: string;
  totalLines: number;
  uniqueIpsCount: number;
  topUrls: { path: string; hits: number }[];
  topReferrers: { referrer: string; hits: number }[];
  topDevices: { name: string; count: number }[];
  statusCodeBreakdown: Record<string, number>;
  lastGenerated: string;
}

export const SiteAnalyticsView: React.FC<SiteAnalyticsViewProps> = ({ currentUser }) => {
  const isDeveloper =
    currentUser?.role === 'Developer' ||
    currentUser?.username === 'developer' ||
    currentUser?.email?.startsWith('developer');

  const [summary, setSummary] = useState<AnalyticsSummaryData | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const token = DashboardApi.getToken() || '';
  const reportUrl = `/api/analytics/report?token=${encodeURIComponent(token)}&t=${iframeKey}`;

  const loadSummaryData = async () => {
    setIsLoadingSummary(true);
    try {
      const data = await DashboardApi.getAnalyticsSummary();
      if (data) {
        setSummary(data);
      }
    } catch (err) {
      console.warn('Failed to load analytics summary:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (isDeveloper) {
      loadSummaryData();
    }
  }, [isDeveloper]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setIframeLoading(true);
    try {
      await DashboardApi.refreshAnalyticsReport();
      await loadSummaryData();
      setIframeKey(Date.now());
    } catch (err) {
      console.error('Error refreshing analytics report:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Guard: If not developer
  if (!isDeveloper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>
        <h2 className="text-xl font-bold text-[#112e20] dark:text-white">
          Developer Access Required
        </h2>
        <p className="text-sm text-[#424844] dark:text-neutral-400 max-w-md mt-2">
          The Site Analytics & Infrastructure Telemetry tab is restricted exclusively to Developer accounts. Please sign in with developer credentials to view live server web traffic.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full pb-16 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#c2c8c2]/30 dark:border-white/10">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#112e20] dark:bg-white/10 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <span className="material-symbols-outlined text-[26px] text-[#25D366]">monitoring</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-2xl sm:text-3xl text-[#112e20] dark:text-white font-bold tracking-tight">
                Site Analytics & Traffic Intelligence
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#112e20]/10 dark:bg-white/10 text-[#112e20] dark:text-neutral-200 border border-[#112e20]/20 dark:border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                GoAccess Engine Active
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <span className="material-symbols-outlined text-[13px]">code</span>
                Developer View
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#424844] dark:text-neutral-400 mt-1">
              Real-time, privacy-first web traffic analysis parsed directly from Nginx server access logs. Zero third-party tracking cookies.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#15201a] border border-[#c2c8c2]/50 dark:border-white/10 text-neutral-800 dark:text-white text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-[18px] text-[#112e20] dark:text-white ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isRefreshing ? 'Parsing Logs...' : 'Refresh Analytics'}</span>
          </button>

          <a
            href={reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#112e20] hover:bg-[#1a4430] text-white text-xs font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>Open in Full Window</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Web Hits */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#15201a] border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Web Requests</span>
            <span className="material-symbols-outlined text-[20px] text-[#25D366]">public</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#112e20] dark:text-white">
              {isLoadingSummary ? '...' : (summary?.totalLines || 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-[#735c00] dark:text-amber-400 font-semibold">Hits</span>
          </div>
          <span className="text-[11px] text-[#727973] dark:text-neutral-400 mt-2">
            All HTTP 200/301 client requests
          </span>
        </div>

        {/* Card 2: Unique Client IPs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#15201a] border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Unique Visitor IPs</span>
            <span className="material-symbols-outlined text-[20px] text-[#128C7E]">fingerprint</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#112e20] dark:text-white">
              {isLoadingSummary ? '...' : (summary?.uniqueIpsCount || 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Unique</span>
          </div>
          <span className="text-[11px] text-[#727973] dark:text-neutral-400 mt-2">
            Anonymized for GDPR & privacy
          </span>
        </div>

        {/* Card 3: Log Size & Volume */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#15201a] border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Nginx Log Volume</span>
            <span className="material-symbols-outlined text-[20px] text-[#fe753c]">data_usage</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#112e20] dark:text-white">
              {isLoadingSummary ? '...' : summary?.logFileSize || '0 KB'}
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold">Active Log</span>
          </div>
          <span className="text-[11px] text-[#727973] dark:text-neutral-400 mt-2 truncate">
            {summary?.logFilePath || '/var/log/nginx/stylex_access.log'}
          </span>
        </div>

        {/* Card 4: Architecture & Privacy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#15201a] border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tracking Engine</span>
            <span className="material-symbols-outlined text-[20px] text-blue-500">security</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#112e20] dark:text-white truncate">
              GoAccess v1.9
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Zero Client Tracking Lag
          </span>
        </div>
      </div>

      {/* Quick Insights Banner (Referrers, Popular URLs, Devices) */}
      {summary && (summary.topUrls.length > 0 || summary.topReferrers.length > 0 || summary.topDevices.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#f0f5f1] dark:bg-white/5 border border-[#c2c8c2]/30 dark:border-white/10 text-xs">
          {/* Top URLs */}
          <div>
            <h4 className="font-bold text-[#112e20] dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#fe753c]">link</span>
              Top Visited Routes
            </h4>
            <div className="flex flex-col gap-1.5">
              {summary.topUrls.length === 0 ? (
                <span className="text-neutral-400">Waiting for traffic data...</span>
              ) : (
                summary.topUrls.map((u, i) => (
                  <div key={i} className="flex items-center justify-between text-[#424844] dark:text-neutral-300">
                    <span className="font-mono text-[11px] truncate max-w-[200px]" title={u.path}>
                      {u.path === '/' ? '/ (Home Landing)' : u.path}
                    </span>
                    <span className="font-bold text-[#112e20] dark:text-white bg-white dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                      {u.hits}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Referrers */}
          <div>
            <h4 className="font-bold text-[#112e20] dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">travel_explore</span>
              Top Referrers
            </h4>
            <div className="flex flex-col gap-1.5">
              {summary.topReferrers.length === 0 ? (
                <span className="text-neutral-400">Direct / Organic visits predominant</span>
              ) : (
                summary.topReferrers.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-[#424844] dark:text-neutral-300">
                    <span className="truncate max-w-[200px] text-[11px]" title={r.referrer}>
                      {r.referrer}
                    </span>
                    <span className="font-bold text-[#112e20] dark:text-white bg-white dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                      {r.hits}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Device Distribution */}
          <div>
            <h4 className="font-bold text-[#112e20] dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-blue-500">devices</span>
              Client Devices
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {summary.topDevices.length === 0 ? (
                <span className="text-neutral-400">Detecting user agents...</span>
              ) : (
                summary.topDevices.map((d, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-white/10 border border-[#c2c8c2]/30 dark:border-white/10 text-[11px] font-semibold text-[#112e20] dark:text-neutral-200"
                  >
                    <span>{d.name}:</span>
                    <strong className="text-[#fe753c]">{d.count}</strong>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Embedded Interactive GoAccess Dashboard Viewer */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 px-1">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#25D366]">terminal</span>
            <span>Interactive Web Log Telemetry Console</span>
          </span>
          <span className="hidden sm:inline">Updated automatically from Nginx combined access log</span>
        </div>

        <div className="relative w-full rounded-2xl overflow-hidden border border-[#c2c8c2]/40 dark:border-white/10 shadow-xl bg-[#0b1812] min-h-[750px] lg:min-h-[850px]">
          {iframeLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0b1812]/90 backdrop-blur-xs text-white p-6">
              <div className="w-10 h-10 border-3 border-white/20 border-t-[#fe753c] rounded-full animate-spin mb-3" />
              <p className="text-sm font-semibold">Streaming GoAccess Interactive Telemetry...</p>
              <p className="text-xs text-neutral-400 mt-1">Connecting to authenticated server log gateway</p>
            </div>
          )}

          <iframe
            ref={iframeRef}
            key={iframeKey}
            src={reportUrl}
            title="StyleX GoAccess Real-Time Web Telemetry"
            onLoad={() => setIframeLoading(false)}
            className="w-full h-[750px] lg:h-[850px] border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
};
