import React, { useState } from 'react';
import { History, Search, Eye, Filter, Calendar, DollarSign, Wrench, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { SAMPLE_PRESETS } from '../services/api';

export default function HistoryPage({ onSelectPreset, searchQuery }) {
  const [severityFilter, setSeverityFilter] = useState('all');

  const historyItems = [
    {
      id: 'scan-1',
      presetId: 'sample-phone',
      title: 'Front Display Glass Fracture & Screen Assembly Damage',
      device: 'iPhone 13 Pro Max',
      category: 'Smartphone / Tablet',
      severity: 'High',
      cost: '$65 - $140',
      diyScore: '82%',
      date: 'Today, 3:15 PM',
      reportId: '#RL-MULTI-884899',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'scan-2',
      presetId: 'sample-pcb',
      title: 'Burned Power MOSFET & Swollen Filtering Capacitor',
      device: 'ASUS ROG VRM Module',
      category: 'Electronics / PCB',
      severity: 'Critical',
      cost: '$18 - $70',
      diyScore: '45%',
      date: 'Yesterday, 11:20 AM',
      reportId: '#RL-MULTI-910284',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'scan-3',
      presetId: 'sample-bumper',
      title: 'Plastic Bumper Scrape & Paint Clearcoat Abrasion',
      device: 'Honda Civic Hatchback',
      category: 'Automotive Bodywork',
      severity: 'Low',
      cost: '$35 - $95',
      diyScore: '94%',
      date: 'Sep 01, 2026',
      reportId: '#RL-MULTI-554192',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reportId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || item.severity.toLowerCase() === severityFilter.toLowerCase();

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20 mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Scan History & Saved Blueprints</span>
          </div>
          <h1 className="text-3xl font-black text-white">Diagnostic Scan Logs</h1>
          <p className="text-xs text-slate-400 mt-1">Review past AI vision scans, severity ratings, and saved repair blueprints.</p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* History Items Grid */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const matchedPreset = SAMPLE_PRESETS.find(p => p.id === item.presetId);

          return (
            <div
              key={item.id}
              className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              {/* Left Info & Thumbnail */}
              <div className="flex items-start sm:items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0 group-hover:scale-105 transition-transform"
                />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {item.reportId}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                      item.severity === 'High' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {item.severity} Severity
                    </span>
                    <span className="text-[11px] text-slate-500">• {item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400">
                    Device: <span className="text-slate-200 font-semibold">{item.device}</span> ({item.category})
                  </p>
                </div>
              </div>

              {/* Right Metrics & Action */}
              <div className="flex items-center justify-between md:justify-end space-x-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-slate-500 block">Est. Cost Range</span>
                  <span className="font-mono font-bold text-white text-sm">{item.cost}</span>
                </div>

                <div className="text-left md:text-right hidden sm:block">
                  <span className="text-[11px] text-slate-500 block">DIY Suitability</span>
                  <span className="font-bold text-emerald-400 text-sm">{item.diyScore}</span>
                </div>

                <button
                  onClick={() => matchedPreset && onSelectPreset(matchedPreset)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-lg shadow-purple-600/20"
                >
                  <span>View Report</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
