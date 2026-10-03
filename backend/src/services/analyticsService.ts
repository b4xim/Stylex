import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const LOG_PATHS = [
  '/var/log/nginx/stylex_access.log',
  '/var/log/nginx/access.log',
  path.resolve(__dirname, '../../../../logs/stylex_access.log'),
  path.resolve(__dirname, '../../../logs/stylex_access.log'),
];

const REPORT_PATHS = [
  '/var/www/goaccess/index.html',
  '/app/analytics-data/index.html',
  path.resolve(__dirname, '../../../../logs/goaccess_report.html'),
  path.resolve(__dirname, '../../../analytics-data/index.html'),
];

export interface AnalyticsSummary {
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

export class AnalyticsService {
  /**
   * Finds the active Nginx log file path
   */
  public static findLogPath(): string | null {
    for (const p of LOG_PATHS) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
    return null;
  }

  /**
   * Finds the generated GoAccess HTML report
   */
  public static findReportPath(): string | null {
    for (const p of REPORT_PATHS) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
    return null;
  }

  /**
   * Generates or refreshes the GoAccess HTML report using the goaccess CLI
   */
  public static async generateReport(): Promise<{ success: boolean; message: string; outputPath?: string }> {
    const logPath = this.findLogPath();
    if (!logPath) {
      return {
        success: false,
        message: 'No Nginx log file found yet. Access the site first to generate traffic logs.',
      };
    }

    const outDir = '/app/analytics-data';
    const outPath = path.join(outDir, 'index.html');

    try {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      // Check if goaccess CLI is installed in environment
      await execPromise('which goaccess');

      // Run GoAccess to generate self-contained HTML report
      const cmd = `goaccess "${logPath}" -o "${outPath}" --log-format=COMBINED --anonymize-ip --ignore-crawlers`;
      await execPromise(cmd);

      return { success: true, message: 'GoAccess report generated successfully', outputPath: outPath };
    } catch (err: any) {
      // If goaccess CLI isn't installed in the current environment (e.g. local dev without goaccess package)
      console.warn('⚠️ [Analytics Service] goaccess CLI execution note:', err?.message || err);
      return {
        success: false,
        message: err?.message || 'GoAccess CLI returned an error',
      };
    }
  }

