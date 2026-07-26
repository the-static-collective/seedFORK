/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Wrench,
  Compass,
  BookOpen,
  CheckCircle2,
  Lock,
  GitCommit,
  ShieldCheck,
  Code2,
  Trash2,
  Plus,
  RefreshCw,
  Clock,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  HelpCircle,
  Award
} from 'lucide-react';
import { Album, EventReceipt, JubileeIdea, NearbyGrowthLane, SeedForgeProposal } from '../types/jubileeTypes';
import { ALBUMS } from '../data/autodiscographyData';

export type StudioMode = 'seedforge' | 'refactor' | 'learning' | 'canon';

interface UnifiedWorkbenchProps {
  ledgerEvents: EventReceipt[];
  activeIdeas: JubileeIdea[];
  packetSources: Array<{
    artifactId: string;
    albumId: number;
    title: string;
    excerpt: string;
    lane: NearbyGrowthLane;
  }>;
  onRemoveSource: (artifactId: string) => void;
  onAddSource: (album: Album) => void;
  onRefreshLedger: () => void;
  onHarvestSuccess: (receipt: EventReceipt) => void;
}

export const UnifiedWorkbench: React.FC<UnifiedWorkbenchProps> = ({
  ledgerEvents,
  activeIdeas,
  packetSources,
  onRemoveSource,
  onAddSource,
  onRefreshLedger,
  onHarvestSuccess,
}) => {
  const [mode, setMode] = useState<StudioMode>('seedforge');

  // Input state
  const [promptText, setPromptText] = useState<string>(
    'Extend the motif of the pine kitchen table, porch light, and paper plates into a new 2-verse song or liturgy snippet.'
  );
  const [language, setLanguage] = useState<string>('typescript');
  const [preserveTension, setPreserveTension] = useState<boolean>(true);
  const [currentLevel, setCurrentLevel] = useState<string>('apprentice');

  // Status & loading
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Results state
  const [seedforgeResult, setSeedforgeResult] = useState<SeedForgeProposal | null>(null);
  const [refactorResult, setRefactorResult] = useState<{
    analysis: string;
    suggestedCode: string;
    improvements: string[];
    reasoning: string;
    repairScarNote: string;
  } | null>(null);
  const [learningResult, setLearningResult] = useState<{
    pathTitle: string;
    targetGoal: string;
    estimatedTotalDuration: string;
    milestones: Array<{
      stepNumber: number;
      title: string;
      summary: string;
      keyConcepts: string[];
      suggestedResources: Array<{ title: string; type: string; description: string }>;
      practicalTask: string;
    }>;
  } | null>(null);

  // Harvest state
  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);
  const [harvestMsg, setHarvestMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Drawer states
  const [showCanonSelector, setShowCanonSelector] = useState<boolean>(false);
  const [showLedgerDrawer, setShowLedgerDrawer] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Preset buttons
  const applyPreset = (presetText: string, targetMode: StudioMode) => {
    setMode(targetMode);
    setPromptText(presetText);
    setErrorMessage(null);
  };

  // Main Submit Trigger
  const handleInvokeAI = async () => {
    if (!promptText.trim()) {
      setErrorMessage('Please enter a request, code snippet, or learning goal.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setHarvestMsg(null);

    try {
      if (mode === 'seedforge') {
        const res = await fetch('/api/seedforge/propose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            packetId: `pkt_${Date.now()}`,
            requestText: promptText,
            selectedSources: packetSources,
            activeTensions: ['Preserve organic choice vs automated velocity'],
            targetForm: 'new_lyric',
            constraints: { proposalOnly: true, preserveTensions: preserveTension, noDirectStateMutation: true },
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'SeedForge proposal failed');
        }

        const proposal = await res.json();
        setSeedforgeResult(proposal);
      } else if (mode === 'refactor') {
        const res = await fetch('/api/refactor/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            codeSnippet: promptText,
            language,
            goals: 'Improve type safety, enforce immutability, and document repair scar context.',
            preserveScar: preserveTension,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Refactor analysis failed');
        }

        const data = await res.json();
        setRefactorResult(data);
      } else if (mode === 'learning') {
        const res = await fetch('/api/learning-path/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userGoal: promptText,
            currentLevel,
            interests: 'TypeScript, Open E Tuning, Jubilee Witness Ledger',
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Learning path generation failed');
        }

        const data = await res.json();
        setLearningResult(data);
      } else if (mode === 'canon') {
        const res = await fetch('/api/nearby-growth/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            seedAlbumTitle: packetSources[0]?.title || ALBUMS[25].title,
            seedThemes: [promptText],
            allAlbumsCount: 26,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Synthesis failed');
        }

        const synth = await res.json();
        setSeedforgeResult({
          proposalId: `synth_${Date.now()}`,
          packetId: `pkt_synth`,
          title: `Synthesis: ${synth.thesisStatement?.slice(0, 40) || '26-Album Resonance'}`,
          generatedContent: `${synth.thesisStatement}\n\n${synth.synthesizedLitany}`,
          provenanceSources: packetSources.map(p => p.artifactId),
          keyMotifsUsed: synth.recurringMotifs || ['porch', 'table'],
          model: 'Gemini 3.6 Flash Synthesis',
          receipt: { promptTokens: 420, candidateTokens: 250, hash: `sha256_${Date.now().toString(16)}` },
        });
      }
    } catch (err: any) {
      console.error('Unified Studio AI Execution error:', err);
      setErrorMessage(err.message || 'Error processing request with Gemini AI.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Harvest Handler
  const handleHarvestToLedger = async (summary: string, content: string, tensionResolved?: string) => {
    setIsHarvesting(true);
    setHarvestMsg(null);

    try {
      const res = await fetch('/api/jubilee/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary,
          content,
          era: 'canon',
          tensionResolved,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setHarvestMsg(`Harvested to Jubilee Ledger! Hash: ${data.receipt.currentHash}`);
        onHarvestSuccess(data.receipt);
      } else {
        throw new Error(data.error || 'Harvest failed');
      }
    } catch (err: any) {
      console.error('Harvest error:', err);
      setHarvestMsg(`Harvest error: ${err.message}`);
    } finally {
      setIsHarvesting(false);
    }
  };

  const headHash = ledgerEvents[ledgerEvents.length - 1]?.currentHash || '0x0';

  return (
    <div className="space-y-6">
      {/* Top Banner Status Bar */}
      <div className="rounded-2xl bg-[#2b2117] text-[#fdf8ef] p-5 md:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#fde68a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#d4a017]" />
            <span>Jubilee Garden Cluster • Unified Studio</span>
            <span>•</span>
            <span className="text-white font-bold">SHA-256 Ledger Witness</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Single-Screen Workbench
          </h2>
          <p className="font-mono text-xs text-[#fdf8ef]/70">
            Enter any lyric prompt, code to refactor, or learning goal. Models propose — you harvest.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 font-mono text-xs text-right">
            <div className="text-[10px] text-white/60 uppercase">Head Hash</div>
            <div className="font-bold text-[#fde68a]">{headHash}</div>
          </div>

          <button
            onClick={() => setShowLedgerDrawer(!showLedgerDrawer)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 border border-white/15"
            title="Toggle Ledger Stream"
          >
            <GitCommit className="w-4 h-4 text-[#5b8a72]" />
            <span>Ledger ({ledgerEvents.length})</span>
          </button>
        </div>
      </div>

      {/* Main Single-Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Command & Input Studio (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-sm space-y-4">
            {/* Mode Switch Segmented Controls */}
            <div className="space-y-1.5">
              <label className="font-mono text-[11px] uppercase text-[#8a7a65] font-bold block">
                Select Engine Mode:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-xs">
                {[
                  { id: 'seedforge', label: 'Proposal AI', icon: Sparkles },
                  { id: 'refactor', label: 'Refactor', icon: Wrench },
                  { id: 'learning', label: 'Learning Path', icon: Compass },
                  { id: 'canon', label: 'Lore Synthesis', icon: BookOpen },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id as StudioMode)}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all ${
                        mode === m.id
                          ? 'bg-[#2b2117] text-[#fde68a] border-[#2b2117] shadow-2xs'
                          : 'bg-white text-[#6b5a46] border-[#2b2117]/15 hover:border-[#2b2117]/30'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1 font-mono text-[11px]">
              <span className="text-[#8a7a65] font-semibold uppercase block">Quick Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => applyPreset('Extend the motif of the pine kitchen table, porch light, and paper plates into a verse.', 'seedforge')}
                  className="bg-[#fdf8ef] hover:bg-[#f5d6a8]/50 px-2.5 py-1 rounded-lg border border-[#2b2117]/15 text-[#2b2117]"
                >
                  🌾 Kitchen Table Motif
                </button>
                <button
                  onClick={() => applyPreset('// Refactor event handler to enforce immutable hash chain\ninterface Event { id: string; title: string; }\nfunction saveEvent(e: Event) { window.localStorage.setItem("evt", JSON.stringify(e)); }', 'refactor')}
                  className="bg-[#fdf8ef] hover:bg-[#f5d6a8]/50 px-2.5 py-1 rounded-lg border border-[#2b2117]/15 text-[#2b2117]"
                >
                  🛠️ Refactor Event Function
                </button>
                <button
                  onClick={() => applyPreset('Master Open E guitar tuning composition and SHA-256 event chains', 'learning')}
                  className="bg-[#fdf8ef] hover:bg-[#f5d6a8]/50 px-2.5 py-1 rounded-lg border border-[#2b2117]/15 text-[#2b2117]"
                >
                  🧭 Open E & Hash Chains
                </button>
              </div>
            </div>

            {/* Main Input Textarea */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-[#8a7a65] uppercase font-bold">
                <span>
                  {mode === 'seedforge' && 'Creative Request / Lyric Direction:'}
                  {mode === 'refactor' && 'Code / Text Snippet to Refactor:'}
                  {mode === 'learning' && 'Primary Learning Goal:'}
                  {mode === 'canon' && 'Autodiscography Synthesis Prompt:'}
                </span>
                {mode === 'refactor' && (
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="bg-[#fdf8ef] border border-[#2b2117]/15 rounded px-2 py-0.5 text-[10px] text-[#2b2117]"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="lyric_liturgy">Folk Lyric</option>
                  </select>
                )}
              </div>

              <textarea
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                rows={6}
                className={`w-full border rounded-xl p-3.5 font-mono text-xs focus:outline-none focus:ring-2 leading-relaxed ${
                  mode === 'refactor'
                    ? 'bg-[#2b2117] text-[#fde68a] border-[#2b2117]/30 focus:ring-[#d4a017]/40'
                    : 'bg-[#fdf8ef] text-[#2b2117] border-[#2b2117]/15 focus:ring-[#92400e]/30'
                }`}
                placeholder="Enter prompt or snippet..."
              />
            </div>

            {/* Preservation Checkbox */}
            <div className="flex items-center justify-between bg-[#fffbeb] p-3 rounded-xl border border-[#d4a017]/30 font-mono text-xs text-[#78350f]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#d4a017]" />
                <span>Preserve Repair Scars & Active Creative Tensions</span>
              </div>
              <input
                type="checkbox"
                checked={preserveTension}
                onChange={e => setPreserveTension(e.target.checked)}
                className="w-4 h-4 rounded text-[#92400e] focus:ring-[#92400e]"
              />
            </div>

            {/* Attached Packet Sources Drawer */}
            <div className="space-y-2 bg-[#fdf8ef] p-3.5 rounded-xl border border-[#2b2117]/10 font-mono text-xs">
              <div className="flex items-center justify-between text-[#8a7a65]">
                <span className="uppercase font-bold">Attached Sources ({packetSources.length})</span>
                <button
                  type="button"
                  onClick={() => setShowCanonSelector(!showCanonSelector)}
                  className="text-[#92400e] hover:underline font-bold text-[11px] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showCanonSelector ? 'Close Album Picker' : '+ Add Album Context'}</span>
                </button>
              </div>

              {/* Source Chips */}
              <div className="flex flex-wrap gap-1.5">
                {packetSources.map(src => (
                  <div
                    key={src.artifactId}
                    className="bg-white border border-[#2b2117]/15 rounded-lg px-2.5 py-1 text-[11px] flex items-center gap-1.5 text-[#2b2117]"
                  >
                    <span className="font-bold text-[#92400e]">#{src.albumId}</span>
                    <span className="truncate max-w-[140px] font-serif">{src.title}</span>
                    <button
                      onClick={() => onRemoveSource(src.artifactId)}
                      className="text-[#c2410c] hover:bg-[#c2410c]/10 rounded p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Canon Picker Drawer */}
              {showCanonSelector && (
                <div className="pt-2 border-t border-dashed border-[#2b2117]/15 space-y-2">
                  <span className="text-[10px] text-[#6b5a46] block font-bold uppercase">
                    Pick an Album from the 26-Album Canon to Attach:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {ALBUMS.slice(0, 10).map(album => (
                      <button
                        key={album.n}
                        onClick={() => {
                          onAddSource(album);
                          setShowCanonSelector(false);
                        }}
                        className="p-2 bg-white hover:bg-[#fffbeb] rounded-lg border border-[#2b2117]/10 text-left text-[11px] font-serif flex items-center justify-between"
                      >
                        <span className="font-bold text-[#2b2117]">#{album.n} {album.title}</span>
                        <Plus className="w-3.5 h-3.5 text-[#5b8a72]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 bg-[#fff1e6] border border-[#c2410c]/30 rounded-xl font-mono text-xs text-[#7c2d12] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Invoke Action Button */}
            <button
              id="invoke-unified-btn"
              onClick={handleInvokeAI}
              disabled={isProcessing}
              className={`w-full py-3.5 px-6 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2b2117] text-[#fde68a] hover:bg-[#92400e] hover:text-white'
              }`}
            >
              <Sparkles className={`w-4 h-4 text-[#d4a017] ${isProcessing ? 'animate-spin' : ''}`} />
              <span>
                {isProcessing
                  ? 'Processing with Gemini AI...'
                  : `Invoke ${mode.toUpperCase()} AI Engine`}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Output & Human Harvest Gate (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* SeedForge Output */}
          {mode === 'seedforge' || mode === 'canon' ? (
            seedforgeResult ? (
              <div className="rounded-2xl bg-white border-2 border-[#d4a017] p-5 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#2b2117]/10 pb-2.5 font-mono text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#78350f]">
                    <Sparkles className="w-4 h-4 text-[#d4a017]" />
                    <span>Gemini AI Generated Proposal</span>
                  </div>
                  <span className="bg-[#2b2117] text-[#fde68a] px-2 py-0.5 rounded text-[10px] font-bold">
                    {seedforgeResult.model}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#2b2117]">
                  {seedforgeResult.title}
                </h3>

                <div className="bg-[#fdf8ef] p-4 rounded-xl border border-[#2b2117]/10 font-serif text-sm text-[#2b2117] leading-relaxed whitespace-pre-line">
                  {seedforgeResult.generatedContent}
                </div>

                {/* Human Harvest Gate */}
                <div className="bg-[#fdf0d5] p-4 rounded-xl border border-[#92400e]/30 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between font-bold text-[#78350f]">
                    <span className="flex items-center gap-1.5 uppercase">
                      <Lock className="w-4 h-4 text-[#c2410c]" />
                      <span>Human Harvest Gate</span>
                    </span>
                    <span className="text-[10px] text-[#6b5a46]">Receipt: {seedforgeResult.receipt.hash.slice(0, 10)}...</span>
                  </div>

                  {harvestMsg && (
                    <div className="p-2.5 bg-white border border-[#5b8a72] rounded-lg text-[#2f4a3e] font-semibold">
                      {harvestMsg}
                    </div>
                  )}

                  <button
                    onClick={() => handleHarvestToLedger(`Harvested: ${seedforgeResult.title}`, seedforgeResult.generatedContent)}
                    disabled={isHarvesting}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#5b8a72] text-white font-bold hover:bg-[#2f4a3e] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isHarvesting ? 'Harvesting...' : '🌾 Harvest to Witness Ledger'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/70 border border-dashed border-[#2b2117]/15 p-12 text-center space-y-3 font-mono text-xs text-[#8a7a65]">
                <Sparkles className="w-8 h-8 text-[#d4a017]/50 mx-auto" />
                <p className="font-bold uppercase tracking-wider text-[#2b2117]">
                  Awaiting Proposal Generation
                </p>
                <p className="max-w-xs mx-auto text-[#6b5a46]">
                  Enter your creative prompt on the left and click <strong>Invoke SEEDFORGE AI Engine</strong>.
                </p>
              </div>
            )
          ) : mode === 'refactor' ? (
            refactorResult ? (
              <div className="rounded-2xl bg-white border-2 border-[#5b8a72] p-5 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#2b2117]/10 pb-2.5 font-mono text-xs font-bold text-[#2f4a3e]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#5b8a72]" />
                    <span>reCURV Refactored Output</span>
                  </div>
                </div>

                <div className="font-sans text-xs text-[#2b2117] bg-[#fdf8ef] p-3 rounded-xl border border-[#2b2117]/10">
                  <strong>Analysis:</strong> {refactorResult.analysis}
                </div>

                <pre className="bg-[#2b2117] text-[#fde68a] p-3.5 rounded-xl font-mono text-xs overflow-x-auto max-h-56 leading-relaxed">
                  <code>{refactorResult.suggestedCode}</code>
                </pre>

                {refactorResult.repairScarNote && (
                  <div className="bg-[#fffbeb] p-3 rounded-xl border border-[#d4a017]/40 font-mono text-xs text-[#78350f]">
                    <strong>Preserved Scar:</strong> {refactorResult.repairScarNote}
                  </div>
                )}

                <div className="bg-[#fdf8ef] p-3.5 rounded-xl border border-[#2b2117]/15 space-y-2 font-mono text-xs">
                  {harvestMsg && (
                    <div className="p-2 bg-white border border-[#5b8a72] rounded text-[#2f4a3e] font-semibold">
                      {harvestMsg}
                    </div>
                  )}
                  <button
                    onClick={() => handleHarvestToLedger('Refactored Codebase Commit', refactorResult.suggestedCode, refactorResult.repairScarNote)}
                    disabled={isHarvesting}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#5b8a72] text-white font-bold hover:bg-[#2f4a3e] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isHarvesting ? 'Harvesting...' : '🌾 Harvest Refactor to Ledger'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/70 border border-dashed border-[#2b2117]/15 p-12 text-center space-y-3 font-mono text-xs text-[#8a7a65]">
                <Wrench className="w-8 h-8 text-[#92400e]/50 mx-auto" />
                <p className="font-bold uppercase tracking-wider text-[#2b2117]">
                  Awaiting Refactoring Request
                </p>
                <p className="max-w-xs mx-auto text-[#6b5a46]">
                  Paste target code on the left and click <strong>Invoke REFACTOR AI Engine</strong>.
                </p>
              </div>
            )
          ) : mode === 'learning' ? (
            learningResult ? (
              <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-md space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#2b2117]/10 pb-2.5">
                  <h3 className="font-serif text-lg font-bold text-[#2b2117]">{learningResult.pathTitle}</h3>
                  <span className="text-[#8a7a65]">{learningResult.estimatedTotalDuration}</span>
                </div>

                <p className="text-[#6b5a46]"><strong>Goal:</strong> {learningResult.targetGoal}</p>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {learningResult.milestones.map(ms => (
                    <div key={ms.stepNumber} className="bg-[#fdf8ef] p-3 rounded-xl border border-[#2b2117]/10 space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-[#2b2117]">
                        <span>Step {ms.stepNumber}: {ms.title}</span>
                      </div>
                      <p className="text-[11px] text-[#6b5a46]">{ms.summary}</p>
                      <div className="bg-[#fffbeb] p-2 rounded border border-[#d4a017]/30 text-[#78350f] text-[11px]">
                        <strong>Task:</strong> {ms.practicalTask}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleHarvestToLedger(`Learning Path Generated: ${learningResult.pathTitle}`, learningResult.targetGoal)}
                  disabled={isHarvesting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2b2117] text-[#fde68a] font-bold hover:bg-[#92400e] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#d4a017]" />
                  <span>{isHarvesting ? 'Harvesting...' : '🌾 Harvest Learning Path to Ledger'}</span>
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/70 border border-dashed border-[#2b2117]/15 p-12 text-center space-y-3 font-mono text-xs text-[#8a7a65]">
                <Compass className="w-8 h-8 text-[#d4a017]/50 mx-auto" />
                <p className="font-bold uppercase tracking-wider text-[#2b2117]">
                  Awaiting Learning Path Synthesis
                </p>
                <p className="max-w-xs mx-auto text-[#6b5a46]">
                  Specify your goals on the left and click <strong>Invoke LEARNING AI Engine</strong>.
                </p>
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* Collapsible Witness Ledger Stream Drawer at the bottom */}
      {showLedgerDrawer && (
        <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-md space-y-3 font-mono text-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-[#2b2117]/10 pb-2.5 font-bold text-[#2b2117]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5b8a72]" />
              <span className="uppercase">Immutable Witness Ledger Stream</span>
            </div>
            <button
              onClick={() => setShowLedgerDrawer(false)}
              className="text-[#8a7a65] hover:text-[#2b2117]"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
            {ledgerEvents.slice().reverse().map(evt => (
              <div key={evt.eventId} className="bg-[#fdf8ef] p-3 rounded-xl border border-[#2b2117]/10 space-y-1 text-[11px]">
                <div className="flex items-center justify-between font-bold text-[#2b2117]">
                  <span className="bg-[#2b2117] text-[#fde68a] px-1.5 py-0.2 rounded text-[10px]">{evt.eventType}</span>
                  <span className="text-[#8a7a65] text-[9px]">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="font-serif font-bold text-[#2b2117] text-xs line-clamp-1">{evt.payload.summary}</p>
                <div className="text-[9px] text-[#5b8a72] font-semibold truncate">Hash: {evt.currentHash}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
