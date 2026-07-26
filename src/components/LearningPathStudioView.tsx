/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  GraduationCap,
  CheckCircle2,
  BookOpen,
  Code2,
  Clock,
  Sparkles,
  ArrowRight,
  ListTodo,
  FileText,
  HelpCircle,
  Award,
  Layers,
  AlertCircle
} from 'lucide-react';

interface SuggestedResource {
  title: string;
  type: string;
  description: string;
}

interface Milestone {
  stepNumber: number;
  title: string;
  summary: string;
  keyConcepts: string[];
  suggestedResources: SuggestedResource[];
  practicalTask: string;
}

interface LearningPath {
  pathTitle: string;
  targetGoal: string;
  estimatedTotalDuration: string;
  milestones: Milestone[];
}

interface LearningPathStudioViewProps {
  onHarvestSuccess: (receipt: any) => void;
}

export const LearningPathStudioView: React.FC<LearningPathStudioViewProps> = ({ onHarvestSuccess }) => {
  const [userGoal, setUserGoal] = useState<string>(
    'Master Open E guitar tuning composition, kitchen table hospitality lore, and immutable SHA-256 event chains.'
  );
  const [currentLevel, setCurrentLevel] = useState<string>('apprentice');
  const [interests, setInterests] = useState<string>(
    'TypeScript, Folk Math-Rock, Open E tuning, Event Hash Chains, Paper Plates, Bounded AI Scope'
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [learningPath, setLearningPath] = useState<LearningPath | null>({
    pathTitle: 'From Porch Light Litany to Immutable Software Synthesis',
    targetGoal: 'Master event-driven state architecture and folk-rock thematic composition.',
    estimatedTotalDuration: '2 Weeks (~12 Hours)',
    milestones: [
      {
        stepNumber: 1,
        title: 'Foundations of the 26-Album Canon & Open E Tuning',
        summary: 'Understand the core motifs of kitchen table hospitality, 42 lemons, and analog tape warmth.',
        keyConcepts: ['Open E Guitar Tuning', 'Kitchen Table Hospitality', 'Lore Substrate'],
        suggestedResources: [
          { title: 'Album #26: The Pit (Canon Core)', type: 'album', description: 'Listen to the thesis tracks and porch litany.' },
          { title: 'Guide: Open E Resonances', type: 'article', description: 'Understanding open string drones in folk compositions.' }
        ],
        practicalTask: 'Compose a 2-line lyric grounded in a kitchen table motif.'
      },
      {
        stepNumber: 2,
        title: 'SHA-256 Hash Chains & Bounded AI Proposals',
        summary: 'Learn why AI models propose while human harvest records immutable ledger receipts.',
        keyConcepts: ['SHA-256 Hash Chain', 'Bounded AI Scope', 'Human Harvest Gate'],
        suggestedResources: [
          { title: 'Jubilee Witness Ledger Specification', type: 'article', description: 'Understanding non-mutating AI proposals.' },
          { title: 'Build an Append-Only Chain', type: 'code_challenge', description: 'Implement a simple hash calculation function in TypeScript.' }
        ],
        practicalTask: 'Harvest your first creative proposal into the Jubilee Event Ledger.'
      }
    ]
  });

  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);
  const [harvestMsg, setHarvestMsg] = useState<string | null>(null);

  const handleGeneratePath = async () => {
    if (!userGoal.trim()) {
      setError('Please specify your learning goals.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setHarvestMsg(null);

    try {
      const res = await fetch('/api/learning-path/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userGoal,
          currentLevel,
          interests,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate learning path');
      }

      const data: LearningPath = await res.json();
      setLearningPath(data);
      setCompletedSteps({});
    } catch (err: any) {
      console.error('Learning path error:', err);
      setError(err.message || 'Error generating personalized learning path.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleStepCompleted = (stepNumber: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const totalMilestones = learningPath?.milestones.length || 0;
  const progressPercent = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

  const handleHarvestProgress = async () => {
    if (!learningPath) return;
    setIsHarvesting(true);
    setHarvestMsg(null);

    try {
      const res = await fetch('/api/jubilee/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: `Milestone Harvest: ${learningPath.pathTitle} (${completedCount}/${totalMilestones} steps)`,
          content: `Completed milestones in path "${learningPath.pathTitle}":\nGoal: ${learningPath.targetGoal}\nProgress: ${progressPercent}%`,
          era: 'canon',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setHarvestMsg(`Successfully harvested learning milestone to Jubilee Event Ledger! (Hash: ${data.receipt.currentHash})`);
        onHarvestSuccess(data.receipt);
      } else {
        throw new Error(data.error || 'Harvest failed');
      }
    } catch (err: any) {
      console.error('Harvest progress error:', err);
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
              <Compass className="w-4 h-4 text-[#92400e]" />
              <span>LampPost Node • Personalized Learning Path Generator</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b2117]">
              Curated Concept & Skill Progression
            </h2>
            <p className="font-mono text-xs text-[#6b5a46] max-w-2xl leading-relaxed">
              Identifies key concepts, curates tutorials, articles, albums, and coding challenges into a logical progression
              tailored to your stated goals and knowledge level.
            </p>
          </div>

          <div className="bg-[#fdf8ef] p-3 rounded-xl border border-[#2b2117]/15 font-mono text-xs text-[#78350f] shrink-0">
            <div className="font-bold flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Tailored Progression</span>
            </div>
            <p className="text-[11px] text-[#6b5a46]">Level: {currentLevel.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Goal Controls vs Generated Learning Path */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-6 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#2b2117] flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-[#92400e]" />
              <span>Goal & Knowledge Profile</span>
            </h3>

            {/* User Goal */}
            <div className="space-y-1 font-mono text-xs">
              <label className="text-[#8a7a65] font-semibold uppercase block">
                Your Primary Objective / Goal:
              </label>
              <textarea
                value={userGoal}
                onChange={e => setUserGoal(e.target.value)}
                rows={3}
                placeholder="What concept, skill, or composition technique do you want to master?"
                className="w-full bg-[#fdf8ef] border border-[#2b2117]/15 rounded-xl p-3 text-[#2b2117] focus:outline-none"
              />
            </div>

            {/* Current Level */}
            <div className="space-y-1 font-mono text-xs">
              <label className="text-[#8a7a65] font-semibold uppercase block">
                Current Knowledge Level:
              </label>
              <select
                value={currentLevel}
                onChange={e => setCurrentLevel(e.target.value)}
                className="w-full bg-[#fdf8ef] border border-[#2b2117]/15 rounded-lg p-2.5 text-[#2b2117] focus:outline-none font-mono"
              >
                <option value="beginner">Newcomer (First Time in Jubilee)</option>
                <option value="apprentice">Apprentice (Familiar with Core Motifs)</option>
                <option value="canon_creator">Canon Creator (Advanced Systems & Composition)</option>
              </select>
            </div>

            {/* Interest Topics */}
            <div className="space-y-1 font-mono text-xs">
              <label className="text-[#8a7a65] font-semibold uppercase block">
                Focus Topics & Motifs:
              </label>
              <input
                type="text"
                value={interests}
                onChange={e => setInterests(e.target.value)}
                placeholder="e.g. TypeScript, Hash Chains, Open E, Kitchen Table"
                className="w-full bg-[#fdf8ef] border border-[#2b2117]/15 rounded-lg p-2.5 text-[#2b2117] focus:outline-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-[#fff1e6] border border-[#c2410c]/30 rounded-xl font-mono text-xs text-[#7c2d12] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="generate-learning-path-btn"
              onClick={handleGeneratePath}
              disabled={isGenerating}
              className={`w-full py-3.5 px-6 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2b2117] text-[#fde68a] hover:bg-[#92400e] hover:text-white'
              }`}
            >
              <Sparkles className={`w-4 h-4 text-[#d4a017] ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating
                  ? 'Synthesizing Personalized Learning Path...'
                  : 'Generate Tailored Learning Path'}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Path & Milestones (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {learningPath ? (
            <div className="space-y-6">
              {/* Path Overview Card */}
              <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2b2117]/10 pb-3">
                  <h3 className="font-serif text-xl font-bold text-[#2b2117]">
                    {learningPath.pathTitle}
                  </h3>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-[#8a7a65] shrink-0 bg-[#fdf8ef] px-2.5 py-1 rounded-lg border border-[#2b2117]/10">
                    <Clock className="w-3.5 h-3.5 text-[#92400e]" />
                    <span>Est: {learningPath.estimatedTotalDuration}</span>
                  </div>
                </div>

                <p className="font-mono text-xs text-[#6b5a46]">
                  <strong>Goal Target:</strong> {learningPath.targetGoal}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-[#2b2117]">
                    <span>Path Mastery Progress ({completedCount}/{totalMilestones} Steps)</span>
                    <span className="text-[#5b8a72]">{progressPercent}% Completed</span>
                  </div>
                  <div className="w-full bg-[#fdf8ef] h-2.5 rounded-full border border-[#2b2117]/10 overflow-hidden">
                    <div
                      className="bg-[#5b8a72] h-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-4">
                {learningPath.milestones.map(ms => {
                  const isDone = !!completedSteps[ms.stepNumber];

                  return (
                    <div
                      key={ms.stepNumber}
                      className={`rounded-2xl border transition-all p-5 shadow-2xs space-y-4 ${
                        isDone
                          ? 'bg-[#e8f0e9]/50 border-[#5b8a72]/40'
                          : 'bg-white border-[#2b2117]/10 hover:border-[#2b2117]/30'
                      }`}
                    >
                      {/* Milestone Header */}
                      <div className="flex items-start justify-between gap-3 border-b border-[#2b2117]/10 pb-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleStepCompleted(ms.stepNumber)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                              isDone
                                ? 'bg-[#5b8a72] text-white'
                                : 'bg-[#fdf8ef] text-[#2b2117] border border-[#2b2117]/20 hover:border-[#2b2117]'
                            }`}
                          >
                            {isDone ? '✓' : ms.stepNumber}
                          </button>
                          <div>
                            <h4 className={`font-serif text-base font-bold ${isDone ? 'line-through text-[#5b8a72]' : 'text-[#2b2117]'}`}>
                              Step {ms.stepNumber}: {ms.title}
                            </h4>
                            <p className="font-mono text-xs text-[#6b5a46]">
                              {ms.summary}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleStepCompleted(ms.stepNumber)}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all shrink-0 ${
                            isDone
                              ? 'bg-[#5b8a72] text-white'
                              : 'bg-[#2b2117]/5 text-[#6b5a46] hover:bg-[#2b2117]/10'
                          }`}
                        >
                          {isDone ? 'Completed' : 'Mark Done'}
                        </button>
                      </div>

                      {/* Key Concept Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                        <span className="text-[#8a7a65] font-semibold uppercase">Concepts:</span>
                        {ms.keyConcepts.map((kc, idx) => (
                          <span
                            key={idx}
                            className="bg-[#2b2117]/5 text-[#2b2117] px-2 py-0.5 rounded-full font-medium"
                          >
                            {kc}
                          </span>
                        ))}
                      </div>

                      {/* Suggested Resources */}
                      <div className="space-y-2 pt-1">
                        <span className="font-mono text-[11px] uppercase font-bold text-[#8a7a65] block">
                          Curated Learning Resources:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                          {ms.suggestedResources.map((res, rIdx) => (
                            <div
                              key={rIdx}
                              className="bg-[#fdf8ef] p-3 rounded-xl border border-[#2b2117]/10 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#2b2117]">{res.title}</span>
                                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#92400e]/10 text-[#78350f] font-bold">
                                  {res.type}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6b5a46] line-clamp-2">
                                {res.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Practical Verification Task */}
                      <div className="bg-[#fffbeb] p-3.5 rounded-xl border border-[#d4a017]/30 space-y-1 font-mono text-xs">
                        <span className="text-[10px] uppercase font-bold text-[#78350f] flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-[#d4a017]" />
                          <span>Practical Task / Mastery Verification:</span>
                        </span>
                        <p className="text-[#78350f] font-medium">
                          {ms.practicalTask}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Harvest Milestone Receipt */}
              <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-sm space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2b2117] uppercase">Record Learning Milestone to Jubilee</span>
                  <span className="text-[#5b8a72] font-bold">{progressPercent}% Progress</span>
                </div>

                {harvestMsg && (
                  <div className="p-2.5 bg-[#e8f0e9] border border-[#5b8a72] rounded-lg text-[#2f4a3e] font-semibold">
                    {harvestMsg}
                  </div>
                )}

                <button
                  id="harvest-learning-milestone-btn"
                  onClick={handleHarvestProgress}
                  disabled={isHarvesting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2b2117] text-[#fde68a] font-bold hover:bg-[#92400e] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#d4a017]" />
                  <span>{isHarvesting ? 'Harvesting Milestone...' : '🌾 Harvest Learning Achievement to Event Ledger'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/70 border border-dashed border-[#2b2117]/15 p-12 text-center space-y-3 font-mono text-xs text-[#8a7a65]">
              <Compass className="w-10 h-10 text-[#8a7a65]/40 mx-auto" />
              <p className="font-bold uppercase tracking-wider text-[#2b2117]">
                Ready to Generate Personalized Path
              </p>
              <p className="max-w-xs mx-auto text-[#6b5a46]">
                Set your primary goal and knowledge profile on the left and click <strong>Generate Tailored Learning Path</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
