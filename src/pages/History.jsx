import React, { useEffect, useMemo, useState } from 'react';
import { History, Filter, ArrowRight, Loader2, AlertTriangle, Plus, Search, Trash2, X, CheckCircle2 } from 'lucide-react';

import { getApiBaseUrl } from '../services/config';

const apiBaseUrl = getApiBaseUrl();

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

export default function HistoryPage({ onSelectPreset, searchQuery, onSearchChange, onStartDiagnosis }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedReport, setSelectedReport] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/scans`, {
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

  const handleDeleteItem = async (item) => {
    if (!item) return;
    const targetId = item.id || item.reportId;
    if (!targetId) return;

    setDeletingId(targetId);

    try {
      const response = await fetch(`${apiBaseUrl}/api/scans/${targetId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to delete scan from history.');
      }

      setHistoryItems((prev) => prev.filter((i) => i.id !== item.id && i.reportId !== item.reportId));
      if (selectedReport && (selectedReport.id === item.id || selectedReport.reportId === item.reportId)) {
        setSelectedReport(null);
      }
      setItemToDelete(null);
      setFeedbackMessage({ type: 'success', text: `Diagnostic report ${item.reportId || ''} deleted successfully.` });
      setTimeout(() => setFeedbackMessage(null), 3500);
    } catch (delError) {
      setFeedbackMessage({ type: 'error', text: delError.message || 'Failed to delete scan record.' });
      setTimeout(() => setFeedbackMessage(null), 4500);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAllHistory = async () => {
    setClearingAll(true);

    try {
      let response = await fetch(`${apiBaseUrl}/api/scans/clear-all`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        response = await fetch(`${apiBaseUrl}/api/scans`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to clear diagnostic history.');
      }

      setHistoryItems([]);
      setSelectedReport(null);
      setShowClearAllModal(false);
      setFeedbackMessage({ type: 'success', text: 'All diagnostic search history has been cleared.' });
      setTimeout(() => setFeedbackMessage(null), 3500);
    } catch (clearErr) {
      setFeedbackMessage({ type: 'error', text: clearErr.message || 'Failed to clear diagnostic history.' });
      setTimeout(() => setFeedbackMessage(null), 4500);
    } finally {
      setClearingAll(false);
    }
  };

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
    const cost = item.estimatedRepairCost || item.estimatedCost || (item.costMin && item.costMax ? `₹${item.costMin} – ₹${item.costMax}` : '—');
    const diyScore = typeof item.diySuitability === 'number' ? `${item.diySuitability}%` : '—';
    const imageCount = Number(item.imageCount || 0);

    return (
      <div
        key={item.id || item.reportId}
        className="group relative overflow-hidden rounded-[18px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,11,22,0.96))] p-5 shadow-[0_12px_34px_rgba(2,6,23,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(99,102,241,0.5)] hover:shadow-[0_0_0_1px_rgba(99,102,241,0.18),0_20px_42px_rgba(79,70,229,0.15)]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.7),transparent)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              <span className="rounded-full border border-[rgba(99,102,241,0.35)] bg-[rgba(99,102,241,0.08)] px-2 py-1 text-[var(--text-primary)] font-mono tracking-[0.12em]">
                {item.reportId || `#${item.id?.slice(0, 8)?.toUpperCase() || 'RL-HISTORY'}`}
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
            <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{imageCount} image{imageCount === 1 ? '' : 's'} analyzed</div>
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

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedReport(item)}
              className="premium-button flex-1 justify-center inline-flex items-center gap-2"
            >
              <span>View Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setItemToDelete(item);
              }}
              title="Delete this scan from history"
              aria-label="Delete scan from history"
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-[var(--border-soft)] bg-white/5 text-[var(--text-secondary)] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full sm:w-56 rounded-xl border border-[var(--border-soft)] bg-[rgba(15,23,42,0.8)] py-2.5 pl-9 pr-8 text-[11px] uppercase tracking-[0.14em] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[rgba(99,102,241,0.5)]"
                placeholder="Search history"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white p-0.5 rounded transition-colors"
                  title="Clear search query"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
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

            {historyItems.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearAllModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-300 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-200 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                title="Clear all scan history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div
          className={`rounded-xl border p-3.5 text-xs flex items-center justify-between gap-3 animate-fadeIn ${
            feedbackMessage.type === 'error'
              ? 'border-red-500/30 bg-red-500/10 text-red-300'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-current opacity-70 hover:opacity-100 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
            <h3 className="text-2xl font-bold tracking-[-0.05em] text-white">
              {searchQuery ? 'No matching scans found' : 'No diagnostics yet'}
            </h3>
            <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
              {searchQuery
                ? `No scans match "${searchQuery}". Try a different keyword or clear the search filter.`
                : 'Your completed diagnoses will appear here.'}
            </p>
          </div>
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange?.('')}
              className="premium-button inline-flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              <span>Clear Search Filter</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => (onStartDiagnosis ? onStartDiagnosis('phone') : window.location.reload())}
              className="premium-button inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Start a Diagnosis</span>
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredItems.map(renderCard)}
        </div>
      )}

      {/* View Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[22px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,11,22,0.98))] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.6)]">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] pb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Diagnostic Report</div>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.05em] text-white">{selectedReport.diagnosis || 'Diagnosis completed'}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(selectedReport)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs uppercase tracking-[0.12em] text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
                  title="Delete this report"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="rounded-lg border border-[var(--border-soft)] bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)] hover:bg-white/10 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
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

      {/* Delete Single Scan Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-[22px] border border-red-500/30 bg-[linear-gradient(180deg,rgba(18,24,38,0.98),rgba(10,12,20,0.98))] p-6 shadow-[0_30px_80px_rgba(239,68,68,0.25)]">
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-red-500/30 bg-red-500/10 p-2.5 text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Diagnostic Record?</h3>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)]">
                  {itemToDelete.reportId || `#${itemToDelete.id?.slice(0, 8)?.toUpperCase() || 'RL-REPORT'}`}
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              Are you sure you want to delete the diagnostic report for{' '}
              <strong className="text-white">{itemToDelete.deviceName || itemToDelete.category || 'this item'}</strong>? This record will be permanently removed.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deletingId === (itemToDelete.id || itemToDelete.reportId)}
                onClick={() => setItemToDelete(null)}
                className="rounded-xl border border-[var(--border-soft)] bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] hover:bg-white/10 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === (itemToDelete.id || itemToDelete.reportId)}
                onClick={() => handleDeleteItem(itemToDelete)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white hover:from-red-500 hover:to-rose-500 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50"
              >
                {deletingId === (itemToDelete.id || itemToDelete.reportId) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All History Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-[22px] border border-red-500/30 bg-[linear-gradient(180deg,rgba(18,24,38,0.98),rgba(10,12,20,0.98))] p-6 shadow-[0_30px_80px_rgba(239,68,68,0.25)]">
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-red-500/30 bg-red-500/10 p-2.5 text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Clear All Diagnostic History?</h3>
                <p className="text-xs text-[var(--text-secondary)]">Permanent removal of all scan records</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              This will permanently delete all {historyItems.length} diagnostic scan reports from your account. This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={clearingAll}
                onClick={() => setShowClearAllModal(false)}
                className="rounded-xl border border-[var(--border-soft)] bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] hover:bg-white/10 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={clearingAll}
                onClick={handleClearAllHistory}
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white hover:from-red-500 hover:to-rose-500 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50"
              >
                {clearingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{clearingAll ? 'Clearing...' : 'Clear All History'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
