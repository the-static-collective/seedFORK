/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventReceipt, JubileeIdea } from '../types/jubileeTypes';

export const INITIAL_IDEAS: JubileeIdea[] = [
  {
    id: "idea_porch_light",
    title: "Porch Light Refuses to Die",
    era: "creepRaw",
    currentVersionHash: "0x8a92f012b1",
    status: "active",
    sourceAlbumIds: [3, 26],
    tensions: ["Is staying an act of courage or fear of moving?"],
    harvestCount: 3,
    lastUpdated: "2026-07-26T12:00:00Z"
  },
  {
    id: "idea_table_liturgy",
    title: "The Table That Kept Growing",
    era: "road",
    currentVersionHash: "0x91d44bc89e",
    status: "active",
    sourceAlbumIds: [5, 17, 18],
    tensions: ["Exhausted limits of space vs open door policy"],
    harvestCount: 4,
    lastUpdated: "2026-07-26T11:30:00Z"
  },
  {
    id: "idea_code_writes_itself",
    title: "Quantum Co-Delight & Hash Proof",
    era: "mythic",
    currentVersionHash: "0x3e77a11200",
    status: "repaired",
    sourceAlbumIds: [10, 16, 19],
    tensions: ["Deterministic code vs organic human delight"],
    harvestCount: 2,
    lastUpdated: "2026-07-26T10:15:00Z"
  },
  {
    id: "idea_banana_elf_funk",
    title: "Banana Elf & The Holy Fool",
    era: "holy",
    currentVersionHash: "0xfa11b099cd",
    status: "held",
    sourceAlbumIds: [20, 25],
    tensions: ["Irreverent satire vs holy reverence"],
    harvestCount: 1,
    lastUpdated: "2026-07-25T18:45:00Z"
  }
];

export const INITIAL_EVENTS: EventReceipt[] = [
  {
    eventId: "evt_001_genesis",
    timestamp: "2026-07-20T08:00:00Z",
    actor: "human:jublEchat",
    eventType: "CREATE_IDEA",
    ideaId: "idea_porch_light",
    ideaTitle: "Porch Light Refuses to Die",
    previousHash: "0x0000000000000000000000000000000000000000",
    currentHash: "0x1a830b42c1",
    payload: {
      summary: "Initialized Porch Light continuity from Creep Mode Album 3",
      content: "Filament glowing yellow like a stubborn tooth. The light refuses to go out despite lightning.",
      sourcesCount: 2
    }
  },
  {
    eventId: "evt_002_harvest",
    timestamp: "2026-07-21T09:30:00Z",
    actor: "human:jublEchat",
    eventType: "HARVEST_VERSION",
    ideaId: "idea_porch_light",
    ideaTitle: "Porch Light Refuses to Die",
    previousHash: "0x1a830b42c1",
    currentHash: "0x8a92f012b1",
    payload: {
      summary: "Harvested canon synthesis from Album 26 (The Pit)",
      content: "We keep the light yellow on the back porch forever. Every newcomer sees it first.",
      lineagePacketId: "pkt_init_001",
      proposalId: "prop_seed_001",
      sourcesCount: 3
    }
  },
  {
    eventId: "evt_003_table_init",
    timestamp: "2026-07-22T14:20:00Z",
    actor: "human:jublEchat",
    eventType: "CREATE_IDEA",
    ideaId: "idea_table_liturgy",
    ideaTitle: "The Table That Kept Growing",
    previousHash: "0x8a92f012b1",
    currentHash: "0x44cd811a90",
    payload: {
      summary: "Seeded table liturgy from Album 5 & 17",
      content: "Pine wood remembers coffee cups. Table loaded onto truck for Des Moines tour.",
      sourcesCount: 2
    }
  },
  {
    eventId: "evt_004_table_harvest",
    timestamp: "2026-07-23T16:10:00Z",
    actor: "human:jublEchat",
    eventType: "HARVEST_VERSION",
    ideaId: "idea_table_liturgy",
    ideaTitle: "The Table That Kept Growing",
    previousHash: "0x44cd811a90",
    currentHash: "0x91d44bc89e",
    payload: {
      summary: "Harvested ¿NEXT! hospitality extension",
      content: "There is always one empty chair left at the end of the table. Room for whoever arrives.",
      sourcesCount: 4
    }
  },
  {
    eventId: "evt_005_repair_scar",
    timestamp: "2026-07-24T19:00:00Z",
    actor: "node:recurv",
    eventType: "RECORD_REPAIR_SCAR",
    ideaId: "idea_code_writes_itself",
    ideaTitle: "Quantum Co-Delight & Hash Proof",
    previousHash: "0x91d44bc89e",
    currentHash: "0x3e77a11200",
    payload: {
      summary: "Recorded scar from model overclaim attempt",
      repairScarNote: "AI proposal claimed auto-settlement. Re-anchored to human harvest rule in Document 58271.",
      tensionResolved: "AI output authority vs human witness"
    }
  }
];
