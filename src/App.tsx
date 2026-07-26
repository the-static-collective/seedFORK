/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderNav, ActiveTab } from './components/HeaderNav';
import { UnifiedWorkbench } from './components/UnifiedWorkbench';
import { AlbumExplorer } from './components/AlbumExplorer';
import { JubileeLedgerView } from './components/JubileeLedgerView';
import { Album, EventReceipt, JubileeIdea, NearbyGrowthLane } from './types/jubileeTypes';
import { INITIAL_EVENTS, INITIAL_IDEAS } from './data/initialLedgerData';
import { ALBUMS } from './data/autodiscographyData';

export default function App() {
  // Navigation for optional view overlays if requested
  const [activeTab, setActiveTab] = useState<ActiveTab>('nearby');

  // Attached LineagePacket Sources
  const [packetSources, setPacketSources] = useState<
    Array<{
      artifactId: string;
      albumId: number;
      title: string;
      excerpt: string;
      lane: NearbyGrowthLane;
    }>
  >([
    {
      artifactId: 'art_album_26_pit',
      albumId: 26,
      title: 'The Autodiscography - The Pit**START HERE**(or don\'t)',
      excerpt: 'Canon / Greatest hits. Whole mythology in one porch.',
      lane: 'lineage',
    },
    {
      artifactId: 'art_album_5_table',
      albumId: 5,
      title: 'The Autodiscography - The Second Step',
      excerpt: 'Liturgy locks in. Table learned morning, wood can pray without sound.',
      lane: 'human_link',
    },
  ]);

  // Ledger state
  const [ledgerEvents, setLedgerEvents] = useState<EventReceipt[]>(INITIAL_EVENTS);
  const [activeIdeas, setActiveIdeas] = useState<JubileeIdea[]>(INITIAL_IDEAS);

  // Fetch live ledger state from server API
  const fetchLedger = async () => {
    try {
      const res = await fetch('/api/jubilee/ledger');
      if (res.ok) {
        const data = await res.json();
        if (data.events && data.events.length > 0) setLedgerEvents(data.events);
        if (data.ideas && data.ideas.length > 0) setActiveIdeas(data.ideas);
      }
    } catch (err) {
      console.error('Failed to fetch ledger:', err);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleHarvestSuccess = (receipt: EventReceipt) => {
    fetchLedger();
  };

  const handleRemovePacketSource = (artifactId: string) => {
    setPacketSources(prev => prev.filter(s => s.artifactId !== artifactId));
  };

  const handleAddAlbumSource = (album: Album) => {
    if (packetSources.some(s => s.albumId === album.n)) return;
    setPacketSources(prev => [
      ...prev,
      {
        artifactId: `art_album_${album.n}`,
        albumId: album.n,
        title: album.title,
        excerpt: album.thesis || '',
        lane: 'lineage',
      },
    ]);
  };

  const ledgerHead = ledgerEvents[ledgerEvents.length - 1]?.currentHash || '0x0';

  return (
    <div className="min-h-screen bg-[#fdf8ef] text-[#2b2117] font-sans antialiased selection:bg-[#f5d6a8] flex flex-col">
      {/* Top Header */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        packetCount={packetSources.length}
        ledgerHead={ledgerHead}
        totalEvents={ledgerEvents.length}
      />

      {/* Main Single-View Workstation Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'nearby' && (
          <UnifiedWorkbench
            ledgerEvents={ledgerEvents}
            activeIdeas={activeIdeas}
            packetSources={packetSources}
            onRemoveSource={handleRemovePacketSource}
            onAddSource={handleAddAlbumSource}
            onRefreshLedger={fetchLedger}
            onHarvestSuccess={handleHarvestSuccess}
          />
        )}

        {activeTab === 'archive' && (
          <div className="space-y-4">
            <button
              onClick={() => setActiveTab('nearby')}
              className="px-3 py-1.5 bg-[#2b2117] text-[#fde68a] rounded-lg font-mono text-xs font-bold"
            >
              ← Back to Unified Studio
            </button>
            <AlbumExplorer onSeedNearbyGrowth={(album) => { handleAddAlbumSource(album); setActiveTab('nearby'); }} />
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="space-y-4">
            <button
              onClick={() => setActiveTab('nearby')}
              className="px-3 py-1.5 bg-[#2b2117] text-[#fde68a] rounded-lg font-mono text-xs font-bold"
            >
              ← Back to Unified Studio
            </button>
            <JubileeLedgerView
              events={ledgerEvents}
              ideas={activeIdeas}
              onRefreshLedger={fetchLedger}
              onManualHarvest={async (summary, content) => {
                await fetch('/api/jubilee/harvest', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ summary, content, era: 'canon' }),
                });
                fetchLedger();
              }}
            />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-[#2b2117]/10 bg-[#fdf8ef] py-6 font-mono text-xs text-[#6b5a46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <p className="font-bold text-[#2b2117] uppercase tracking-wider">
              The Static Collective • Jubilee Unified Studio v1.0
            </p>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Models propose. Nodes perform bounded work. Jubilee witnesses. Humans harvest.
            </p>
          </div>

          <div className="text-right text-[11px] text-[#8a7a65]">
            <div>26 Albums • Unified Memory Topology Engine</div>
            <div>Powered by Gemini AI</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

