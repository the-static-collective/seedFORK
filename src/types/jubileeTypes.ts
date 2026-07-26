/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EraKey = 'creepRaw' | 'road' | 'mythic' | 'holy' | 'systems' | 'canon';

export interface EraInfo {
  label: string;
  dot: string;
  border: string;
  bg: string;
  text: string;
  description: string;
}

export interface AlbumTrack {
  id: string;
  name: string;
  lyricSnippet?: string;
  keySignature?: string;
  tensionRef?: string;
}

export interface Album {
  n: number;
  title: string;
  trackCount: number | string;
  keys: string[];
  era: EraKey;
  thesis: string;
  fullLore?: string;
  tracks?: AlbumTrack[];
  inherentTensions?: string[];
  lineageConnections?: Array<{
    targetAlbum: number;
    relationType: 'ancestor' | 'descendant' | 'parallel' | 'repair_scar' | 'counterpoint';
    note: string;
  }>;
}

export type NearbyGrowthLane =
  | 'semantic'
  | 'lineage'
  | 'active_tension'
  | 'human_link'
  | 'rejected_parallel';

export type DependencyStatus =
  | 'verified'
  | 'historical_complete'
  | 'superseded_dependency'
  | 'missing_dependency';

export type ReuseStatus =
  | 'eligible_for_consideration'
  | 'review_required'
  | 'blocked_unverifiable';

export interface SafeSourceRef {
  eventId: string;
  openable: boolean;
  display: 'available' | 'redacted' | 'unavailable';
  albumId?: number;
  title?: string;
}

export interface LaneEvidence {
  lane: NearbyGrowthLane;
  kind:
    | 'shared_tension'
    | 'direct_relation'
    | 'shared_ancestor'
    | 'explicit_human_link'
    | 'semantic_similarity'
    | 'parallel_proposal';
  sources: SafeSourceRef[];
  description: string;
}

export interface NearbyGrowthResult {
  artifactId: string;
  albumId: number;
  albumTitle: string;
  era: EraKey;
  excerpt: string;
  primaryLane: NearbyGrowthLane;
  lanes: NearbyGrowthLane[];
  dependencyStatus: DependencyStatus;
  reuseStatus: ReuseStatus;
  relationType?: 'direct' | 'inferred' | 'provisional';
  evidenceStrength?: number; // 0.0 - 1.0
  tensionDelta?: 'introduces' | 'holds' | 'resolves';
  evidence: LaneEvidence[];
}

export interface RetrievalSnapshot {
  ledgerHeadEventId: string;
  retrievalPolicyVersion: string;
  indexVersion: string;
  timestamp: string;
  retrievalMode?: 'heuristic_provisional' | 'semantic_indexed';
}

export interface NearbyGrowthResponse {
  snapshot: RetrievalSnapshot;
  results: NearbyGrowthResult[];
}

export type TargetProposalForm =
  | 'new_lyric'
  | 'song_fragment'
  | 'album_concept'
  | 'structural_idea'
  | 'code_repair'
  | 'learning_path'
  | 'thesis_continuation'
  | 'repair_scar'
  | 'liturgy';

export interface LineagePacket {
  packetId: string;
  requestText: string;
  snapshot?: RetrievalSnapshot;
  selectedSources: Array<{
    artifactId: string;
    albumId: number;
    title: string;
    excerpt: string;
    lane: NearbyGrowthLane;
  }>;
  activeTensions: string[];
  targetForm: TargetProposalForm;
  constraints: {
    proposalOnly: true;
    preserveTensions: boolean;
    noDirectStateMutation: true;
  };
}

export interface SeedForgeProposal {
  proposalId: string;
  packetId: string;
  timestamp: string;
  model: string;
  title: string;
  generatedContent: string;
  preserveTensionsReasoning: string;
  keyMotifsUsed: string[];
  provenanceSources: Array<{
    albumId: number;
    title: string;
  }>;
  receipt: {
    promptTokens: number;
    policyVersion: string;
    hash: string;
  };
}

export type EventType =
  | 'HARVEST_VERSION'
  | 'CREATE_IDEA'
  | 'PROPOSE_SEED'
  | 'RECORD_REPAIR_SCAR'
  | 'HOLD_TENSION'
  | 'ABANDON_PATH';

export interface EventReceipt {
  eventId: string;
  timestamp: string;
  actor: string; // e.g. "human:jublEchat", "node:seedforge", "node:lamppost", "node:recurv"
  eventType: EventType;
  ideaId: string;
  ideaTitle: string;
  previousHash: string;
  currentHash: string;
  payload: {
    summary: string;
    content?: string;
    lineagePacketId?: string;
    proposalId?: string;
    sourcesCount?: number;
    tensionResolved?: string;
    repairScarNote?: string;
  };
}

export interface JubileeIdea {
  id: string;
  title: string;
  era: EraKey;
  currentVersionHash: string;
  status: 'active' | 'held' | 'composted' | 'repaired';
  sourceAlbumIds: number[];
  tensions: string[];
  harvestCount: number;
  lastUpdated: string;
}

export interface NodeHealth {
  nodeId: string;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'syncing';
  version: string;
  eventsProcessed: number;
}