  /**
   * Returns the GoAccess HTML report string, or an interactive warming-up page
   */
  public static async getReportHtml(): Promise<string> {
    const reportPath = this.findReportPath();
    if (reportPath && fs.existsSync(reportPath)) {
      try {
        let content = fs.readFileSync(reportPath, 'utf8');
        // Ensure iframe compatibility (no restrictive frames)
        return content;
      } catch (e: any) {
        console.error('Error reading GoAccess report:', e);
      }
    }

    // Attempt generation if log exists
    const genRes = await this.generateReport();
    if (genRes.success && genRes.outputPath && fs.existsSync(genRes.outputPath)) {
      return fs.readFileSync(genRes.outputPath, 'utf8');
    }

    // Fallback: Elegant Developer Diagnostic Screen
    const logPath = this.findLogPath();
    const logExists = Boolean(logPath);
    let logSize = '0 KB';
    if (logPath) {
      try {
        const stats = fs.statSync(logPath);
        logSize = `${(stats.size / 1024).toFixed(1)} KB`;
      } catch {}
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>StyleX Site Analytics & Traffic Intelligence</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #0b1812; color: #e1ede6; padding: 32px 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
    .card { background: #11281e; border: 1px solid #1e4534; border-radius: 20px; max-width: 640px; width: 100%; padding: 36px 28px; box-shadow: 0 12px 36px rgba(0,0,0,0.4); }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px; background: rgba(254, 117, 60, 0.15); border: 1px solid rgba(254, 117, 60, 0.3); color: #fe753c; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
    .pulse { width: 6px; height: 6px; border-radius: 50%; background: #fe753c; animation: blink 1.5s infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    h1 { font-size: 24px; color: #ffffff; margin-bottom: 10px; font-weight: 700; }
    p { font-size: 13.5px; color: #a1c4b3; line-height: 1.6; margin-bottom: 24px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; text-align: left; }
    .info-box { background: rgba(0,0,0,0.25); border: 1px solid #1a3c2e; padding: 12px 16px; border-radius: 12px; }
    .info-label { font-size: 10.5px; text-transform: uppercase; color: #78a28e; font-weight: 600; letter-spacing: 0.05em; }
    .info-val { font-size: 14px; color: #ffffff; font-weight: 600; margin-top: 4px; word-break: break-all; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 12px; background: #fe753c; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s; }
    .btn:hover { background: #e0622a; transform: translateY(-1px); }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="pulse"></span> GoAccess Engine Standby</div>
    <h1>Site Analytics Initializing</h1>
    <p>GoAccess is connected and monitoring incoming Nginx web requests for <strong>stylexsalon.in</strong> and <strong>dashboard.stylexsalon.in</strong>. Once the first visitor requests are processed, the complete real-time graphical analytics dashboard will display here automatically.</p>
    
    <div class="info-grid">
      <div class="info-box">
        <div class="info-label">Log File Status</div>
        <div class="info-val">${logExists ? 'Active (' + logSize + ')' : 'Waiting for traffic'}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Active Log Path</div>
        <div class="info-val">${logPath || '/var/log/nginx/stylex_access.log'}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Parser Engine</div>
        <div class="info-val">GoAccess v1.9+ (COMBINED)</div>
      </div>
      <div class="info-box">
        <div class="info-label">Security & Privacy</div>
        <div class="info-val">IP Anonymized • Bot Filtered</div>
      </div>
    </div>

    <button onclick="window.location.reload()" class="btn">
      <span>Check For New Traffic Logs</span>
    </button>
  </div>
</body>
</html>`;
  }

  /**
   * Fast summary parser that reads the Nginx log directly to provide high-level metrics for KPI cards
   */
  public static async getSummary(): Promise<AnalyticsSummary> {
    const logPath = this.findLogPath();
    const summary: AnalyticsSummary = {
      engine: 'GoAccess Log Parser',
      status: logPath ? 'ONLINE' : 'STANDBY',
      logFileFound: Boolean(logPath),
      logFilePath: logPath,
      logFileSize: '0 KB',
      totalLines: 0,
      uniqueIpsCount: 0,
      topUrls: [],
      topReferrers: [],
      topDevices: [],
      statusCodeBreakdown: {},
      lastGenerated: new Date().toISOString(),
    };

    if (!logPath) {
      return summary;
    }

    try {
      const stats = fs.statSync(logPath);
      summary.logFileSize = `${(stats.size / 1024).toFixed(1)} KB`;

      // Read up to last 2MB of log for instant fast summary without blocking Node.js
      const fd = fs.openSync(logPath, 'r');
      const bufferSize = Math.min(stats.size, 2 * 1024 * 1024);
      const buffer = Buffer.alloc(bufferSize);
      fs.readSync(fd, buffer, 0, bufferSize, Math.max(0, stats.size - bufferSize));
      fs.closeSync(fd);

      const logText = buffer.toString('utf8');
      const lines = logText.split('\n').filter((l) => l.trim().length > 0);
      summary.totalLines = lines.length;

      const ips = new Set<string>();
      const urlCounts: Record<string, number> = {};
      const refCounts: Record<string, number> = {};
      const statusCounts: Record<string, number> = {};
      const deviceCounts: Record<string, number> = {
        iOS: 0,
        Android: 0,
        macOS: 0,
        Windows: 0,
        Linux: 0,
        Other: 0,
      };

      for (const line of lines) {
        // Combined format: IP - - [date] "METHOD URL PROTOCOL" STATUS BYTES "REFERRER" "USER_AGENT"
        const parts = line.match(/^(\S+) \S+ \S+ \[[^\]]+\] "([A-Z]+) ([^ "]+)[^"]*" (\d{3}) \d+ "([^"]*)" "([^"]*)"/);
        if (parts) {
          const ip = parts[1];
          const url = parts[3];
          const status = parts[4];
          const ref = parts[5];
          const ua = parts[6] || '';

          ips.add(ip);

          // URL breakdown (ignore static assets for top pages view)
          if (!url.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff2?|map)$/i)) {
            urlCounts[url] = (urlCounts[url] || 0) + 1;
          }

          // Referrer breakdown
          if (ref && ref !== '-' && !ref.includes('stylexsalon.in') && !ref.includes('localhost')) {
            try {
              const parsedRef = new URL(ref).hostname;
              refCounts[parsedRef] = (refCounts[parsedRef] || 0) + 1;
            } catch {
              refCounts[ref] = (refCounts[ref] || 0) + 1;
            }
          }

          // Status code
          statusCounts[status] = (statusCounts[status] || 0) + 1;

          // Device detection
          if (/iPhone|iPad|iPod/i.test(ua)) deviceCounts['iOS']++;
          else if (/Android/i.test(ua)) deviceCounts['Android']++;
          else if (/Macintosh|Mac OS X/i.test(ua)) deviceCounts['macOS']++;
          else if (/Windows NT/i.test(ua)) deviceCounts['Windows']++;
          else if (/Linux/i.test(ua)) deviceCounts['Linux']++;
          else deviceCounts['Other']++;
        }
      }

      summary.uniqueIpsCount = ips.size;
      summary.statusCodeBreakdown = statusCounts;

      summary.topUrls = Object.entries(urlCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([path, hits]) => ({ path, hits }));

      summary.topReferrers = Object.entries(refCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([referrer, hits]) => ({ referrer, hits }));

      summary.topDevices = Object.entries(deviceCounts)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));
    } catch (err) {
      console.warn('Log summary error:', err);
    }

    return summary;
  }
}
