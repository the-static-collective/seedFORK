/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ALBUMS, ERAS, NEWCOMER_LISTENING_PATH } from '../data/autodiscographyData';
import { Album, EraKey } from '../types/jubileeTypes';
import { ArrowRight, Compass, Disc, HelpCircle, Layers, Music, Sparkles, X } from 'lucide-react';

interface AlbumExplorerProps {
  onSeedNearbyGrowth: (album: Album) => void;
}

export const AlbumExplorer: React.FC<AlbumExplorerProps> = ({ onSeedNearbyGrowth }) => {
  const [selectedEra, setSelectedEra] = useState<EraKey | 'all'>('all');
  const [searchQuery, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'chronological' | 'newcomer'>('chronological');
  const [inspectAlbum, setInspectAlbum] = useState<Album | null>(null);

  // Filter logic
  const filteredAlbums = ALBUMS.filter(album => {
    const matchesEra = selectedEra === 'all' || album.era === selectedEra;
    const matchesSearch =
      searchQuery === '' ||
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.keys.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      album.thesis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEra && matchesSearch;
  });

  const displayAlbums =
    viewMode === 'newcomer'
      ? NEWCOMER_LISTENING_PATH.map(n => ALBUMS.find(a => a.n === n)!).filter(a =>
          filteredAlbums.some(fa => fa.n === a.n)
        )
      : filteredAlbums;

  return (
    <div className="space-y-8">
      {/* Hero Banner Header */}
      <div className="rounded-2xl bg-white/80 border border-[#2b2117]/10 p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#8a7a65] uppercase tracking-wider">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#2b2117]">
              <Disc className="w-4 h-4 text-[#c2410c]" />
              26 Albums • The Autodiscography
            </span>
            <span>/</span>
            <span>Creep Mode Universe</span>
            <span>/</span>
            <span className="text-[#92400e]">Field Notes Archive</span>
          </div>

          <h2 className="font-serif text-2xl md:text-4xl text-[#2b2117] font-bold tracking-tight leading-tight">
            Mapped in creation order with a listening path for newcomers.
          </h2>

          <p className="font-mono text-xs sm:text-sm text-[#6b5a46] leading-relaxed">
            Every album in the 26-node universe carries a distinct thesis, key motifs, and unresolved creative tensions.
            Select any album to open its lore or seed the <strong>Nearby Growth</strong> topology.
          </p>

          {/* Quick Era Badges */}
          <div className="pt-2 flex flex-wrap gap-2">
            {Object.entries(ERAS).map(([key, era]) => (
              <button
                key={key}
                onClick={() => setSelectedEra(selectedEra === key ? 'all' : (key as EraKey))}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] border transition-all ${
                  selectedEra === key
                    ? 'bg-[#2b2117] text-white border-[#2b2117]'
                    : 'bg-white/80 text-[#6b5a46] border-[#2b2117]/10 hover:border-[#2b2117]/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${era.dot}`} />
                <span>{era.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control Bar: Search & View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/50 p-3 rounded-xl border border-[#2b2117]/10">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <input
            id="search-albums-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Search albums, motifs (e.g. 'Porch Light', 'Lemons', 'Table')..."
            className="w-full bg-white border border-[#2b2117]/15 rounded-lg px-3 py-1.5 font-mono text-xs text-[#2b2117] focus:outline-none focus:ring-2 focus:ring-[#92400e]/30 placeholder:text-[#8a7a65]/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchText('')}
              className="font-mono text-xs text-[#8a7a65] hover:text-[#2b2117]"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#8a7a65]">Order:</span>
          <button
            onClick={() => setViewMode('chronological')}
            className={`px-3 py-1 rounded-md border transition-all ${
              viewMode === 'chronological'
                ? 'bg-[#2b2117] text-white border-[#2b2117]'
                : 'bg-white text-[#6b5a46] border-[#2b2117]/10 hover:border-[#2b2117]/30'
            }`}
          >
            Chronological (1 → 26)
          </button>
          <button
            onClick={() => setViewMode('newcomer')}
            className={`px-3 py-1 rounded-md border transition-all ${
              viewMode === 'newcomer'
                ? 'bg-[#d4a017] text-[#2b2117] border-[#d4a017] font-semibold'
                : 'bg-white text-[#6b5a46] border-[#2b2117]/10 hover:border-[#2b2117]/30'
            }`}
          >
            Newcomer Path (Start @ 26)
          </button>
        </div>
      </div>

      {/* Grid of Albums */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayAlbums.map(album => {
          const eraInfo = ERAS[album.era];
          const isCanon = album.era === 'canon';

          return (
            <div
              key={album.n}
              className={`group relative rounded-xl bg-white border border-[#2b2117]/10 p-5 shadow-sm transition-all hover:shadow-md hover:border-[#2b2117]/25 flex flex-col justify-between ${
                eraInfo.border
              } border-l-[4px] ${isCanon ? 'ring-2 ring-[#d4a017]/40 bg-[#fffbeb]/50' : ''}`}
            >
              <div className="space-y-3">
                {/* Number, Title & Era Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${eraInfo.bg} ${eraInfo.text} border border-[#2b2117]/10`}
                    >
                      {String(album.n).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2b2117]/5 text-[#6b5a46]">
                      {typeof album.trackCount === 'number' ? `${album.trackCount} tracks` : album.trackCount}
                    </span>
                  </div>

                  <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full text-white font-medium ${eraInfo.dot}`}>
                    {eraInfo.label.split('—')[0]}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#2b2117] leading-snug group-hover:text-[#92400e] transition-colors">
                  {album.title}
                </h3>

                {/* Key Motifs */}
                <div className="flex flex-wrap gap-1">
                  {album.keys.map(k => (
                    <span
                      key={k}
                      className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#fdf8ef] border border-[#2b2117]/10 text-[#6b5a46]"
                    >
                      {k}
                    </span>
                  ))}
                </div>

                {/* Thesis */}
                <p className="font-serif text-xs text-[#3d2f20] italic leading-relaxed line-clamp-2">
                  "{album.thesis}"
                </p>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 pt-3 border-t border-dashed border-[#2b2117]/10 flex items-center justify-between gap-2 font-mono text-xs">
                <button
                  id={`inspect-album-${album.n}`}
                  onClick={() => setInspectAlbum(album)}
                  className="text-[#6b5a46] hover:text-[#2b2117] font-medium flex items-center gap-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Inspect Lore</span>
                </button>

                <button
                  id={`seed-growth-album-${album.n}`}
                  onClick={() => onSeedNearbyGrowth(album)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2b2117]/5 hover:bg-[#2b2117] hover:text-[#fdf8ef] text-[#92400e] font-medium transition-all"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Nearby Growth</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Album Detail Modal / Lore Drawer */}
      {inspectAlbum && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fdf8ef] border border-[#2b2117]/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setInspectAlbum(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-[#2b2117]/5 hover:bg-[#2b2117]/10 text-[#2b2117]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="w-6 h-6 rounded-full bg-[#2b2117] text-white flex items-center justify-center font-bold text-xs">
                  {inspectAlbum.n}
                </span>
                <span className="uppercase text-[#8a7a65]">{ERAS[inspectAlbum.era].label}</span>
                <span>•</span>
                <span className="text-[#92400e]">{inspectAlbum.trackCount} tracks</span>
              </div>

              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#2b2117]">
                {inspectAlbum.title}
              </h2>

              <p className="font-serif italic text-sm text-[#78350f] bg-[#fdf0d5]/60 p-3 rounded-xl border border-[#92400e]/20">
                Thesis: "{inspectAlbum.thesis}"
              </p>
            </div>

            {/* Full Lore */}
            {inspectAlbum.fullLore && (
              <div className="space-y-1.5">
                <h4 className="font-mono text-xs uppercase text-[#8a7a65] tracking-wider font-semibold">
                  Lore & Background Context
                </h4>
                <p className="font-sans text-sm text-[#3d2f20] leading-relaxed bg-white/70 p-4 rounded-xl border border-[#2b2117]/10">
                  {inspectAlbum.fullLore}
                </p>
              </div>
            )}

            {/* Sample Tracks */}
            {inspectAlbum.tracks && inspectAlbum.tracks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase text-[#8a7a65] tracking-wider font-semibold flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-[#c2410c]" />
                  <span>Key Track Snippets</span>
                </h4>
                <div className="space-y-2">
                  {inspectAlbum.tracks.map(tr => (
                    <div key={tr.id} className="bg-white p-3 rounded-lg border border-[#2b2117]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-serif font-bold text-sm text-[#2b2117]">{tr.name}</div>
                        {tr.lyricSnippet && (
                          <div className="font-mono text-xs text-[#6b5a46] italic">"{tr.lyricSnippet}"</div>
                        )}
                      </div>
                      {tr.keySignature && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#2b2117]/5 text-[#8a7a65] w-fit">
                          Key: {tr.keySignature}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inherent Tensions */}
            {inspectAlbum.inherentTensions && inspectAlbum.inherentTensions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase text-[#8a7a65] tracking-wider font-semibold flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-[#92400e]" />
                  <span>Active Creative Tensions</span>
                </h4>
                <ul className="list-disc list-inside font-mono text-xs text-[#78350f] bg-[#fffbeb] p-3 rounded-xl border border-[#d4a017]/30 space-y-1">
                  {inspectAlbum.inherentTensions.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#2b2117]/15 flex items-center justify-end gap-3">
              <button
                onClick={() => setInspectAlbum(null)}
                className="px-4 py-2 rounded-lg font-mono text-xs text-[#6b5a46] hover:bg-[#2b2117]/5"
              >
                Close
              </button>
              <button
                id="modal-seed-growth-btn"
                onClick={() => {
                  onSeedNearbyGrowth(inspectAlbum);
                  setInspectAlbum(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2b2117] text-[#fdf8ef] font-mono text-xs font-semibold shadow-sm hover:bg-[#92400e] transition-all"
              >
                <Compass className="w-4 h-4 text-[#d4a017]" />
                <span>🌱 Find Nearby Growth From This Album</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
