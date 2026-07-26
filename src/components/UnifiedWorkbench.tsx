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
  FileEdit,
  GitBranch,
  XCircle,
  CheckSquare,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Album, EventReceipt, JubileeIdea, NearbyGrowthLane, SeedForgeProposal, TargetProposalForm } from '../types/jubileeTypes';
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

  // Input & Tension state
  const [promptText, setPromptText] = useState<string>(
    'Extend the motif of the pine kitchen table, porch light, and paper plates into a 2-verse song fragment.'
  );
  const [activeTensionText, setActiveTensionText] = useState<string>(
    'Pine kitchen table hospitality vs distant automated digital archive'
  );
  const [targetForm, setTargetForm] = useState<TargetProposalForm>('song_fragment');
  const [language, setLanguage] = useState<string>('typescript');
  const [preserveTension, setPreserveTension] = useState<boolean>(true);

  // Status & loading
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Results state
  const [seedforgeResult, setSeedforgeResult] = useState<SeedForgeProposal | null>(null);
  const [humanRevisionText, setHumanRevisionText] = useState<string>('');
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

  // Harvest & Action state
  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Verification State
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    verifiedEventsCount: number;
    headHash: string;
    chain: Array<{ index: number; eventId: string; currentHash: string; isVerified: boolean }>;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Drawers & Preserved Parallels
  const [showCanonSelector, setShowCanonSelector] = useState<boolean>(false);
  const [showLedgerDrawer, setShowLedgerDrawer] = useState<boolean>(false);
  const [showParallelsDrawer, setShowParallelsDrawer] = useState<boolean>(false);
  const [preservedList, setPreservedList] = useState<Array<{
    title: string;
    actionTaken: string;
    content: string;
    reasoning: string;
    timestamp: string;
  }>>([]);

  // Presets
  const applyPreset = (presetPrompt: string, tensionStr: string, form: TargetProposalForm, targetMode: StudioMode) => {
    setMode(targetMode);
    setPromptText(presetPrompt);
    setActiveTensionText(tensionStr);
    setTargetForm(form);
    setErrorMessage(null);
    setActionFeedback(null);
  };

  // Invoke AI Generation
  const handleInvokeAI = async () => {
    if (!promptText.trim()) {
      setErrorMessage('Please enter a request, code snippet, or learning goal.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setActionFeedback(null);

    try {
      if (mode === 'seedforge' || mode === 'canon') {
        const res = await fetch('/api/seedforge/propose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            packetId: `pkt_${Date.now()}`,
            requestText: promptText,
            selectedSources: packetSources,
            activeTensions: [activeTensionText],
            targetForm,
            constraints: { proposalOnly: true, preserveTensions: preserveTension, noDirectStateMutation: true },
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'SeedForge proposal failed');
        }

        const proposal: SeedForgeProposal = await res.json();
        setSeedforgeResult(proposal);
        setHumanRevisionText(proposal.generatedContent);
      } else if (mode === 'refactor') {
        const res = await fetch('/api/refactor/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            codeSnippet: promptText,
            language,
            goals: 'Improve type safety, enforce immutability, and preserve repair scar context.',
            preserveScar: preserveTension,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Refactor analysis failed');
        }

        const data = await res.json();
        setRefactorResult(data);
        setHumanRevisionText(data.suggestedCode);
      } else if (mode === 'learning') {
        const res = await fetch('/api/learning-path/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userGoal: promptText,
            currentLevel: 'intermediate',
            interests: 'TypeScript, Open E Tuning, SHA-256 Hash Chains',
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Learning path generation failed');
        }

        const data = await res.json();
        setLearningResult(data);
        setHumanRevisionText(data.targetGoal);
      }
    } catch (err: any) {
      console.error('AI Execution error:', err);
      setErrorMessage(err.message || 'Error processing request with Gemini AI.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Harvest Action (Committed to SHA-256 Ledger)
  const handleHarvestToLedger = async (summary: string, content: string, tensionResolved?: string) => {
    setIsHarvesting(true);
    setActionFeedback(null);

    try {
      const res = await fetch('/api/jubilee/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary,
          content,
          era: 'canon',
          tensionResolved,
          actor: 'human:jublEchat'
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionFeedback(`🌾 Harvested to Jubilee Witness Ledger! SHA-256: ${data.receipt.currentHash.slice(0, 16)}...`);
        onHarvestSuccess(data.receipt);
      } else {
        throw new Error(data.error || 'Harvest failed');
      }
    } catch (err: any) {
      console.error('Harvest error:', err);
      setActionFeedback(`Harvest error: ${err.message}`);
    } finally {
      setIsHarvesting(false);
    }
  };

  // Preserve as Parallel Branch Action (Repair Scar)
  const handlePreserveParallel = async (title: string, content: string, reasoning: string, actionTaken: 'preserved_parallel' | 'rejected') => {
    try {
      const res = await fetch('/api/jubilee/parallel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          reasoning,
          actionTaken
        })
      });

      const data = await res.json();
      if (data.success) {
        setPreservedList(prev => [
          {
            title,
            content,
            actionTaken,
            reasoning,
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
        setActionFeedback(`🌿 Preserved as parallel branch (${actionTaken}). Recorded scar hash in witness ledger.`);
        onRefreshLedger();
      }
    } catch (err: any) {
      console.error('Failed to preserve parallel branch:', err);
    }
  };

  // Hash Verification Trigger
  const handleVerifyLedgerChain = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/jubilee/verify');
      const data = await res.json();
      setVerificationResult(data);
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const headHash = ledgerEvents[ledgerEvents.length - 1]?.currentHash || '0x0';

  return (
    <div className="space-y-6">
      {/* Primary Governing Banner */}
      <div className="rounded-2xl bg-[#2b2117] text-[#fdf8ef] p-6 shadow-md border border-[#2b2117]/30 space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#fde68a] uppercase tracking-wider font-bold">
              <Sparkles className="w-4 h-4 text-[#d4a017]" />
              <span>seedFORK • Jubilee Living Workstation</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-white mt-1">
              "Models propose. Humans harvest. Jubilee witnesses."
            </h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 font-mono text-xs text-right">
              <div className="text-[10px] text-white/60 uppercase font-bold">Ledger Head</div>
              <div className="font-bold text-[#fde68a] font-mono text-[11px] truncate max-w-[120px]">
                {headHash.slice(0, 14)}...
              </div>
            </div>

            <button
              onClick={handleVerifyLedgerChain}
              disabled={isVerifying}
              className="px-3 py-2 rounded-xl bg-[#5b8a72] hover:bg-[#2f4a3e] text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isVerifying ? 'Verifying...' : 'Verify Chain'}</span>
            </button>
          </div>
        </div>

        {/* Honest Persistence Sub-Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#fdf8ef]/70">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#fde68a] animate-pulse"></span>
            <span>Storage Mode: <strong>In-Memory Session Ledger</strong> (Volatile unless harvested/exported)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowParallelsDrawer(!showParallelsDrawer)}
              className="text-[#fde68a] hover:underline font-bold flex items-center gap-1"
            >
              <GitBranch className="w-3.5 h-3.5 text-[#d4a017]" />
              <span>Preserved Parallels ({preservedList.length})</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setShowLedgerDrawer(!showLedgerDrawer)}
              className="text-[#fde68a] hover:underline font-bold flex items-center gap-1"
            >
              <GitCommit className="w-3.5 h-3.5 text-[#5b8a72]" />
              <span>Witness Events ({ledgerEvents.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chain Verification Result Modal / Alert */}
      {verificationResult && (
        <div className={`p-4 rounded-xl border font-mono text-xs flex items-start justify-between gap-3 ${
          verificationResult.isValid
            ? 'bg-[#f0fdf4] border-[#5b8a72] text-[#166534]'
            : 'bg-[#fef2f2] border-[#dc2626] text-[#991b1b]'
        }`}>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-sm">
                {verificationResult.isValid ? 'Cryptographic SHA-256 Hash Chain Verified Intact' : 'Ledger Chain Verification Failed'}
              </div>
              <p>
                Verified {verificationResult.verifiedEventsCount} events back to Genesis block (parent 0x000...00).
                Head Hash: <code className="bg-white/80 px-1 py-0.5 rounded">{verificationResult.headHash}</code>
              </p>
            </div>
          </div>
          <button
            onClick={() => setVerificationResult(null)}
            className="text-current hover:opacity-75 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Step Guide Bar for First-Time Users */}
      <div className="bg-white rounded-xl border border-[#2b2117]/10 p-4 font-mono text-xs text-[#2b2117]">
        <div className="font-bold text-[#8a7a65] uppercase text-[10px] tracking-wider mb-2">
          Central Workstation Flow:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className="bg-[#fdf8ef] p-2 rounded-lg border border-[#2b2117]/10">
            <span className="font-bold text-[#92400e]">1. Source</span>
            <p className="text-[10px] text-[#6b5a46] truncate">Pick from 26 Albums</p>
          </div>
          <div className="bg-[#fdf8ef] p-2 rounded-lg border border-[#2b2117]/10">
            <span className="font-bold text-[#92400e]">2. Tension</span>
            <p className="text-[10px] text-[#6b5a46] truncate">Set creative conflict</p>
          </div>
          <div className="bg-[#fdf8ef] p-2 rounded-lg border border-[#2b2117]/10">
            <span className="font-bold text-[#92400e]">3. Propose</span>
            <p className="text-[10px] text-[#6b5a46] truncate">SeedForge generates</p>
          </div>
          <div className="bg-[#fdf8ef] p-2 rounded-lg border border-[#2b2117]/10">
            <span className="font-bold text-[#2f4a3e]">4. Revise</span>
            <p className="text-[10px] text-[#6b5a46] truncate">Human annotation</p>
          </div>
          <div className="bg-[#fdf8ef] p-2 rounded-lg border border-[#5b8a72] col-span-2 sm:col-span-1">
            <span className="font-bold text-[#5b8a72]">5. Harvest</span>
            <p className="text-[10px] text-[#6b5a46] truncate">SHA-256 witness</p>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Studio Controls & Lineage Packet (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-sm space-y-4">
            {/* Mode Switcher */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="uppercase text-[#8a7a65] font-bold block text-[10px]">
                Studio Engine Mode:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'seedforge', label: 'Proposal AI', icon: Sparkles },
                  { id: 'refactor', label: 'Code Refactor', icon: Wrench },
                  { id: 'learning', label: 'Learning Path', icon: Compass },
                  { id: 'canon', label: 'Lore Synthesis', icon: BookOpen },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id as StudioMode)}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all ${
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

            {/* Target Form Selector */}
            <div className="space-y-1 font-mono text-xs">
              <label className="uppercase text-[#8a7a65] font-bold block text-[10px]">
                Target Output Form:
              </label>
              <select
                value={targetForm}
                onChange={e => setTargetForm(e.target.value as TargetProposalForm)}
                className="w-full bg-[#fdf8ef] border border-[#2b2117]/15 rounded-xl p-2.5 text-xs text-[#2b2117] font-bold focus:ring-2 focus:ring-[#92400e]/30"
              >
                <option value="song_fragment">🎵 Song Fragment (2 Verses)</option>
                <option value="new_lyric">✍️ Lyric Litany / Verse</option>
                <option value="album_concept">📖 Album Concept & Lore Thesis</option>
                <option value="structural_idea">🏛️ Structural Idea & Liturgy</option>
                <option value="code_repair">🛠️ Code Repair / reCURV</option>
                <option value="learning_path">🧭 Learning Path Milestone</option>
              </select>
            </div>

            {/* Active Tension Definition Box */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-[#8a7a65] font-bold text-[10px] uppercase">
                <span>Active Creative Tension:</span>
                <span className="text-[#92400e]">Preserved</span>
              </div>
              <input
                type="text"
                value={activeTensionText}
                onChange={e => setActiveTensionText(e.target.value)}
                className="w-full bg-[#fffbeb] border border-[#d4a017]/40 rounded-xl p-2.5 font-mono text-xs text-[#78350f] font-semibold focus:outline-none focus:ring-2 focus:ring-[#d4a017]/50"
                placeholder="e.g. Pine table hospitality vs automated velocity"
              />
            </div>

            {/* Request / Code Input */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-[#8a7a65] uppercase font-bold text-[10px]">
                <span>
                  {mode === 'seedforge' && 'Creative Request Prompt:'}
                  {mode === 'refactor' && 'Code Snippet to Analyze:'}
                  {mode === 'learning' && 'Learning Goal:'}
                  {mode === 'canon' && 'Autodiscography Theme:'}
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
                  </select>
                )}
              </div>

              <textarea
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                rows={5}
                className={`w-full border rounded-xl p-3 font-mono text-xs focus:outline-none focus:ring-2 leading-relaxed ${
                  mode === 'refactor'
                    ? 'bg-[#2b2117] text-[#fde68a] border-[#2b2117]/30'
                    : 'bg-[#fdf8ef] text-[#2b2117] border-[#2b2117]/15'
                }`}
                placeholder="Describe your creative intention or code snippet..."
              />
            </div>

            {/* Presets Row */}
            <div className="space-y-1 font-mono text-[10px]">
              <span className="text-[#8a7a65] font-bold uppercase block">Workstation Presets:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => applyPreset('Extend motif of paper plates and kitchen table into song fragment.', 'Pine table hospitality vs digital archive', 'song_fragment', 'seedforge')}
                  className="bg-[#fdf8ef] hover:bg-[#fffbeb] px-2 py-1 rounded-lg border border-[#2b2117]/15 text-[#2b2117]"
                >
                  🌾 Paper Plates
                </button>
                <button
                  onClick={() => applyPreset('// Refactor event queue\nfunction pushEvent(e: any) { events.push(e); }', 'Mutable state vs SHA-256 witness', 'code_repair', 'refactor')}
                  className="bg-[#fdf8ef] hover:bg-[#fffbeb] px-2 py-1 rounded-lg border border-[#2b2117]/15 text-[#2b2117]"
                >
                  🛠️ Refactor Queue
                </button>
                <button
                  onClick={() => applyPreset('Master open E tuning guitar composition and SHA-256 ledger receipts.', 'Folk acoustics vs crypto proof', 'learning_path', 'learning')}
                  className="bg-[#fdf8ef] hover:bg-[#fffbeb] px-2 py-1 rounded-lg border border-[#2b2117]/15 text-[#2b2117]"
                >
                  🧭 Open E & Ledger
                </button>
              </div>
            </div>

            {/* Attached Lineage Packet Tray */}
            <div className="bg-[#fdf8ef] p-3.5 rounded-xl border border-[#2b2117]/10 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[#8a7a65]">
                <span className="uppercase font-bold text-[10px]">Lineage Packet Tray ({packetSources.length})</span>
                <button
                  type="button"
                  onClick={() => setShowCanonSelector(!showCanonSelector)}
                  className="text-[#92400e] hover:underline font-bold text-[10px] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showCanonSelector ? 'Close' : '+ Attach Album'}</span>
                </button>
              </div>

              {/* Source Chips */}
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {packetSources.map(src => (
                  <div
                    key={src.artifactId}
                    className="bg-white border border-[#2b2117]/15 rounded-lg px-2.5 py-1 text-[11px] flex items-center gap-1.5 text-[#2b2117]"
                  >
                    <span className="font-bold text-[#92400e]">#{src.albumId}</span>
                    <span className="truncate max-w-[130px] font-serif">{src.title}</span>
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
                    Select Album from 26-Album Canon to Attach:
                  </span>
                  <div className="grid grid-cols-1 gap-1 max-h-36 overflow-y-auto pr-1">
                    {ALBUMS.map(album => (
                      <button
                        key={album.n}
                        onClick={() => {
                          onAddSource(album);
                          setShowCanonSelector(false);
                        }}
                        className="p-1.5 bg-white hover:bg-[#fffbeb] rounded-lg border border-[#2b2117]/10 text-left text-[11px] font-serif flex items-center justify-between"
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

            {/* Submit Button */}
            <button
              id="invoke-seedforge-btn"
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
                  ? 'SeedForge Generating Proposal...'
                  : `Ask SeedForge for Bounded Proposal`}
              </span>
            </button>
          </div>
        </div>

        {/* Right Studio Column: Proposal Workspace & Human Harvest Gate (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {seedforgeResult ? (
            <div className="rounded-2xl bg-white border-2 border-[#d4a017] p-5 shadow-md space-y-5">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-[#2b2117]/10 pb-3 font-mono text-xs gap-2">
                <div className="flex items-center gap-2 font-bold text-[#78350f]">
                  <Sparkles className="w-4 h-4 text-[#d4a017]" />
                  <span>SeedForge Bounded AI Proposal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#2b2117] text-[#fde68a] px-2 py-0.5 rounded text-[10px] font-bold">
                    {seedforgeResult.model}
                  </span>
                  <span className="text-[10px] text-[#8a7a65]">ID: {seedforgeResult.proposalId}</span>
                </div>
              </div>

              {/* Title & Preserved Tension Reasoning */}
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-[#2b2117]">
                  {seedforgeResult.title}
                </h2>
                <div className="bg-[#fffbeb] p-3 rounded-xl border border-[#d4a017]/40 font-mono text-xs text-[#78350f] flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#d4a017] shrink-0 mt-0.5" />
                  <div>
                    <strong>Preserved Tension:</strong> {seedforgeResult.preserveTensionsReasoning}
                  </div>
                </div>
              </div>

              {/* Side-by-Side: Proposal Edit & Evidence Context */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left: Proposal & Human Revision Box (7 cols) */}
                <div className="md:col-span-7 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#8a7a65] font-bold text-[10px] uppercase">
                    <span className="flex items-center gap-1">
                      <FileEdit className="w-3.5 h-3.5 text-[#5b8a72]" />
                      <span>Human Revision & Annotations:</span>
                    </span>
                    <span className="text-[#5b8a72]">Editable</span>
                  </div>
                  <textarea
                    value={humanRevisionText}
                    onChange={e => setHumanRevisionText(e.target.value)}
                    rows={12}
                    className="w-full bg-[#fdf8ef] border border-[#2b2117]/20 rounded-xl p-3.5 font-serif text-sm text-[#2b2117] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#5b8a72]/40"
                  />
                </div>

                {/* Right: Attached Evidence & Provenance (5 cols) */}
                <div className="md:col-span-5 space-y-3 bg-[#fdf8ef] p-3.5 rounded-xl border border-[#2b2117]/10 font-mono text-xs">
                  <div className="font-bold text-[#2b2117] uppercase text-[10px] tracking-wider border-b border-[#2b2117]/10 pb-1">
                    Provenance & Evidence:
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#8a7a65] font-bold block">Motifs Used:</span>
                    <div className="flex flex-wrap gap-1">
                      {seedforgeResult.keyMotifsUsed.map((m, i) => (
                        <span key={i} className="bg-white px-2 py-0.5 rounded border border-[#2b2117]/10 text-[10px] text-[#2b2117] font-serif">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#8a7a65] font-bold block">Attached Sources:</span>
                    <div className="space-y-1">
                      {seedforgeResult.provenanceSources.map((ps, i) => (
                        <div key={i} className="bg-white p-2 rounded border border-[#2b2117]/10 text-[11px] font-serif">
                          <span className="font-bold text-[#92400e]">#{ps.albumId}</span> {ps.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2b2117]/10 text-[10px] text-[#8a7a65]">
                    <div>Receipt Hash: <code className="text-[#2b2117]">{seedforgeResult.receipt.hash}</code></div>
                  </div>
                </div>
              </div>

              {/* Action Feedback Message */}
              {actionFeedback && (
                <div className="p-3 bg-[#f0fdf4] border border-[#5b8a72] rounded-xl font-mono text-xs text-[#166534] font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{actionFeedback}</span>
                </div>
              )}

              {/* Human Decision Gate Actions */}
              <div className="bg-[#fdf0d5] p-4 rounded-xl border border-[#92400e]/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between font-bold text-[#78350f]">
                  <span className="flex items-center gap-1.5 uppercase text-[11px]">
                    <Lock className="w-4 h-4 text-[#c2410c]" />
                    <span>Human Decision Gate</span>
                  </span>
                  <span className="text-[10px] text-[#8a7a65]">Required Human Action</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleHarvestToLedger(`Harvested: ${seedforgeResult.title}`, humanRevisionText, activeTensionText)}
                    disabled={isHarvesting}
                    className="py-3 px-4 rounded-xl bg-[#5b8a72] text-white font-bold hover:bg-[#2f4a3e] transition-all flex items-center justify-center gap-2 shadow-sm text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isHarvesting ? 'Witnessing...' : '🌾 Harvest to Witness Ledger'}</span>
                  </button>

                  <button
                    onClick={() => handlePreserveParallel(seedforgeResult.title, humanRevisionText, seedforgeResult.preserveTensionsReasoning, 'preserved_parallel')}
                    className="py-3 px-4 rounded-xl bg-[#2b2117] text-[#fde68a] font-bold hover:bg-[#92400e] hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm text-xs"
                  >
                    <GitBranch className="w-4 h-4 text-[#d4a017]" />
                    <span>🌿 Preserve Parallel Branch</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#92400e]/15 text-[11px]">
                  <button
                    onClick={() => handlePreserveParallel(seedforgeResult.title, humanRevisionText, 'Declined proposal by human witness', 'rejected')}
                    className="text-[#c2410c] hover:underline flex items-center gap-1 font-bold"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Proposal</span>
                  </button>

                  <button
                    onClick={handleInvokeAI}
                    className="text-[#2b2117] hover:underline flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-prompt SeedForge</span>
                  </button>
                </div>
              </div>
            </div>
          ) : refactorResult ? (
            <div className="rounded-2xl bg-white border-2 border-[#5b8a72] p-5 shadow-md space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#2b2117]/10 pb-2.5 font-bold text-[#2f4a3e]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5b8a72]" />
                  <span>reCURV Codebase Analysis & Refactor</span>
                </div>
              </div>

              <div className="bg-[#fdf8ef] p-3.5 rounded-xl border border-[#2b2117]/10 text-[#2b2117]">
                <strong>Analysis:</strong> {refactorResult.analysis}
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#8a7a65] text-[10px] uppercase block">Human Revised Code Output:</span>
                <textarea
                  value={humanRevisionText}
                  onChange={e => setHumanRevisionText(e.target.value)}
                  rows={10}
                  className="w-full bg-[#2b2117] text-[#fde68a] p-3.5 rounded-xl font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#5b8a72]"
                />
              </div>

              {refactorResult.repairScarNote && (
                <div className="bg-[#fffbeb] p-3 rounded-xl border border-[#d4a017]/40 text-[#78350f]">
                  <strong>Preserved Repair Scar:</strong> {refactorResult.repairScarNote}
                </div>
              )}

              {actionFeedback && (
                <div className="p-2.5 bg-[#f0fdf4] border border-[#5b8a72] rounded-xl text-[#166534] font-bold">
                  {actionFeedback}
                </div>
              )}

              <button
                onClick={() => handleHarvestToLedger('Refactored Code Commit', humanRevisionText, refactorResult.repairScarNote)}
                disabled={isHarvesting}
                className="w-full py-3 px-4 rounded-xl bg-[#5b8a72] text-white font-bold hover:bg-[#2f4a3e] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isHarvesting ? 'Harvesting...' : '🌾 Harvest Refactor to Ledger'}</span>
              </button>
            </div>
          ) : learningResult ? (
            <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-md space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#2b2117]/10 pb-2.5">
                <h3 className="font-serif text-lg font-bold text-[#2b2117]">{learningResult.pathTitle}</h3>
                <span className="text-[#8a7a65]">{learningResult.estimatedTotalDuration}</span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {learningResult.milestones.map(ms => (
                  <div key={ms.stepNumber} className="bg-[#fdf8ef] p-3 rounded-xl border border-[#2b2117]/10 space-y-1.5">
                    <div className="font-bold text-[#2b2117]">Step {ms.stepNumber}: {ms.title}</div>
                    <p className="text-[11px] text-[#6b5a46]">{ms.summary}</p>
                    <div className="bg-[#fffbeb] p-2 rounded border border-[#d4a017]/30 text-[#78350f] text-[11px]">
                      <strong>Task:</strong> {ms.practicalTask}
                    </div>
                  </div>
                ))}
              </div>

              {actionFeedback && (
                <div className="p-2.5 bg-[#f0fdf4] border border-[#5b8a72] rounded-xl text-[#166534] font-bold">
                  {actionFeedback}
                </div>
              )}

              <button
                onClick={() => handleHarvestToLedger(`Learning Path: ${learningResult.pathTitle}`, learningResult.targetGoal)}
                disabled={isHarvesting}
                className="w-full py-3 px-4 rounded-xl bg-[#2b2117] text-[#fde68a] font-bold hover:bg-[#92400e] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-[#d4a017]" />
                <span>{isHarvesting ? 'Harvesting...' : '🌾 Harvest Learning Path to Ledger'}</span>
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/70 border border-dashed border-[#2b2117]/15 p-12 text-center space-y-3 font-mono text-xs text-[#8a7a65]">
              <Sparkles className="w-8 h-8 text-[#d4a017]/50 mx-auto animate-pulse" />
              <p className="font-bold uppercase tracking-wider text-[#2b2117] text-sm">
                Awaiting Proposal Generation
              </p>
              <p className="max-w-xs mx-auto text-[#6b5a46] leading-relaxed">
                Pick your sources and target form on the left, then click <strong>Ask SeedForge for Bounded Proposal</strong>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preserved Parallels Drawer */}
      {showParallelsDrawer && (
        <div className="rounded-2xl bg-[#fffbeb] border border-[#d4a017]/40 p-5 shadow-md space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#d4a017]/30 pb-2.5 font-bold text-[#78350f]">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#d4a017]" />
              <span className="uppercase">Preserved Parallels & Repair Scars ({preservedList.length})</span>
            </div>
            <button
              onClick={() => setShowParallelsDrawer(false)}
              className="text-[#78350f] hover:underline"
            >
              ✕ Close
            </button>
          </div>

          {preservedList.length === 0 ? (
            <p className="text-[#8a7a65] italic">No parallel branches preserved yet. When you click "Preserve Parallel Branch", alternative proposals are recorded here instead of being discarded.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {preservedList.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-[#d4a017]/30 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[#92400e]">{item.title}</span>
                    <span className="bg-[#2b2117] text-[#fde68a] px-1.5 py-0.2 rounded text-[9px]">{item.actionTaken}</span>
                  </div>
                  <p className="font-serif text-[#2b2117] line-clamp-3 bg-[#fdf8ef] p-2 rounded">{item.content}</p>
                  <p className="text-[10px] text-[#78350f]"><strong>Scar Reason:</strong> {item.reasoning}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ledger Witness Stream Drawer */}
      {showLedgerDrawer && (
        <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-md space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#2b2117]/10 pb-2.5 font-bold text-[#2b2117]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5b8a72]" />
              <span className="uppercase">Immutable Witness Ledger Stream ({ledgerEvents.length} Events)</span>
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
                <div className="text-[9px] text-[#5b8a72] font-semibold truncate">Hash: {evt.currentHash.slice(0, 18)}...</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
