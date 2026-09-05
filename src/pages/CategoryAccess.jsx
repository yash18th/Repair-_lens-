import React from 'react';
import { Grid3X3, ChevronRight } from 'lucide-react';
import { ITEM_CATEGORIES } from '../services/api';

const CATEGORY_ACCESS_ITEMS = ITEM_CATEGORIES;

export default function CategoryAccess({ onSelectCategoryAndNavigate }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-slate-300">
          <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
          <span>Category Access</span>
        </div>
        <span className="text-[11px] text-slate-500">Choose a category</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CATEGORY_ACCESS_ITEMS.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategoryAndNavigate(cat.id)}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-left transition-all duration-200 hover:border-purple-500/60 hover:bg-slate-900 shadow-xl"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                {cat.icon}
              </div>

              <div className="min-w-0">
                <div className="font-extrabold text-white text-2xl group-hover:text-purple-300 transition-colors">{cat.label}</div>
                <div className="text-sm text-slate-400 truncate">{cat.desc}</div>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 px-4 py-2 text-sm font-bold flex-shrink-0">
              Open
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
