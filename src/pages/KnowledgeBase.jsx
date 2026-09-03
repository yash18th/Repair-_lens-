import React, { useState } from 'react';
import { BookOpen, Search, Wrench, Shield, CheckCircle2, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';

export default function KnowledgeBase({ searchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const guides = [
    {
      id: 'guide-1',
      category: 'phone',
      categoryLabel: 'Smartphones',
      title: 'OLED Display & Front Glass Replacement Manual',
      description: 'Step-by-step procedure for heating waterproof sealant, safely prying glass panels, and transferring top earpiece speaker sensors.',
      readTime: '8 min read',
      difficulty: 'Intermediate',
      tools: ['Pentalobe P2', 'Tri-point Y000', 'Heat Gun', 'Suction Cup']
    },
    {
      id: 'guide-2',
      category: 'electronics',
      categoryLabel: 'Electronics & PCB',
      title: 'SMD Soldering & VRM MOSFET Rework Guide',
      description: 'Hot air station temp profiles (380°C), tacky flux application, desoldering braid wick techniques, and short-circuit testing.',
      readTime: '12 min read',
      difficulty: 'Advanced',
      tools: ['Hot Air Rework Station', 'Soldering Iron', 'Flux', 'Multimeter']
    },
    {
      id: 'guide-3',
      category: 'auto',
      categoryLabel: 'Automotive',
      title: 'Polypropylene Bumper Wet-Sanding & 2K Clearcoat Touchup',
      description: 'How to heat-pop minor bumper plastic dents, feather scratches with 2000-grit sandpaper, and spray plastic adhesion promoter.',
      readTime: '10 min read',
      difficulty: 'Easy / DIY',
      tools: ['2000-grit Sandpaper', 'Plastic Primer', '2K Clearcoat']
    },
    {
      id: 'guide-4',
      category: 'appliance',
      categoryLabel: 'Appliances',
      title: 'Washing Machine Drive Belt & Gasket Seal Replacement',
      description: 'Diagnosing drum squeal, unbolting front access panel, aligning replacement V-belts, and clamping watertight door gaskets.',
      readTime: '15 min read',
      difficulty: 'Moderate',
      tools: ['Socket Wrench Set', 'Pliers', 'Retaining Ring Tool']
    }
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = !searchQuery || 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20 mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>DIY Repair Knowledge Base</span>
        </div>
        <h1 className="text-3xl font-black text-white">Repair Manuals & Guides</h1>
        <p className="text-xs text-slate-400">Curated disassembly guides, tool specifications, and safety procedures.</p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {['all', 'phone', 'electronics', 'auto', 'appliance'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Guides' : cat}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all duration-200 space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-400 uppercase tracking-wider">{guide.categoryLabel}</span>
                <span className="text-slate-500">{guide.readTime} • <span className="text-slate-300">{guide.difficulty}</span></span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                {guide.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {guide.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {guide.tools.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                    {t}
                  </span>
                ))}
              </div>

              <button className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1">
                <span>Read Manual</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
