/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Compass, Cpu, FileCode2, GraduationCap, ShieldCheck, Sparkles, Wrench } from 'lucide-react';

export type ActiveTab = 'archive' | 'nearby' | 'seedforge' | 'refactor' | 'learning' | 'ledger' | 'weather';

interface HeaderNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  packetCount: number;
  ledgerHead: string;
  totalEvents: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  packetCount,
  ledgerHead,
  totalEvents,
}) => {
  return (
    <header className="border-b border-[#2b2117]/15 bg-[#fdf8ef]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Cluster Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2b2117] text-[#fdf8ef] flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-[#2b2117]/20">
              J
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg md:text-xl font-bold tracking-tight text-[#2b2117]">
                  The Static Collective
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#d4a017]/15 text-[#78350f] border border-[#d4a017]/30 font-medium">
                  Jubilee Garden v0.1
                </span>
              </div>
              <p className="text-xs text-[#6b5a46] font-mono flex items-center gap-2">
                <span>26 Albums Autodiscography</span>
                <span className="opacity-40">•</span>
                <span className="text-[#92400e] truncate max-w-[200px] sm:max-w-none">
                  Ledger Head: <code className="bg-[#2b2117]/5 px-1 rounded">{ledgerHead.slice(0, 10)}</code> ({totalEvents} events)
                </span>
              </p>
            </div>
          </div>

          {/* Tab Controls */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              id="tab-nearby"
              onClick={() => setActiveTab('nearby')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                activeTab === 'nearby'
                  ? 'bg-[#2b2117] text-[#fdf8ef] shadow-sm font-bold'
                  : 'text-[#6b5a46] hover:bg-[#2b2117]/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4a017]" />
              <span>Unified Studio</span>
            </button>

            <button
              id="tab-archive"
              onClick={() => setActiveTab('archive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                activeTab === 'archive'
                  ? 'bg-[#2b2117] text-[#fdf8ef] shadow-sm font-bold'
                  : 'text-[#6b5a46] hover:bg-[#2b2117]/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>26-Album Canon</span>
            </button>

            <button
              id="tab-ledger"
              onClick={() => setActiveTab('ledger')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                activeTab === 'ledger'
                  ? 'bg-[#2b2117] text-[#fdf8ef] shadow-sm font-bold'
                  : 'text-[#6b5a46] hover:bg-[#2b2117]/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#5b8a72]" />
              <span>Witness Ledger ({totalEvents})</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
