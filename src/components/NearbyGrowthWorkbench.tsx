/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ALBUMS } from '../data/autodiscographyData';
import { Album, NearbyGrowthResult, NearbyGrowthResponse, LineagePacket, NearbyGrowthLane } from '../types/jubileeTypes';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Info,
  GitFork,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

interface NearbyGrowthWorkbenchProps {
  seedAlbum: Album | null;
  onProceedToSeedForge: (packet: LineagePacket) => void;
  packetSources: Array<{
    artifactId: string;
    albumId: number;
    title: string;
    excerpt: string;
    lane: NearbyGrowthLane;
  }>;
  setPacketSources: React.Dispatch<
    React.SetStateAction<
      Array<{
        artifactId: string;
        albumId: number;
        title: string;
        excerpt: string;
        lane: NearbyGrowthLane;
      }>
    >
  >;
}

export const NearbyGrowthWorkbench: React.FC<NearbyGrowthWorkbenchProps> = ({
  seedAlbum,
  onProceedToSeedForge,
  packetSources,
  setPacketSources,
}) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<number>(seedAlbum ? seedAlbum.n : 26);
  const [searchText, setSearchText] = useState<string>('');
  const [activeTensionFilter, setActiveTensionFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nearbyResponse, setNearbyResponse] = useState<NearbyGrowthResponse | null>(null);
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);
  const [inspectAlbumModal, setInspectAlbumModal] = useState<Album | null>(null);

  // Sync selected album when seedAlbum prop changes
  useEffect(() => {
    if (seedAlbum) {
      setSelectedAlbumId(seedAlbum.n);
      fetchNearbyGrowth(seedAlbum.n);
    } else {
      fetchNearbyGrowth(26); // Default to The Pit
    }
  }, [seedAlbum]);

  const fetchNearbyGrowth = async (albumId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/nearby-growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seedAlbumId: albumId,
          searchText,
          activeTension: activeTensionFilter,
        }),
      });
      const data = await res.json();
      setNearbyResponse(data);
    } catch (err) {
      console.error('Failed to fetch nearby growth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSource = (result: NearbyGrowthResult) => {
    const exists = packetSources.some(s => s.artifactId === result.artifactId);
    if (!exists) {
      setPacketSources(prev => [
        ...prev,
        {
          artifactId: result.artifactId,
          albumId: result.albumId,
          title: result.albumTitle,
          excerpt: result.excerpt,
          lane: result.primaryLane,
        },
      ]);
    }
  };

  const handleRemoveSource = (artifactId: string) => {
    setPacketSources(prev => prev.filter(s => s.artifactId !== artifactId));
  };

  const handleIgnore = (artifactId: string) => {
    setIgnoredIds(prev => [...prev, artifactId]);
  };

  const handleBuildPacketAndProceed = () => {
    const packet: LineagePacket = {
      packetId: `pkt_${Date.now()}`,
      requestText: `Synthesize creative proposal derived from ${packetSources.length} selected sources`,
      snapshot: nearbyResponse?.snapshot,
      selectedSources: packetSources,
      activeTensions: [
        'Preserve organic human choice vs automated velocity',
        'Hold tension between kitchen table hospitality and raw noise',
      ],
      targetForm: 'new_lyric',
      constraints: {
        proposalOnly: true,
        preserveTensions: true,
        noDirectStateMutation: true,
      },
    };
    onProceedToSeedForge(packet);
  };

  const laneLabels: Record<NearbyGrowthLane, { label: string; badge: string; desc: string }> = {
    semantic: { label: 'Semantic', badge: 'bg-[#fff1e6] text-[#7c2d12] border-[#c2410c]/30', desc: 'Similar motifs & language' },
    lineage: { label: 'Lineage', badge: 'bg-[#fdf0d5] text-[#78350f] border-[#92400e]/30', desc: 'Parent / descendant structure' },
    active_tension: { label: 'Active Tension', badge: 'bg-[#fffbeb] text-[#713f12] border-[#ca8a04]/30', desc: 'Shared unresolved question' },
    human_link: { label: 'Human Link', badge: 'bg-[#e8f0e9] text-[#2f4a3e] border-[#5b8a72]/30', desc: 'Explicitly linked by user' },
    rejected_parallel: { label: 'Rejected Parallel', badge: 'bg-[#f3f4f6] text-[#374151] border-[#6b7280]/30', desc: 'Alternative path explored prior' },
  };

  const currentSeed = ALBUMS.find(a => a.n === selectedAlbumId) || ALBUMS[25];
  const activeResults = (nearbyResponse?.results || []).filter(r => !ignoredIds.includes(r.artifactId));

  return (
    <div className="space-y-8">
      {/* Topology Header */}
      <div className="rounded-2xl bg-white/90 border border-[#2b2117]/10 p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-[#8a7a65] uppercase">
              <Compass className="w-4 h-4 text-[#92400e]" />
              <span>Jubilee Garden Memory Topology</span>
              <span>•</span>
              <span className="text-[#5b8a72] font-semibold">5 Constitutional Lanes</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b2117]">
              Find Nearby Growth
            </h2>
            <p className="font-mono text-xs text-[#6b5a46] max-w-2xl">
              "Permission precedes retrieval." Surfaces 6 diversified connections across 5 independent lanes.
              Review graph-backed evidence with <code>SafeSourceRef</code> before adding to your SeedForge LineagePacket.
            </p>
          </div>

          {/* Seed Selector Dropdown */}
          <div className="bg-[#fdf8ef] p-3 rounded-xl border border-[#2b2117]/15 space-y-2 min-w-[280px]">
            <label className="font-mono text-[11px] text-[#8a7a65] uppercase font-semibold block">
              Focus Seed Album:
            </label>
            <select
              id="seed-album-select"
              value={selectedAlbumId}
              onChange={e => {
                const val = Number(e.target.value);
                setSelectedAlbumId(val);
                fetchNearbyGrowth(val);
              }}
              className="w-full bg-white border border-[#2b2117]/15 rounded-lg px-3 py-1.5 font-mono text-xs text-[#2b2117] focus:outline-none focus:ring-2 focus:ring-[#92400e]/30"
            >
              {ALBUMS.map(a => (
                <option key={a.n} value={a.n}>
                  #{String(a.n).padStart(2, '0')} — {a.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Seed Preview Box */}
        <div className="bg-[#fdf0d5]/60 p-4 rounded-xl border border-[#92400e]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#78350f] tracking-wider">
              Active Focus Seed:
            </span>
            <div className="font-serif font-bold text-base text-[#2b2117]">
              Album #{currentSeed.n}: {currentSeed.title}
            </div>
            <p className="font-serif italic text-xs text-[#3d2f20]">
              "{currentSeed.thesis}"
            </p>
          </div>

          <button
            id="re-run-growth-btn"
            onClick={() => fetchNearbyGrowth(selectedAlbumId)}
            disabled={isLoading}
            className="px-4 py-2 bg-[#2b2117] text-[#fdf8ef] rounded-lg font-mono text-xs font-semibold hover:bg-[#92400e] transition-all flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
          >
            <Compass className={`w-4 h-4 text-[#d4a017] ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Scanning Lanes...' : 'Re-run Topology Scan'}</span>
          </button>
        </div>
      </div>

      {/* LineagePacket Assembly Tray (If items added) */}
      {packetSources.length > 0 && (
        <div className="bg-[#fffbeb] border-2 border-[#d4a017]/40 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#78350f]">
              <Sparkles className="w-4 h-4 text-[#d4a017]" />
              <span>LineagePacket Assembly Tray ({packetSources.length} Sources Attached)</span>
            </div>
            <button
              onClick={handleBuildPacketAndProceed}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#2b2117] text-[#fde68a] font-mono text-xs font-bold hover:bg-[#92400e] transition-all shadow-sm"
            >
              <span>Proceed to SeedForge AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {packetSources.map(src => (
              <div
                key={src.artifactId}
                className="bg-white p-3 rounded-xl border border-[#d4a017]/30 flex items-start justify-between gap-2 shadow-2xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] bg-[#2b2117] text-white px-1.5 py-0.5 rounded font-bold">
                      #{src.albumId}
                    </span>
                    <span className="font-serif font-bold text-xs text-[#2b2117] truncate">
                      {src.title}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-[#6b5a46] line-clamp-2 italic">
                    "{src.excerpt}"
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveSource(src.artifactId)}
                  className="text-[#c2410c] hover:bg-[#c2410c]/10 p-1 rounded-md"
                  title="Remove from packet"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Grid Across 5 Lanes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-[#8a7a65]">
          <span className="uppercase font-semibold tracking-wider">
            Diversified Results Across 5 Lanes ({activeResults.length} Available)
          </span>
          {nearbyResponse?.snapshot && (
            <span>
              Snapshot Head: <code>{nearbyResponse.snapshot.ledgerHeadEventId}</code>
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="p-12 text-center font-mono text-xs text-[#8a7a65] space-y-3 bg-white/50 rounded-2xl border border-dashed border-[#2b2117]/15">
            <Compass className="w-8 h-8 text-[#d4a017] animate-spin mx-auto" />
            <p>Traversing memory topology across semantic, lineage, tension, and human link lanes...</p>
          </div>
        ) : activeResults.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-[#8a7a65] bg-white/50 rounded-2xl border border-[#2b2117]/10">
            No active candidates. Try selecting another seed album above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeResults.map(res => {
              const laneInfo = laneLabels[res.primaryLane];
              const isAttached = packetSources.some(s => s.artifactId === res.artifactId);

              return (
                <div
                  key={res.artifactId}
                  className={`rounded-2xl bg-white border p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all ${
                    isAttached
                      ? 'border-[#d4a017] ring-2 ring-[#d4a017]/30 bg-[#fffbeb]/30'
                      : 'border-[#2b2117]/10 hover:border-[#2b2117]/25'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-[#2b2117] text-white px-2 py-0.5 rounded-md">
                          Album #{res.albumId}
                        </span>
                        <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${laneInfo.badge}`}>
                          Lane: {laneInfo.label}
                        </span>
                        {res.relationType && (
                          <span className="font-mono text-[9px] uppercase font-bold bg-[#fffbeb] text-[#78350f] border border-[#d4a017]/40 px-2 py-0.5 rounded-full">
                            {res.relationType} relation
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        {res.evidenceStrength && (
                          <span className="text-[#92400e] bg-[#fdf0d5] px-2 py-0.5 rounded-full font-bold">
                            {Math.round(res.evidenceStrength * 100)}% Match
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[#5b8a72] bg-[#e8f0e9] px-2 py-0.5 rounded-full font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          {res.dependencyStatus}
                        </span>
                      </div>
                    </div>

                    {/* Tension Delta Indicator */}
                    {res.tensionDelta && (
                      <div className="font-mono text-[10px] text-[#78350f] bg-[#fffbeb] px-2.5 py-1 rounded-lg border border-[#d4a017]/30 flex items-center justify-between">
                        <span>Creative Tension Delta: <strong>{res.tensionDelta}</strong></span>
                        <span className="text-[#8a7a65]">SafeSourceRef: Available</span>
                      </div>
                    )}

                    {/* Album Title & Excerpt */}
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#2b2117]">
                        {res.albumTitle}
                      </h3>
                      <p className="font-sans text-xs text-[#3d2f20] leading-relaxed mt-1 bg-[#fdf8ef] p-3 rounded-xl border border-[#2b2117]/10 italic">
                        "{res.excerpt}"
                      </p>
                    </div>

                    {/* Graph Evidence Breakdown */}
                    {res.evidence && res.evidence.length > 0 && (
                      <div className="space-y-1 bg-white/80 p-3 rounded-xl border border-[#2b2117]/10">
                        <span className="font-mono text-[10px] text-[#8a7a65] uppercase font-semibold block">
                          Graph Provenance Evidence:
                        </span>
                        {res.evidence.map((ev, idx) => (
                          <div key={idx} className="font-mono text-[11px] text-[#6b5a46] flex items-start gap-1.5">
                            <Info className="w-3.5 h-3.5 text-[#92400e] shrink-0 mt-0.5" />
                            <span>{ev.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-dashed border-[#2b2117]/10 flex items-center justify-between gap-2 font-mono text-xs">
                    <button
                      onClick={() => {
                        const targetAlbum = ALBUMS.find(a => a.n === res.albumId);
                        if (targetAlbum) setInspectAlbumModal(targetAlbum);
                      }}
                      className="text-[#6b5a46] hover:text-[#2b2117] flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Source</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleIgnore(res.artifactId)}
                        className="px-2.5 py-1 rounded-lg text-[#8a7a65] hover:bg-[#2b2117]/5"
                      >
                        Ignore
                      </button>

                      {isAttached ? (
                        <button
                          onClick={() => handleRemoveSource(res.artifactId)}
                          className="px-3 py-1.5 rounded-lg bg-[#c2410c] text-white font-semibold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Attached</span>
                        </button>
                      ) : (
                        <button
                          id={`add-source-btn-${res.albumId}`}
                          onClick={() => handleSelectSource(res)}
                          className="px-3 py-1.5 rounded-lg bg-[#2b2117] text-[#fdf8ef] font-semibold hover:bg-[#92400e] transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#d4a017]" />
                          <span>Add to Packet</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inspect Lore Modal */}
      {inspectAlbumModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fdf8ef] border border-[#2b2117]/20 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="font-serif text-xl font-bold text-[#2b2117]">
              Album #{inspectAlbumModal.n}: {inspectAlbumModal.title}
            </h3>
            <p className="font-serif italic text-xs text-[#78350f] bg-[#fdf0d5]/60 p-3 rounded-xl border border-[#92400e]/20">
              "{inspectAlbumModal.thesis}"
            </p>
            <p className="font-sans text-xs text-[#3d2f20] leading-relaxed bg-white p-3 rounded-xl border border-[#2b2117]/10">
              {inspectAlbumModal.fullLore || 'No extended lore notes attached.'}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setInspectAlbumModal(null)}
                className="px-4 py-1.5 bg-[#2b2117] text-white rounded-lg font-mono text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
