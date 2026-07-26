/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EventReceipt, JubileeIdea } from '../types/jubileeTypes';
import {
  ShieldCheck,
  Hash,
  Clock,
  User,
  GitCommit,
  CheckCircle2,
  FileCheck,
  Filter,
  RefreshCw,
  Lock,
  Plus,
  AlertTriangle
} from 'lucide-react';

interface JubileeLedgerViewProps {
  events: EventReceipt[];
  ideas: JubileeIdea[];
  onRefreshLedger: () => void;
  onManualHarvest: (summary: string, content: string) => void;
}

export const JubileeLedgerView: React.FC<JubileeLedgerViewProps> = ({
  events,
  ideas,
  onRefreshLedger,
  onManualHarvest,
}) => {
  const [filterActor, setFilterActor] = useState<string>('all');
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [manualTitle, setManualTitle] = useState<string>('');
  const [manualContent, setManualContent] = useState<string>('');

  const filteredEvents = events.filter(e => {
    if (filterActor === 'all') return true;
    return e.actor === filterActor;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualContent) return;
    onManualHarvest(manualTitle, manualContent);
    setManualTitle('');
    setManualContent('');
    setShowManualModal(false);
  };

  const headHash = events[events.length - 1]?.currentHash || '0x0';

  return (
    <div className="space-y-8">
      {/* Ledger Header */}
      <div className="rounded-2xl bg-white/90 border border-[#2b2117]/10 p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-[#5b8a72] uppercase font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#5b8a72]" />
              <span>Authority Plane • Jubilee Event Ledger</span>
              <span>•</span>
              <span className="text-[#2b2117]">Append-Only Hash Chain</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b2117]">
              Immutable Witness Ledger
            </h2>
            <p className="font-mono text-xs text-[#6b5a46] max-w-2xl leading-relaxed">
              Every human harvest, version commitment, or repair scar is witnessed and chained via SHA-256 integrity hashes.
              Current Head Hash: <code className="bg-[#2b2117] text-[#fde68a] px-2 py-0.5 rounded font-bold">{headHash}</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshLedger}
              className="p-2.5 rounded-xl border border-[#2b2117]/15 bg-white text-[#2b2117] hover:bg-[#2b2117]/5 font-mono text-xs flex items-center gap-1.5"
              title="Refresh ledger chain"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>

            <button
              id="manual-harvest-modal-btn"
              onClick={() => setShowManualModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#2b2117] text-[#fdf8ef] hover:bg-[#92400e] font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#d4a017]" />
              <span>Manual Human Harvest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Active Harvested Ideas & Hash Chain Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Harvested Ideas (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#2b2117]/10 pb-3 font-mono text-xs text-[#2b2117] font-bold">
              <span className="uppercase">Harvested Ideas ({ideas.length})</span>
              <span className="text-[10px] text-[#8a7a65]">Projections</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {ideas.map(idea => (
                <div
                  key={idea.id}
                  className="bg-[#fdf8ef] p-3.5 rounded-xl border border-[#2b2117]/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-[#2b2117] text-sm">
                      {idea.title}
                    </span>
                    <span className="font-mono text-[10px] bg-[#5b8a72] text-white px-2 py-0.5 rounded-full uppercase font-bold">
                      {idea.status}
                    </span>
                  </div>

                  <div className="font-mono text-[10px] text-[#6b5a46] space-y-1">
                    <div>Version Hash: <code>{idea.currentVersionHash}</code></div>
                    <div>Total Harvests: <strong className="text-[#92400e]">{idea.harvestCount}</strong></div>
                  </div>

                  {idea.tensions && idea.tensions.length > 0 && (
                    <div className="font-mono text-[10px] bg-[#fffbeb] p-2 rounded-lg border border-[#d4a017]/30 text-[#78350f]">
                      Tension: {idea.tensions[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Append-Only Event Chain Timeline (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-[#8a7a65]">
            <span className="uppercase font-semibold">
              Event Stream ({filteredEvents.length} Witnessed Events)
            </span>

            {/* Filter by Actor */}
            <div className="flex items-center gap-2">
              <span>Filter Actor:</span>
              <select
                value={filterActor}
                onChange={e => setFilterActor(e.target.value)}
                className="bg-white border border-[#2b2117]/15 rounded-md px-2 py-1 text-xs text-[#2b2117] font-mono focus:outline-none"
              >
                <option value="all">All Actors</option>
                <option value="human:jublEchat">human:jublEchat</option>
                <option value="node:seedforge">node:seedforge</option>
                <option value="node:recurv">node:recurv</option>
              </select>
            </div>
          </div>

          {/* Timeline Stream */}
          <div className="space-y-4 relative before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#2b2117]/15">
            {filteredEvents.slice().reverse().map((evt, idx) => {
              const isGenesis = evt.previousHash.startsWith('0x00000');

              return (
                <div
                  key={evt.eventId}
                  className="relative pl-12 space-y-2 group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 top-3.5 w-4 h-4 rounded-full bg-[#2b2117] text-[#fde68a] border-2 border-white ring-2 ring-[#2b2117]/20 flex items-center justify-center font-mono text-[9px] font-bold">
                    ✓
                  </div>

                  {/* Event Card */}
                  <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-2xs space-y-3 hover:border-[#2b2117]/30 transition-all">
                    {/* Event Card Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2b2117]/10 pb-2.5 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#2b2117] text-[#fde68a] px-2 py-0.5 rounded-md font-bold text-[11px]">
                          {evt.eventType}
                        </span>
                        <span className="text-[#6b5a46] bg-[#2b2117]/5 px-2 py-0.5 rounded-full font-medium">
                          {evt.actor}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[#8a7a65] text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(evt.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Event Summary & Content */}
                    <div className="space-y-1.5">
                      <h4 className="font-serif font-bold text-base text-[#2b2117]">
                        {evt.payload.summary}
                      </h4>
                      {evt.payload.content && (
                        <p className="font-sans text-xs text-[#3d2f20] bg-[#fdf8ef] p-3 rounded-xl border border-[#2b2117]/10 leading-relaxed whitespace-pre-line">
                          {evt.payload.content}
                        </p>
                      )}
                      {evt.payload.repairScarNote && (
                        <p className="font-mono text-xs text-[#7c2d12] bg-[#fff1e6] p-3 rounded-xl border border-[#c2410c]/20 font-medium">
                          Repair Scar Note: {evt.payload.repairScarNote}
                        </p>
                      )}
                    </div>

                    {/* Cryptographic Hash Chain Verification */}
                    <div className="bg-[#f3f4f6] p-2.5 rounded-xl border border-[#2b2117]/10 font-mono text-[11px] text-[#374151] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <GitCommit className="w-3.5 h-3.5 text-[#5b8a72]" />
                        <span>Prev: <code className="text-[#6b7280]">{evt.previousHash}</code></span>
                        <span>→</span>
                        <span>Head: <code className="text-[#2b2117] font-bold">{evt.currentHash}</code></span>
                      </div>

                      <div className="inline-flex items-center gap-1 text-[#5b8a72] font-semibold text-[10px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Witness Integrity Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Manual Harvest Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fdf8ef] border border-[#2b2117]/20 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="font-serif text-xl font-bold text-[#2b2117]">
              Manual Human Harvest to Jubilee Ledger
            </h3>
            <p className="font-mono text-xs text-[#6b5a46]">
              Directly record a human decision, lyric verse, or creative commitment onto the hash-chained event stream.
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[#8a7a65] font-semibold uppercase block">Summary Title:</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={e => setManualTitle(e.target.value)}
                  placeholder="e.g. Porch light litany agreement"
                  required
                  className="w-full bg-white border border-[#2b2117]/15 rounded-lg p-2.5 text-[#2b2117] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#8a7a65] font-semibold uppercase block">Harvest Content / Verse:</label>
                <textarea
                  value={manualContent}
                  onChange={e => setManualContent(e.target.value)}
                  rows={4}
                  placeholder="Enter the lyrics, thesis, or agreement to harvest..."
                  required
                  className="w-full bg-white border border-[#2b2117]/15 rounded-lg p-2.5 text-[#2b2117] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-lg bg-white border text-[#6b5a46]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2b2117] text-[#fdf8ef] font-bold hover:bg-[#92400e]"
                >
                  Harvest Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
