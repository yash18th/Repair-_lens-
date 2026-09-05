import React, { useEffect, useMemo, useState } from 'react';
import { History, Filter, ArrowRight, Loader2, AlertTriangle, Plus, Search } from 'lucide-react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api'
    : 'http://localhost:4000'
);

const formatDateTime = (isoString) => {
  if (!isoString) return 'Recent';

  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  return isToday
    ? `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
};

const severityStyles = {
  Critical: 'bg-red-500/10 text-red-300 border-red-500/30',
  High: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
  Medium: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  Low: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
};

export default function HistoryPage({ onSelectPreset, searchQuery, onStartDiagnosis }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedReport, setSelectedReport] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/scans/history`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Unable to load your diagnostic history.');
      }

      const records = payload.history || payload.scans || [];
      setHistoryItems(records);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load your diagnostic history.');
      setHistoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredItems = useMemo(() => {
    const nextItems = [...historyItems].sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    return nextItems.filter((item) => {
      const searchableText = [
        item.deviceName,
        item.deviceType,
        item.category,
        item.diagnosis,
        item.issueDescription,
        item.problemDescription,
        item.estimatedRepairCost,
        item.estimatedCost,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !searchQuery || searchableText.includes(String(searchQuery).toLowerCase());
      const matchesSeverity = severityFilter === 'all' || (item.severity || 'Medium').toLowerCase() === severityFilter.toLowerCase();
      return matchesSearch && matchesSeverity;
    });
  }, [historyItems, searchQuery, severityFilter, sortOrder]);

  const renderCard = (item) => {
    const severity = item.severity || 'Medium';
    const cost = item.estimatedRepairCost || item.estimatedCost || '—';
    const diyScore = typeof item.diySuitability === 'number' ? `${item.diySuitability}%` : '—';

    return (
      <div
        key={item.id}
        className="group relative overflow-hidden rounded-[18px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,11,22,0.96))] p-5 shadow-[0_12px_34px_rgba(2,6,23,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(99,102,241,0.5)] hover:shadow-[0_0_0_1px_rgba(99,102,241,0.18),0_20px_42px_rgba(79,70,229,0.15)]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.7),transparent)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              <span className="rounded-full border border-[rgba(99,102,241,0.35)] bg-[rgba(99,102,241,0.08)] px-2 py-1 text-[var(--text-primary)] font-mono tracking-[0.12em]">
                #{item.id?.slice(0, 8)?.toUpperCase() || 'RL-HISTORY'}
              </span>
            </div>
            <div className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${severityStyles[severity] || severityStyles.Medium}`}>
              {severity} Severity
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{formatDateTime(item.createdAt)}</div>
            <div className="text-lg font-semibold tracking-[-0.04em] text-white">{item.category || 'Smartphone & Tablet'}</div>
            <div className="text-sm text-[var(--text-secondary)]">{item.deviceName || item.deviceType || 'Unspecified device'}</div>
          </div>

          <div className="space-y-3 border-t border-[var(--border-soft)] pt-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] mb-1">Issue</div>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                {item.issueDescription || item.problemDescription || 'Issue recorded during diagnosis'}
              </p>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] mb-1">AI Diagnosis</div>
              <p className="text-sm leading-6 text-[var(--text-primary)]">{item.diagnosis || 'Diagnosis completed'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-[var(--border-soft)] pt-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] mb-1">Estimated Cost</div>
              <div className="text-sm font-medium text-white">{cost}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] mb-1">DIY Suitability</div>
              <div className="text-sm font-medium text-emerald-300">{diyScore}</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSelectedReport(item)}
              className="premium-button w-full justify-center inline-flex items-center gap-2"
            >
              <span>View Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col gap-4 border-b border-[var(--border-soft)] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(99,102,241,0.35)] bg-[rgba(99,102,241,0.08)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              <History className="w-3.5 h-3.5" />
              <span>Scan History</span>
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white">Diagnostic History</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery || ''}
                readOnly
                className="w-full sm:w-56 rounded-xl border border-[var(--border-soft)] bg-[rgba(15,23,42,0.8)] py-2.5 pl-9 pr-3 text-[11px] uppercase tracking-[0.14em] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                placeholder="Search history"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[var(--border-soft)] bg-[rgba(15,23,42,0.8)] px-3 py-2.5 text-[10px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent text-[var(--text-primary)] outline-none"
              >
                <option value="all">All severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[var(--border-soft)] bg-[rgba(15,23,42,0.8)] px-3 py-2.5 text-[10px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent text-[var(--text-primary)] outline-none"
              >
                <option value="desc">Newest → Oldest</option>
                <option value="asc">Oldest → Newest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="premium-panel flex min-h-[260px] items-center justify-center gap-3 p-8 text-[var(--text-secondary)]">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--accent)]" />
          <span>Loading your diagnostic history...</span>
        </div>
      )}

      {!loading && error && (
        <div className="premium-panel flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-full border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.08)] p-3 text-red-300">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Unable to load your diagnostic history.</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{error}</p>
          </div>
          <button type="button" onClick={loadHistory} className="premium-button">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filteredItems.length === 0 && (
        <div className="premium-panel flex flex-col items-center justify-center gap-4 p-10 text-center">
          <div className="rounded-full border border-[rgba(99,102,241,0.35)] bg-[rgba(99,102,241,0.08)] p-3 text-[var(--accent)]">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-[-0.05em] text-white">No diagnostics yet</h3>
            <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">Your completed diagnoses will appear here.</p>
          </div>
          <button type="button" onClick={onStartDiagnosis || (() => window.location.reload())} className="premium-button inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Start a Diagnosis</span>
          </button>
        </div>
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredItems.map(renderCard)}
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[22px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,11,22,0.98))] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.6)]">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] pb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Diagnostic Report</div>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.05em] text-white">{selectedReport.diagnosis || 'Diagnosis completed'}</h3>
              </div>
              <button type="button" onClick={() => setSelectedReport(null)} className="rounded-lg border border-[var(--border-soft)] bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                Close
              </button>
            </div>

            <div className="mt-5 space-y-5 text-sm text-[var(--text-secondary)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Category</div>
                  <div className="mt-1 text-base text-white">{selectedReport.category || 'Unspecified'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Device</div>
                  <div className="mt-1 text-base text-white">{selectedReport.deviceName || selectedReport.deviceType || 'Unknown device'}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Issue</div>
                <p className="mt-2 leading-7 text-white">{selectedReport.issueDescription || selectedReport.problemDescription || 'Issue recorded during diagnosis'}</p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">AI Diagnosis</div>
                <p className="mt-2 leading-7 text-white">{selectedReport.diagnosis || 'Diagnosis completed'}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Severity</div>
                  <div className="mt-1 text-white">{selectedReport.severity || 'Medium'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Estimated Cost</div>
                  <div className="mt-1 text-white">{selectedReport.estimatedRepairCost || selectedReport.estimatedCost || '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">DIY Suitability</div>
                  <div className="mt-1 text-white">{typeof selectedReport.diySuitability === 'number' ? `${selectedReport.diySuitability}%` : '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
