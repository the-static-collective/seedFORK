/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LineagePacket,
  SeedForgeProposal,
  TargetProposalForm,
  NearbyGrowthLane,
} from '../types/jubileeTypes';
import {
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Lock,
  FileText,
  Clock,
  Code2,
  Trash2,
  AlertCircle,
  Cpu,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface SeedForgeWorkbenchProps {
  packetSources: Array<{
    artifactId: string;
    albumId: number;
    title: string;
    excerpt: string;
    lane: NearbyGrowthLane;
  }>;
  onRemoveSource: (artifactId: string) => void;
  onHarvestSuccess: (receipt: any) => void;
}

export const SeedForgeWorkbench: React.FC<SeedForgeWorkbenchProps> = ({
  packetSources,
  onRemoveSource,
  onHarvestSuccess,
}) => {
  const [requestText, setRequestText] = useState<string>(
    'Extend the motif of the pine kitchen table, porch light, and paper plates into a new 2-verse song or liturgy snippet.'
  );
  const [targetForm, setTargetForm] = useState<TargetProposalForm>('new_lyric');
  const [preserveTensions, setPreserveTensions] = useState<boolean>(true);
  const [activeTensionText, setActiveTensionText] = useState<string>(
    'Preserve organic human choice vs automated velocity & kitchen table hospitality'
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedProposal, setGeneratedProposal] = useState<SeedForgeProposal | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);
  const [harvestMessage, setHarvestMessage] = useState<string | null>(null);

  const handleInvokeSeedForge = async () => {
    if (packetSources.length === 0) {
      setGenerationError('Please attach at least one source from Nearby Growth to build your LineagePacket.');
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);
    setHarvestMessage(null);

    const packet: LineagePacket = {
      packetId: `pkt_${Date.now()}`,
      requestText,
      selectedSources: packetSources,
      activeTensions: [activeTensionText],
      targetForm,
      constraints: {
        proposalOnly: true,
        preserveTensions,
        noDirectStateMutation: true,
      },
    };

    try {
      const res = await fetch('/api/seedforge/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packet),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate proposal');
      }

      const proposal: SeedForgeProposal = await res.json();
      setGeneratedProposal(proposal);
    } catch (err: any) {
      console.error('SeedForge generation error:', err);
      setGenerationError(err.message || 'Error invoking Gemini API via SeedForge server route.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHarvestToLedger = async () => {
    if (!generatedProposal) return;

    setIsHarvesting(true);
    setHarvestMessage(null);

    try {
      const res = await fetch('/api/jubilee/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: `Harvested: ${generatedProposal.title}`,
          content: generatedProposal.generatedContent,
          era: 'canon',
          lineagePacketId: generatedProposal.packetId,
          proposalId: generatedProposal.proposalId,
          sourcesCount: generatedProposal.provenanceSources.length,
          tensionResolved: preserveTensions ? activeTensionText : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setHarvestMessage(`Successfully harvested to Jubilee Event Ledger! (Current Hash: ${data.receipt.currentHash})`);
        onHarvestSuccess(data.receipt);
      } else {
        throw new Error(data.error || 'Harvest failed');
      }
    } catch (err: any) {
      console.error('Harvest error:', err);
      setHarvestMessage(`Harvest failed: ${err.message}`);
    } finally {
      setIsHarvesting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* SeedForge Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#2b2117] to-[#3d2f20] text-[#fdf8ef] p-6 md:p-8 shadow-md relative overflow-hidden space-y-4">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#d4a017]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-[#f5d6a8] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#d4a017]" />
              <span>SeedForge Node • Gemini AI Proposal Generator</span>
              <span>•</span>
              <span className="text-white font-semibold">Bounded Scope</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Creative Proposal Workbench
            </h2>
            <p className="font-mono text-xs text-[#f5d6a8]/80 max-w-2xl leading-relaxed">
              "Models propose. Jubilee witnesses. Humans harvest." Gemini synthesizes new lyrics, album concepts, or liturgy
              grounded <i>strictly</i> in your attached <code>LineagePacket</code>.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 font-mono text-xs space-y-1 shrink-0">
            <div className="flex items-center gap-1.5 text-[#fde68a]">
              <Lock className="w-3.5 h-3.5" />
              <span>Constitutional Boundary:</span>
            </div>
            <p className="text-[11px] text-white/70">
              Zero state mutation until human harvest.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Packet Config & Attached Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Packet Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-6 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#2b2117] flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#92400e]" />
              <span>LineagePacket Context & Parameters</span>
            </h3>

            {/* Attached Sources Inventory */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-[#8a7a65]">
                <span className="uppercase font-semibold">
                  Attached LineagePacket Sources ({packetSources.length})
                </span>
                <span className="text-[#c2410c] text-[11px]">
                  {packetSources.length === 0 ? '⚠️ Minimum 1 source required' : '✓ Verified'}
                </span>
              </div>

              {packetSources.length === 0 ? (
                <div className="p-5 text-center font-mono text-xs text-[#8a7a65] bg-[#fdf8ef] rounded-xl border border-dashed border-[#2b2117]/20">
                  No sources attached yet. Go to <strong>Find Nearby Growth</strong> tab to select album nodes and add them here!
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {packetSources.map(src => (
                    <div
                      key={src.artifactId}
                      className="bg-[#fdf8ef] p-3 rounded-xl border border-[#2b2117]/10 flex items-start justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="bg-[#2b2117] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                            Album #{src.albumId}
                          </span>
                          <span className="font-serif font-bold text-[#2b2117]">{src.title}</span>
                          <span className="text-[10px] bg-[#92400e]/10 text-[#78350f] px-2 py-0.5 rounded-full font-mono uppercase">
                            Lane: {src.lane}
                          </span>
                        </div>
                        <p className="font-serif italic text-[#6b5a46] mt-1 line-clamp-1">
                          "{src.excerpt}"
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveSource(src.artifactId)}
                        className="text-[#c2410c] hover:bg-[#c2410c]/10 p-1 rounded-md"
                        title="Remove source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Target Form Selection */}
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-[#8a7a65] font-semibold block">
                Target Proposal Form:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                {[
                  { id: 'new_lyric', label: 'New Lyric / Song' },
                  { id: 'album_concept', label: 'Album Concept' },
                  { id: 'thesis_continuation', label: 'Thesis Extension' },
                  { id: 'liturgy', label: 'Spoken Liturgy' },
                  { id: 'repair_scar', label: 'Repair Scar' },
                ].map(form => (
                  <button
                    key={form.id}
                    onClick={() => setTargetForm(form.id as TargetProposalForm)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      targetForm === form.id
                        ? 'bg-[#2b2117] text-[#fde68a] border-[#2b2117] font-bold shadow-2xs'
                        : 'bg-white text-[#6b5a46] border-[#2b2117]/15 hover:border-[#2b2117]/30'
                    }`}
                  >
                    {form.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Request Text */}
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-[#8a7a65] font-semibold block">
                User Request & Direction:
              </label>
              <textarea
                value={requestText}
                onChange={e => setRequestText(e.target.value)}
                rows={3}
                placeholder="Direct SeedForge on how to weave the attached album motifs..."
                className="w-full bg-[#fdf8ef] border border-[#2b2117]/15 rounded-xl p-3 font-sans text-xs text-[#2b2117] focus:outline-none focus:ring-2 focus:ring-[#92400e]/30 placeholder:text-[#8a7a65]/60"
              />
            </div>

            {/* Active Tension Configuration */}
            <div className="space-y-2 bg-[#fffbeb] p-4 rounded-xl border border-[#d4a017]/30">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs uppercase text-[#78350f] font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#d4a017]" />
                  <span>Preserve Active Tension:</span>
                </label>
                <input
                  type="checkbox"
                  checked={preserveTensions}
                  onChange={e => setPreserveTensions(e.target.checked)}
                  className="w-4 h-4 rounded text-[#92400e] focus:ring-[#92400e]"
                />
              </div>
              <input
                type="text"
                value={activeTensionText}
                onChange={e => setActiveTensionText(e.target.value)}
                className="w-full bg-white border border-[#d4a017]/40 rounded-lg p-2 font-mono text-xs text-[#78350f]"
              />
            </div>

            {/* Error Message if any */}
            {generationError && (
              <div className="p-3 bg-[#fff1e6] border border-[#c2410c]/30 rounded-xl text-xs font-mono text-[#7c2d12] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{generationError}</span>
              </div>
            )}

            {/* Generate Action Button */}
            <button
              id="invoke-seedforge-btn"
              onClick={handleInvokeSeedForge}
              disabled={isGenerating || packetSources.length === 0}
              className={`w-full py-3 px-6 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                isGenerating || packetSources.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2b2117] text-[#fde68a] hover:bg-[#92400e] hover:text-white'
              }`}
            >
              <Sparkles className={`w-4 h-4 text-[#d4a017] ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating
                  ? 'SeedForge Invoking Gemini AI Server Endpoint...'
                  : 'Invoke SeedForge Proposal Node (Gemini)'}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Emitted Proposal & Human Harvest Gate (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {generatedProposal ? (
            <div className="rounded-2xl bg-white border-2 border-[#d4a017] p-6 shadow-md space-y-5 relative">
              <div className="flex items-center justify-between border-b border-[#2b2117]/10 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#78350f]">
                  <Sparkles className="w-4 h-4 text-[#d4a017]" />
                  <span>Emitted SeedForge Proposal</span>
                </div>
                <span className="font-mono text-[10px] bg-[#2b2117] text-[#fde68a] px-2 py-0.5 rounded-full font-bold">
                  {generatedProposal.model}
                </span>
              </div>

              {/* Proposal Header */}
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#2b2117]">
                  {generatedProposal.title}
                </h3>
                <div className="flex flex-wrap gap-1 font-mono text-[10px] text-[#8a7a65]">
                  <span>Motifs:</span>
                  {generatedProposal.keyMotifsUsed.map(m => (
                    <span key={m} className="bg-[#2b2117]/5 px-1.5 py-0.5 rounded text-[#2b2117]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Generated Content Body */}
              <div className="bg-[#fdf8ef] p-4 rounded-xl border border-[#2b2117]/10 font-serif text-sm text-[#2b2117] leading-relaxed whitespace-pre-line shadow-2xs">
                {generatedProposal.generatedContent}
              </div>

              {/* Tension Preserved Reasoning */}
              {generatedProposal.preserveTensionsReasoning && (
                <div className="bg-[#fffbeb] p-3 rounded-xl border border-[#d4a017]/30 space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#78350f] block">
                    Preserved Creative Tension Reasoning:
                  </span>
                  <p className="font-mono text-xs text-[#78350f] italic">
                    "{generatedProposal.preserveTensionsReasoning}"
                  </p>
                </div>
              )}

              {/* Token & Hash Receipt */}
              <div className="font-mono text-[10px] text-[#8a7a65] flex items-center justify-between pt-2 border-t border-dashed border-[#2b2117]/10">
                <span>Receipt Hash: <code>{generatedProposal.receipt.hash}</code></span>
                <span>Prompt Tokens: {generatedProposal.receipt.promptTokens}</span>
              </div>

              {/* CONSTITUTIONAL HUMAN HARVEST GATE */}
              <div className="bg-[#fdf0d5]/80 p-4 rounded-xl border border-[#92400e]/30 space-y-3 pt-4">
                <div className="font-mono text-xs font-bold text-[#78350f] flex items-center gap-1.5 uppercase">
                  <Lock className="w-4 h-4 text-[#c2410c]" />
                  <span>Authority Plane • Human Harvest Gate</span>
                </div>
                <p className="font-mono text-[11px] text-[#6b5a46]">
                  The model proposal is non-canonical until you exercise human harvest. Accepting this appends an immutable event to Jubilee's ledger chain.
                </p>

                {harvestMessage && (
                  <div className="p-2.5 bg-white border border-[#5b8a72] rounded-lg font-mono text-xs text-[#2f4a3e] font-semibold">
                    {harvestMessage}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 font-mono text-xs">
                  <button
                    id="harvest-to-ledger-btn"
                    onClick={handleHarvestToLedger}
                    disabled={isHarvesting}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#5b8a72] text-white font-bold hover:bg-[#2f4a3e] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isHarvesting ? 'Harvesting...' : '🌾 Harvest to Ledger'}</span>
                  </button>

                  <button
                    onClick={() => setHarvestMessage('Proposal held in active tension without state mutation.')}
                    className="py-2 px-3 rounded-lg bg-white border border-[#2b2117]/20 text-[#6b5a46] hover:bg-[#2b2117]/5"
                  >
                    Hold in Tension
                  </button>

                  <button
                    onClick={() => {
                      setGeneratedProposal(null);
                      setHarvestMessage(null);
                    }}
                    className="py-2 px-3 rounded-lg bg-[#c2410c]/10 text-[#7c2d12] hover:bg-[#c2410c]/20"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/70 border border-dashed border-[#2b2117]/15 p-8 text-center space-y-3 font-mono text-xs text-[#8a7a65]">
              <Cpu className="w-8 h-8 text-[#8a7a65]/50 mx-auto" />
              <p className="font-bold uppercase tracking-wider text-[#2b2117]">
                Awaiting SeedForge Proposal Generation
              </p>
              <p className="max-w-xs mx-auto text-[#6b5a46]">
                Select source nodes in <strong>Find Nearby Growth</strong>, set your prompt direction, and click <strong>Invoke SeedForge</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
