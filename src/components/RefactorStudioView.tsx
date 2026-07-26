/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Code2,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  GitCommit,
  HelpCircle,
  ArrowRight,
  Layers
} from 'lucide-react';

interface RefactorResult {
  analysis: string;
  suggestedCode: string;
  improvements: string[];
  reasoning: string;
  repairScarNote: string;
}

interface RefactorStudioViewProps {
  onHarvestSuccess: (receipt: any) => void;
}

export const RefactorStudioView: React.FC<RefactorStudioViewProps> = ({ onHarvestSuccess }) => {
  const [codeSnippet, setCodeSnippet] = useState<string>(
`// Sample code snippet to analyze & refactor
interface EventData {
  id: any;
  title: string;
  data: any;
}

export function handleEventMutation(evt: EventData) {
  if (evt.id) {
    // Direct state mutation without hash chain verification
    window.localStorage.setItem("last_event", JSON.stringify(evt));
    console.log("Mutated event: " + evt.title);
  }
}`
  );

  const [language, setLanguage] = useState<string>('typescript');
  const [goals, setGoals] = useState<string>(
    'Enforce immutable state pattern, replace `any` types with explicit generics, and integrate SHA-256 hash receipts.'
  );
  const [preserveScar, setPreserveScar] = useState<boolean>(true);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<RefactorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);
  const [harvestMsg, setHarvestMsg] = useState<string | null>(null);

  const handleAnalyzeAndRefactor = async () => {
    if (!codeSnippet.trim()) {
      setError('Please provide code or text to analyze.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setHarvestMsg(null);

    try {
      const res = await fetch('/api/refactor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeSnippet,
          language,
          goals,
          preserveScar,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Refactoring failed');
      }

      const data: RefactorResult = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Refactor error:', err);
      setError(err.message || 'Error executing refactor analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyCode = () => {
    if (!result?.suggestedCode) return;
    navigator.clipboard.writeText(result.suggestedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHarvestRefactor = async () => {
    if (!result) return;
    setIsHarvesting(true);
    setHarvestMsg(null);

    try {
      const res = await fetch('/api/jubilee/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: `reCURV Refactor: ${goals.slice(0, 40)}`,
          content: result.suggestedCode,
          era: 'canon',
          tensionResolved: result.repairScarNote,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setHarvestMsg(`Successfully harvested refactor to Jubilee Event Ledger! (Hash: ${data.receipt.currentHash})`);
        onHarvestSuccess(data.receipt);
      } else {
        throw new Error(data.error || 'Harvest failed');
      }
    } catch (err: any) {
      console.error('Harvest refactor error:', err);
      setHarvestMsg(`Harvest failed: ${err.message}`);
    } finally {
      setIsHarvesting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-white/90 border border-[#2b2117]/10 p-6 md:p-8 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-[#92400e] uppercase font-bold tracking-wider">
              <Code2 className="w-4 h-4 text-[#92400e]" />
              <span>reCURV Node • Codebase Refactoring & Analysis Engine</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b2117]">
              AI Refactoring & Repair Studio
            </h2>
            <p className="font-mono text-xs text-[#6b5a46] max-w-2xl leading-relaxed">
              Analyzes codebases, lyrics, or structural schemas to identify maintainability smells, suggest precise refactoring,
              and preserve historical context as <i>Repair Scars</i>.
            </p>
          </div>

          <div className="bg-[#fdf8ef] p-3 rounded-xl border border-[#2b2117]/15 font-mono text-xs text-[#78350f] shrink-0">
            <div className="font-bold flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" />
              <span>Quality & Maintainability</span>
            </div>
            <p className="text-[11px] text-[#6b5a46]">Powered by Gemini 3.6 Flash</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form vs Refactor Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Code Input & Parameters (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-6 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#2b2117] flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#92400e]" />
              <span>Code / Artifact Input</span>
            </h3>

            {/* Language / Format Selector */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="text-[#8a7a65] font-semibold uppercase block mb-1">
                  Format / Language:
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full bg-[#fdf8ef] border border-[#2b2117]/15 rounded-lg p-2.5 text-[#2b2117] focus:outline-none"
                >
                  <option value="typescript">TypeScript / React</option>
                  <option value="javascript">JavaScript / Node</option>
                  <option value="python">Python</option>
                  <option value="sql">SQL / Database Schema</option>
                  <option value="lyric_liturgy">Folk Lyric / Liturgy</option>
                </select>
              </div>

              <div>
                <label className="text-[#8a7a65] font-semibold uppercase block mb-1">
                  Repair Scar Preservation:
                </label>
                <button
                  type="button"
                  onClick={() => setPreserveScar(!preserveScar)}
                  className={`w-full p-2.5 rounded-lg border text-center font-bold transition-all ${
                    preserveScar
                      ? 'bg-[#2b2117] text-[#fde68a] border-[#2b2117]'
                      : 'bg-white text-[#6b5a46] border-[#2b2117]/15'
                  }`}
                >
                  {preserveScar ? '✓ Preserve Scars' : 'Erase Context'}
                </button>
              </div>
            </div>

            {/* Refactoring Goals */}
            <div className="space-y-1 font-mono text-xs">
              <label className="text-[#8a7a65] font-semibold uppercase block">
                Refactoring Objectives & Goals:
              </label>
              <input
                type="text"
                value={goals}
                onChange={e => setGoals(e.target.value)}
                placeholder="e.g. Enhance type safety, extract helpers, improve performance..."
                className="w-full bg-[#fdf8ef] border border-[#2b2117]/15 rounded-lg p-2.5 text-[#2b2117] focus:outline-none"
              />
            </div>

            {/* Snippet Textarea */}
            <div className="space-y-1 font-mono text-xs">
              <label className="text-[#8a7a65] font-semibold uppercase block">
                Target Code / Snippet:
              </label>
              <textarea
                value={codeSnippet}
                onChange={e => setCodeSnippet(e.target.value)}
                rows={10}
                className="w-full bg-[#2b2117] text-[#fde68a] font-mono text-xs p-4 rounded-xl border border-[#2b2117]/20 focus:outline-none focus:ring-2 focus:ring-[#d4a017]/40 leading-relaxed font-mono"
              />
            </div>

            {error && (
              <div className="p-3 bg-[#fff1e6] border border-[#c2410c]/30 rounded-xl font-mono text-xs text-[#7c2d12] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="invoke-refactor-btn"
              onClick={handleAnalyzeAndRefactor}
              disabled={isAnalyzing}
              className={`w-full py-3.5 px-6 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                isAnalyzing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2b2117] text-[#fde68a] hover:bg-[#92400e] hover:text-white'
              }`}
            >
              <Sparkles className={`w-4 h-4 text-[#d4a017] ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>
                {isAnalyzing
                  ? 'Analyzing & Refactoring with Gemini AI...'
                  : 'Analyze & Refactor Codebase'}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Refactoring Analysis Results (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="rounded-2xl bg-white border-2 border-[#5b8a72] p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-[#2b2117]/10 pb-3 font-mono text-xs font-bold text-[#2f4a3e]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5b8a72]" />
                  <span>reCURV Refactoring Analysis Output</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 bg-[#2b2117] text-[#fde68a] rounded-lg text-[11px] flex items-center gap-1 hover:bg-[#92400e]"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Analysis Executive Summary */}
              <div className="space-y-1.5">
                <span className="font-mono text-xs uppercase font-bold text-[#8a7a65]">
                  Codebase Analysis Summary:
                </span>
                <p className="font-sans text-xs text-[#2b2117] bg-[#fdf8ef] p-3.5 rounded-xl border border-[#2b2117]/10 leading-relaxed">
                  {result.analysis}
                </p>
              </div>

              {/* Refactored Code Output */}
              <div className="space-y-1.5">
                <span className="font-mono text-xs uppercase font-bold text-[#8a7a65]">
                  Suggested Refactored Code:
                </span>
                <pre className="bg-[#2b2117] text-[#fde68a] p-4 rounded-xl border border-[#2b2117]/20 font-mono text-xs overflow-x-auto max-h-64 leading-relaxed">
                  <code>{result.suggestedCode}</code>
                </pre>
              </div>

              {/* Key Improvements */}
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase font-bold text-[#2f4a3e]">
                  Key Improvements & Quality Gains:
                </span>
                <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
                  {result.improvements.map((imp, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-[#e8f0e9] p-2.5 rounded-lg text-[#2f4a3e]">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#5b8a72] mt-0.5" />
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reasoning */}
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase font-bold text-[#8a7a65]">
                  Architectural Reasoning:
                </span>
                <p className="font-mono text-xs text-[#6b5a46] italic">
                  "{result.reasoning}"
                </p>
              </div>

              {/* Repair Scar Note */}
              {result.repairScarNote && (
                <div className="bg-[#fffbeb] p-3.5 rounded-xl border border-[#d4a017]/40 space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#78350f] block">
                    Preserved Repair Scar Note:
                  </span>
                  <p className="font-mono text-xs text-[#78350f]">
                    {result.repairScarNote}
                  </p>
                </div>
              )}

              {/* Harvest Action Gate */}
              <div className="bg-[#fdf8ef] p-4 rounded-xl border border-[#2b2117]/15 space-y-3 pt-4">
                <div className="font-mono text-xs font-bold text-[#2b2117] flex items-center gap-1.5 uppercase">
                  <GitCommit className="w-4 h-4 text-[#5b8a72]" />
                  <span>Jubilee Witness Ledger Harvest</span>
                </div>
                <p className="font-mono text-[11px] text-[#6b5a46]">
                  Record this refactoring receipt into the append-only event chain to maintain immutable provenance.
                </p>

                {harvestMsg && (
                  <div className="p-2.5 bg-white border border-[#5b8a72] rounded-lg font-mono text-xs text-[#2f4a3e] font-semibold">
                    {harvestMsg}
                  </div>
                )}

                <button
                  id="harvest-refactor-btn"
                  onClick={handleHarvestRefactor}
                  disabled={isHarvesting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#5b8a72] text-white font-mono text-xs font-bold hover:bg-[#2f4a3e] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isHarvesting ? 'Harvesting Refactor...' : '🌾 Harvest Refactor to Event Ledger'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/70 border border-dashed border-[#2b2117]/15 p-12 text-center space-y-3 font-mono text-xs text-[#8a7a65]">
              <Wrench className="w-10 h-10 text-[#8a7a65]/40 mx-auto" />
              <p className="font-bold uppercase tracking-wider text-[#2b2117]">
                Ready for Refactoring Analysis
              </p>
              <p className="max-w-xs mx-auto text-[#6b5a46]">
                Enter target code or lyric text on the left, specify your objectives, and click <strong>Analyze & Refactor Codebase</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
