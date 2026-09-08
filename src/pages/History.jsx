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
  Critical: 'bg-[#B36262]/10 text-[#B36262] border-[#B36262]/30',
  High: 'bg-[#B28A50]/10 text-[#B28A50] border-[#B28A50]/30',
  Medium: 'bg-[#7D91AA]/10 text-[#7D91AA] border-[#7D91AA]/30',
  Low: 'bg-[#55A477]/10 text-[#55A477] border-[#55A477]/30',
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
        className="group relative overflow-hidden rounded-xl border border-[#232B36] bg-[#121720] p-5 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#161C25] hover:border-[#7D91AA]/40"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#A7B0BC]">
              <span className="rounded-md border border-[#232B36] bg-[#0D1118] px-2 py-1 text-[#A7B0BC] font-mono tracking-[0.12em]">
                {item.reportId || `#${item.id?.slice(0, 8)?.toUpperCase() || 'RL-HISTORY'}`}
              </span>
            </div>
            <div className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${severityStyles[severity] || severityStyles.Medium}`}>
              {severity} Severity
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382] font-mono">{formatDateTime(item.createdAt)}</div>
            <div className="text-base font-semibold tracking-tight text-[#F4F6F8]">{item.category || 'Hardware'}</div>
            <div className="text-sm text-[#A7B0BC]">{item.deviceName || item.deviceType || 'Unspecified device'}</div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#687382] font-mono">{imageCount} image{imageCount === 1 ? '' : 's'} analyzed</div>
          </div>

          <div className="space-y-3 border-t border-[#232B36] pt-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382] mb-1">Issue</div>
              <p className="text-sm leading-relaxed text-[#A7B0BC]">
                {item.issueDescription || item.problemDescription || 'Issue recorded during diagnosis'}
              </p>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382] mb-1">AI Diagnosis</div>
              <p className="text-sm leading-relaxed text-[#F4F6F8] font-medium">{item.diagnosis || 'Diagnosis completed'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-[#232B36] pt-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382] mb-1">Estimated Cost</div>
              <div className="text-sm font-semibold text-[#F4F6F8] font-mono">{cost}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382] mb-1">DIY Suitability</div>
              <div className="text-sm font-semibold text-[#55A477] font-mono">{diyScore}</div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedReport(item)}
              className="flex-1 justify-center inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#161C25] hover:bg-[#1D2430] border border-[#232B36] text-[#F4F6F8] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>View Report</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7D91AA]" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setItemToDelete(item);
              }}
              title="Delete this scan from history"
              aria-label="Delete scan from history"
              className="inline-flex items-center justify-center p-2.5 rounded-lg border border-[#232B36] bg-[#0D1118] text-[#A7B0BC] hover:bg-[#B36262]/10 hover:border-[#B36262]/30 hover:text-[#B36262] transition-colors cursor-pointer"
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
      <div className="flex flex-col gap-4 border-b border-[#232B36] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#232B36] bg-[#161C25] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A7B0BC]">
              <History className="w-3.5 h-3.5 text-[#7D91AA]" />
              <span>Scan History</span>
            </div>
            <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-[#F4F6F8]">Diagnostic History</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#687382]" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full sm:w-56 rounded-lg border border-[#232B36] bg-[#0D1118] py-2 pl-9 pr-8 text-xs text-[#F4F6F8] placeholder:text-[#687382] focus:outline-none focus:border-[#7D91AA]"
                placeholder="Search history"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#687382] hover:text-[#F4F6F8] p-0.5 rounded transition-colors"
                  title="Clear search query"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-[#232B36] bg-[#0D1118] px-3 py-2 text-xs text-[#A7B0BC]">
              <Filter className="w-3.5 h-3.5 text-[#7D91AA]" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent text-[#F4F6F8] outline-none cursor-pointer"
              >
                <option value="all">All severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-[#232B36] bg-[#0D1118] px-3 py-2 text-xs text-[#A7B0BC]">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent text-[#F4F6F8] outline-none cursor-pointer"
              >
                <option value="desc">Newest → Oldest</option>
                <option value="asc">Oldest → Newest</option>
              </select>
            </div>

            {historyItems.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearAllModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#B36262]/30 bg-[#B36262]/10 px-3 py-2 text-xs font-medium text-[#B36262] hover:bg-[#B36262]/20 transition-all cursor-pointer"
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
              ? 'border-[#B36262]/30 bg-[#B36262]/10 text-[#B36262]'
              : 'border-[#55A477]/30 bg-[#55A477]/10 text-[#55A477]'
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button type="button" onClick={() => setFeedbackMessage(null)} className="p-1 text-inherit hover:opacity-75 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#7D91AA]" />
          <p className="text-xs text-[#A7B0BC]">Loading diagnostic archive...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-[#B36262]/30 bg-[#B36262]/10 p-6 text-center space-y-3">
          <AlertTriangle className="w-6 h-6 text-[#B36262] mx-auto" />
          <p className="text-sm font-medium text-[#F4F6F8]">{error}</p>
          <button
            onClick={loadHistory}
            className="px-4 py-2 rounded-lg bg-[#161C25] hover:bg-[#1D2430] border border-[#232B36] text-xs text-[#F4F6F8] font-medium transition-colors cursor-pointer"
          >
            Retry Load
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-[#232B36] bg-[#121720] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-lg bg-[#161C25] border border-[#232B36] flex items-center justify-center mx-auto text-[#7D91AA]">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F4F6F8]">No Diagnostic Records Found</h3>
            <p className="text-xs text-[#A7B0BC] max-w-sm mx-auto">
              {searchQuery || severityFilter !== 'all'
                ? 'No recorded scans match your current filter parameters.'
                : 'Your completed AI hardware inspections and repair estimates will appear here.'}
            </p>
          </div>
          {onStartDiagnosis && (
            <button
              type="button"
              onClick={onStartDiagnosis}
              className="px-4 py-2 rounded-lg bg-[#161C25] hover:bg-[#1D2430] border border-[#232B36] text-xs font-semibold uppercase tracking-wider text-[#F4F6F8] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#7D91AA]" />
              <span>Start New Diagnosis</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(renderCard)}
        </div>
      )}

      {/* View Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B10]/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-xl border border-[#232B36] bg-[#121720] p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-[#232B36] pb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#7D91AA] font-mono">Diagnostic Report</div>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-[#F4F6F8]">{selectedReport.diagnosis || 'Diagnosis completed'}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(selectedReport)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#B36262]/30 bg-[#B36262]/10 px-3 py-1.5 text-xs font-medium text-[#B36262] hover:bg-[#B36262]/20 transition-colors cursor-pointer"
                  title="Delete this report"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="rounded-lg border border-[#232B36] bg-[#161C25] px-3 py-1.5 text-xs text-[#A7B0BC] hover:text-[#F4F6F8] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm text-[#A7B0BC]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382]">Category</div>
                  <div className="mt-1 text-sm font-medium text-[#F4F6F8]">{selectedReport.category || 'Unspecified'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382]">Device</div>
                  <div className="mt-1 text-sm font-medium text-[#F4F6F8]">{selectedReport.deviceName || selectedReport.deviceType || 'Unknown device'}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382]">Issue</div>
                <p className="mt-1 leading-relaxed text-[#F4F6F8]">{selectedReport.issueDescription || selectedReport.problemDescription || 'Issue recorded during diagnosis'}</p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382]">AI Diagnosis</div>
                <p className="mt-1 leading-relaxed text-[#F4F6F8]">{selectedReport.diagnosis || 'Diagnosis completed'}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 border-t border-[#232B36] pt-4 font-mono">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382]">Severity</div>
                  <div className="mt-1 text-sm font-semibold text-[#F4F6F8]">{selectedReport.severity || 'Medium'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382]">Estimated Cost</div>
                  <div className="mt-1 text-sm font-semibold text-[#F4F6F8]">{selectedReport.estimatedRepairCost || selectedReport.estimatedCost || '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#687382]">DIY Suitability</div>
                  <div className="mt-1 text-sm font-semibold text-[#55A477]">{typeof selectedReport.diySuitability === 'number' ? `${selectedReport.diySuitability}%` : '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Scan Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B10]/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-xl border border-[#232B36] bg-[#121720] p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-[#B36262]/30 bg-[#B36262]/10 p-2 text-[#B36262]">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F4F6F8]">Delete Diagnostic Record?</h3>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#687382]">
                  {itemToDelete.reportId || `#${itemToDelete.id?.slice(0, 8)?.toUpperCase() || 'RL-REPORT'}`}
                </span>
              </div>
            </div>

            <p className="mt-3.5 text-xs leading-relaxed text-[#A7B0BC]">
              Are you sure you want to delete the diagnostic report for{' '}
              <strong className="text-[#F4F6F8]">{itemToDelete.deviceName || itemToDelete.category || 'this item'}</strong>? This record will be permanently removed.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deletingId === (itemToDelete.id || itemToDelete.reportId)}
                onClick={() => setItemToDelete(null)}
                className="rounded-lg border border-[#232B36] bg-[#161C25] px-3.5 py-2 text-xs font-medium text-[#A7B0BC] hover:text-[#F4F6F8] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === (itemToDelete.id || itemToDelete.reportId)}
                onClick={() => handleDeleteItem(itemToDelete)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#B36262]/40 bg-[#B36262] px-4 py-2 text-xs font-medium text-white hover:bg-[#a15555] transition-all disabled:opacity-50 cursor-pointer"
              >
                {deletingId === (itemToDelete.id || itemToDelete.reportId) ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All History Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B10]/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-xl border border-[#232B36] bg-[#121720] p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-[#B36262]/30 bg-[#B36262]/10 p-2 text-[#B36262]">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F4F6F8]">Clear All Diagnostic History?</h3>
                <p className="text-xs text-[#A7B0BC]">Permanent removal of all scan records</p>
              </div>
            </div>

            <p className="mt-3.5 text-xs leading-relaxed text-[#A7B0BC]">
              This will permanently delete all {historyItems.length} diagnostic scan reports from your account. This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={clearingAll}
                onClick={() => setShowClearAllModal(false)}
                className="rounded-lg border border-[#232B36] bg-[#161C25] px-3.5 py-2 text-xs font-medium text-[#A7B0BC] hover:text-[#F4F6F8] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={clearingAll}
                onClick={handleClearAllHistory}
                className="inline-flex items-center gap-2 rounded-lg border border-[#B36262]/40 bg-[#B36262] px-4 py-2 text-xs font-medium text-white hover:bg-[#a15555] transition-all disabled:opacity-50 cursor-pointer"
              >
                {clearingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
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
