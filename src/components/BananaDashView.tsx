/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Hash,
  Database,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface NodeInfo {
  nodeId: string;
  name: string;
  role: string;
  status: string;
  version: string;
}

interface BananaDashProps {
  totalEvents: number;
  totalIdeas: number;
  ledgerHead: string;
}

export const BananaDashView: React.FC<BananaDashProps> = ({
  totalEvents,
  totalIdeas,
  ledgerHead,
}) => {
  const [nodes, setNodes] = useState<NodeInfo[]>([
    { nodeId: 'jubilee', name: 'Jubilee Witness Ledger', role: 'Authority Plane & Hash Chain', status: 'online', version: '0.1' },
    { nodeId: 'seedforge', name: 'SeedForge Proposal Node', role: 'Bounded Gemini AI Proposal Generation', status: 'online', version: '2.4' },
    { nodeId: 'autodisco', name: 'Autodisco Archive Node', role: '26 Albums & Lore Substrate', status: 'online', version: '1.0' },
    { nodeId: 'lamppost', name: 'LampPost Cultivation Node', role: 'Idea Germination & Pattern Cards', status: 'online', version: '0.8' },
    { nodeId: 'recurv', name: 'reCURV Repair Node', role: 'Repair Scars & Epistemic States', status: 'online', version: '0.9' },
    { nodeId: 'bananadash', name: 'BananaDash Weather Surface', role: 'Cluster Legibility & Read Projections', status: 'online', version: '0.5' },
  ]);

  const [healthStatus, setHealthStatus] = useState<string>('ok');

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.nodes) {
        setNodes(data.nodes);
      }
      setHealthStatus(data.status || 'ok');
    } catch (err) {
      console.error('Health check failed:', err);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl bg-white/90 border border-[#2b2117]/10 p-6 md:p-8 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-[#8a7a65] uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-[#92400e]" />
              <span>BananaDash • Cluster Weather & Legibility</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b2117]">
              Jubilee Garden Node Ecosystem
            </h2>
            <p className="font-mono text-xs text-[#6b5a46] max-w-2xl leading-relaxed">
              Monitors node health, compute receipts, and state projections across the six cluster nodes.
              All node outputs remain non-authoritative read models or proposals until human harvest.
            </p>
          </div>

          <button
            onClick={checkHealth}
            className="p-2.5 rounded-xl border border-[#2b2117]/15 bg-white text-[#2b2117] hover:bg-[#2b2117]/5 font-mono text-xs flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-4 h-4 text-[#5b8a72]" />
            <span>Refresh Health</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] text-[#8a7a65] uppercase font-semibold block">
            Jubilee Chain Head
          </span>
          <div className="text-xl font-bold text-[#2b2117] truncate">{ledgerHead}</div>
          <p className="text-[10px] text-[#5b8a72] font-semibold">✓ Append-Only Integrity</p>
        </div>

        <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] text-[#8a7a65] uppercase font-semibold block">
            Total Witnessed Events
          </span>
          <div className="text-2xl font-bold text-[#92400e]">{totalEvents}</div>
          <p className="text-[10px] text-[#6b5a46]">SHA-256 Event Receipts</p>
        </div>

        <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] text-[#8a7a65] uppercase font-semibold block">
            Active Harvested Ideas
          </span>
          <div className="text-2xl font-bold text-[#2b2117]">{totalIdeas}</div>
          <p className="text-[10px] text-[#6b5a46]">Human-accepted versions</p>
        </div>

        <div className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] text-[#8a7a65] uppercase font-semibold block">
            Autodiscography Substrate
          </span>
          <div className="text-2xl font-bold text-[#c2410c]">26 Albums</div>
          <p className="text-[10px] text-[#6b5a46]">Creep Mode Universe</p>
        </div>
      </div>

      {/* Node Status Grid */}
      <div className="space-y-4">
        <h3 className="font-mono text-xs uppercase text-[#8a7a65] font-bold tracking-wider">
          Cluster Node Health Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {nodes.map(node => (
            <div
              key={node.nodeId}
              className="rounded-2xl bg-white border border-[#2b2117]/10 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs bg-[#2b2117] text-white px-2 py-0.5 rounded font-bold">
                    {node.nodeId}
                  </span>

                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      node.status === 'online'
                        ? 'bg-[#e8f0e9] text-[#2f4a3e]'
                        : 'bg-[#fff1e6] text-[#7c2d12]'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {node.status}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#2b2117]">
                  {node.name}
                </h4>

                <p className="font-mono text-xs text-[#6b5a46] bg-[#fdf8ef] p-2.5 rounded-xl border border-[#2b2117]/10">
                  {node.role}
                </p>
              </div>

              <div className="font-mono text-[10px] text-[#8a7a65] pt-2 border-t border-dashed border-[#2b2117]/10 flex items-center justify-between">
                <span>Version: v{node.version}</span>
                <span>Bounded Node</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Constitutional Invariants Rulebook Card */}
      <div className="rounded-2xl bg-[#fffbeb] border-2 border-[#d4a017]/40 p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-[#78350f] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#d4a017]" />
          <span>The Living Baseline Constitutional Rules</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-[#78350f]">
          <div className="bg-white/80 p-4 rounded-xl border border-[#d4a017]/30 space-y-1">
            <strong className="block text-[#2b2117] uppercase text-[11px]">1. Append, Do Not Erase</strong>
            <p>Historical events, rejected proposals, and repair scars remain permanently addressable on the event ledger chain.</p>
          </div>

          <div className="bg-white/80 p-4 rounded-xl border border-[#d4a017]/30 space-y-1">
            <strong className="block text-[#2b2117] uppercase text-[11px]">2. Human Harvest Mutation Gate</strong>
            <p>AI models (SeedForge) emit attributed proposals. Only human-authenticated actions advance canonical pointers.</p>
          </div>

          <div className="bg-white/80 p-4 rounded-xl border border-[#d4a017]/30 space-y-1">
            <strong className="block text-[#2b2117] uppercase text-[11px]">3. Permission Precedes Retrieval</strong>
            <p>Readable universe is established before semantic search, graph traversal, or excerpt creation.</p>
          </div>

          <div className="bg-white/80 p-4 rounded-xl border border-[#d4a017]/30 space-y-1">
            <strong className="block text-[#2b2117] uppercase text-[11px]">4. No Hidden Shared State</strong>
            <p>Chats and nodes remain bounded. Shared history moves through explicit, hash-verified receipts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
