/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { ALBUMS } from "./src/data/autodiscographyData";
import { INITIAL_EVENTS, INITIAL_IDEAS } from "./src/data/initialLedgerData";
import { EventReceipt, JubileeIdea, LineagePacket, NearbyGrowthResult, SeedForgeProposal } from "./src/types/jubileeTypes";

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set. SeedForge will operate in fallback mode if called.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// In-memory Jubilee Ledger Store (simulating authority database)
let ledgerEvents: EventReceipt[] = [...INITIAL_EVENTS];
let activeIdeas: JubileeIdea[] = [...INITIAL_IDEAS];

function calculateHash(prevHash: string, payloadStr: string): string {
  return "0x" + crypto.createHash("sha256").update(prevHash + payloadStr).digest("hex").slice(0, 10);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      node: "jubilee-cluster-gateway",
      version: "0.1-baseline",
      nodes: [
        { nodeId: "jubilee", name: "Jubilee Witness Ledger", role: "Authority & Append-only Chain", status: "online", version: "0.1" },
        { nodeId: "seedforge", name: "SeedForge Proposal Node", role: "Bounded Gemini AI Proposal Generation", status: process.env.GEMINI_API_KEY ? "online" : "no_key", version: "2.4" },
        { nodeId: "autodisco", name: "Autodisco Archive Node", role: "26 Albums & Lore Substrate", status: "online", version: "1.0" },
        { nodeId: "lamppost", name: "LampPost Cultivation Node", role: "Idea Germination & Pattern Cards", status: "online", version: "0.8" },
        { nodeId: "recurv", name: "reCURV Repair Node", role: "Repair Scars & Epistemic States", status: "online", version: "0.9" },
        { nodeId: "bananadash", name: "BananaDash Weather Surface", role: "Cluster Legibility & Read Projections", status: "online", version: "0.5" }
      ],
      ledgerHead: ledgerEvents[ledgerEvents.length - 1]?.currentHash || "0x0",
      totalEvents: ledgerEvents.length,
      activeIdeasCount: activeIdeas.length
    });
  });

  // API 1: Find Nearby Growth (5 Lanes Permission-First Search)
  app.post("/api/nearby-growth", (req, res) => {
    try {
      const { seedAlbumId, searchText, activeTension } = req.body;
      const seedNumber = Number(seedAlbumId) || 26; // Default to The Pit (Album 26)
      const seedAlbum = ALBUMS.find(a => a.n === seedNumber) || ALBUMS[25];

      // Build 6 diversified results across the 5 lanes
      const results: NearbyGrowthResult[] = [];

      // 1. Semantic Lane (Matches themes or text)
      const semanticCandidates = ALBUMS.filter(a =>
        a.n !== seedAlbum.n &&
        (a.keys.some(k => seedAlbum.keys.some(sk => k.toLowerCase().includes(sk.toLowerCase().split(' ')[0]))) ||
         a.era === seedAlbum.era)
      );
      const semTarget = semanticCandidates[0] || ALBUMS[0];
      results.push({
        artifactId: `art_album_${semTarget.n}_semantic`,
        albumId: semTarget.n,
        albumTitle: semTarget.title,
        era: semTarget.era,
        excerpt: semTarget.thesis,
        primaryLane: "semantic",
        lanes: ["semantic"],
        dependencyStatus: "verified",
        reuseStatus: "eligible_for_consideration",
        evidence: [{
          lane: "semantic",
          kind: "semantic_similarity",
          description: `Shares motif alignment and era context (${semTarget.era}) with ${seedAlbum.title}`,
          sources: [{ eventId: "evt_001_genesis", openable: true, display: "available", albumId: semTarget.n, title: semTarget.title }]
        }]
      });

      // 2. Lineage Lane (Ancestors / Descendants)
      const lineageTargetNum = seedAlbum.lineageConnections?.[0]?.targetAlbum || (seedAlbum.n > 1 ? seedAlbum.n - 1 : 26);
      const lineageTarget = ALBUMS.find(a => a.n === lineageTargetNum) || ALBUMS[0];
      results.push({
        artifactId: `art_album_${lineageTarget.n}_lineage`,
        albumId: lineageTarget.n,
        albumTitle: lineageTarget.title,
        era: lineageTarget.era,
        excerpt: lineageTarget.thesis,
        primaryLane: "lineage",
        lanes: ["lineage", "semantic"],
        dependencyStatus: "verified",
        reuseStatus: "eligible_for_consideration",
        evidence: [{
          lane: "lineage",
          kind: "direct_relation",
          description: `Direct structural lineage relation: ${seedAlbum.lineageConnections?.[0]?.note || "Sequential development"}`,
          sources: [{ eventId: "evt_002_harvest", openable: true, display: "available", albumId: lineageTarget.n, title: lineageTarget.title }]
        }]
      });

      // 3. Active Tension Lane (Shared unresolved creative question)
      const tensionTargetNum = seedAlbum.n % 2 === 0 ? 10 : 21; // Lore doc 10 or Juble Early 21
      const tensionTarget = ALBUMS.find(a => a.n === tensionTargetNum) || ALBUMS[9];
      results.push({
        artifactId: `art_album_${tensionTarget.n}_tension`,
        albumId: tensionTarget.n,
        albumTitle: tensionTarget.title,
        era: tensionTarget.era,
        excerpt: `Active Tension: ${tensionTarget.inherentTensions?.[0] || activeTension || "Human choice vs automated authority"}`,
        primaryLane: "active_tension",
        lanes: ["active_tension"],
        dependencyStatus: "verified",
        reuseStatus: "eligible_for_consideration",
        evidence: [{
          lane: "active_tension",
          kind: "shared_tension",
          description: `Shares unresolved tension with current seed: "${tensionTarget.inherentTensions?.[0] || "Editing vs Erasure"}"`,
          sources: [{ eventId: "evt_005_repair_scar", openable: true, display: "available", albumId: tensionTarget.n, title: tensionTarget.title }]
        }]
      });

      // 4. Human Link Lane (Explicit user connection in Jubilee)
      const humanTarget = ALBUMS.find(a => a.n === 5) || ALBUMS[4]; // Table learned morning
      results.push({
        artifactId: `art_album_${humanTarget.n}_human_link`,
        albumId: humanTarget.n,
        albumTitle: humanTarget.title,
        era: humanTarget.era,
        excerpt: humanTarget.thesis,
        primaryLane: "human_link",
        lanes: ["human_link", "lineage"],
        dependencyStatus: "verified",
        reuseStatus: "eligible_for_consideration",
        evidence: [{
          lane: "human_link",
          kind: "explicit_human_link",
          description: "Explicitly connected by human harvest in Jubilee Event evt_003_table_init",
          sources: [{ eventId: "evt_003_table_init", openable: true, display: "available", albumId: humanTarget.n, title: humanTarget.title }]
        }]
      });

      // 5. Rejected Parallel Lane (Declined branch preserving alternative future)
      const parallelTarget = ALBUMS.find(a => a.n === 22) || ALBUMS[21]; // Ditch season
      results.push({
        artifactId: `art_album_${parallelTarget.n}_rejected`,
        albumId: parallelTarget.n,
        albumTitle: parallelTarget.title,
        era: parallelTarget.era,
        excerpt: parallelTarget.thesis,
        primaryLane: "rejected_parallel",
        lanes: ["rejected_parallel"],
        dependencyStatus: "historical_complete",
        reuseStatus: "review_required",
        evidence: [{
          lane: "rejected_parallel",
          kind: "parallel_proposal",
          description: "Prior proposal explored alternative system load-in path; declined by human witness to preserve kitchen table focus.",
          sources: [{ eventId: "evt_005_repair_scar", openable: true, display: "available", albumId: parallelTarget.n, title: parallelTarget.title }]
        }]
      });

      // 6. Additional Canon Grounding (The Pit - Album 26)
      if (seedAlbum.n !== 26) {
        const pitAlbum = ALBUMS[25];
        results.push({
          artifactId: `art_album_26_pit_canon`,
          albumId: 26,
          albumTitle: pitAlbum.title,
          era: "canon",
          excerpt: pitAlbum.thesis,
          primaryLane: "lineage",
          lanes: ["lineage", "semantic"],
          dependencyStatus: "verified",
          reuseStatus: "eligible_for_consideration",
          evidence: [{
            lane: "lineage",
            kind: "shared_ancestor",
            description: "Root Canon ground tying all 26 albums into one porch light and litany.",
            sources: [{ eventId: "evt_002_harvest", openable: true, display: "available", albumId: 26, title: pitAlbum.title }]
          }]
        });
      }

      res.json({
        snapshot: {
          ledgerHeadEventId: ledgerEvents[ledgerEvents.length - 1].eventId,
          retrievalPolicyVersion: "jubilee-policy@v0.1",
          indexVersion: "autodisco-26-v1.0",
          timestamp: new Date().toISOString()
        },
        results: results.slice(0, 6)
      });
    } catch (err: any) {
      console.error("Error in /api/nearby-growth:", err);
      res.status(500).json({ error: err.message || "Failed to calculate nearby growth" });
    }
  });

  // API 2: SeedForge Bounded Gemini AI Proposal Generator
  app.post("/api/seedforge/propose", async (req, res) => {
    try {
      const packet: LineagePacket = req.body;

      if (!packet || !packet.selectedSources || packet.selectedSources.length === 0) {
        return res.status(400).json({ error: "LineagePacket must contain at least one selected source" });
      }

      const sourcesSummary = packet.selectedSources
        .map(s => `[Album #${s.albumId} "${s.title}" (${s.lane} lane)]: "${s.excerpt}"`)
        .join("\n");

      const tensionsSummary = packet.activeTensions && packet.activeTensions.length > 0
        ? packet.activeTensions.map(t => `- Tension: "${t}"`).join("\n")
        : "- Tension: Preserve organic human choice vs automated velocity";

      const systemInstruction = `
You are SeedForge, a bounded creative proposal generator in the Jubilee Garden cluster for The Static Collective.
CONSTITUTIONAL INVARIANTS:
1. Models propose. Jubilee witnesses. Humans harvest.
2. You emit an attributed PROPOSAL. You DO NOT mutate state, declare canon, or decide truth.
3. Your proposal MUST be grounded STRICTLY in the provided LineagePacket sources and 26-Album Autodiscography universe.
4. You MUST explicitly preserve active creative tensions rather than erasing or flattening them into generic AI tropes.
5. Vocabulary & Tone: Handmade, warm, rustic, folk-rock, analog tape, porch lights, pine kitchen tables, lemons, paper plates, open E hums, and math-rock precision. Avoid generic SaaS jargon ("supercharge", "empower").

Respond with a JSON object matching this schema:
{
  "title": "A poetic, distinct title for this proposed idea/lyric/concept",
  "generatedContent": "The full creative proposal (verses, lyric fragment, album concept, or liturgy)",
  "preserveTensionsReasoning": "1-2 sentences explaining how this proposal holds or transforms the active tension rather than erasing it",
  "keyMotifsUsed": ["array", "of", "motifs", "from", "sources"]
}
`;

      const userPrompt = `
Generate a creative proposal for target form: "${packet.targetForm || "new_lyric"}".
User Request Context: "${packet.requestText || "Extend the motif into a new verse/concept"}"

ATTACHED LINEAGE PACKET SOURCES:
${sourcesSummary}

ACTIVE CREATIVE TENSIONS TO PRESERVE:
${tensionsSummary}
`;

      let generatedProposal: any = null;

      if (process.env.GEMINI_API_KEY) {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                generatedContent: { type: Type.STRING },
                preserveTensionsReasoning: { type: Type.STRING },
                keyMotifsUsed: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["title", "generatedContent", "preserveTensionsReasoning", "keyMotifsUsed"]
            }
          }
        });

        if (response.text) {
          try {
            generatedProposal = JSON.parse(response.text.trim());
          } catch (pErr) {
            console.warn("Failed to parse Gemini JSON output, using raw text", pErr);
            generatedProposal = {
              title: "Porch Light & Table Continuation",
              generatedContent: response.text,
              preserveTensionsReasoning: "Maintains tension by grounding lyrics in both raw noise and quiet breakfast hospitality.",
              keyMotifsUsed: ["porch light", "kitchen table", "paper plates"]
            };
          }
        }
      }

      // Fallback if no Gemini key or parse issue
      if (!generatedProposal) {
        const firstSrc = packet.selectedSources[0];
        generatedProposal = {
          title: `Proposed Extension: ${firstSrc.title}`,
          generatedContent: `(SeedForge Offline Mode) \nVerse 1:\nThe filament hums on the screen door hinge,\nWe set three paper plates where the light bleeds in.\nNo water, no sleep, but the kitchen table holds\nEvery lemon, every knot, every story retold.`,
          preserveTensionsReasoning: "Synthesizes source excerpts while keeping the tension between raw exhaustion and steady hospitality open.",
          keyMotifsUsed: [firstSrc.title, "paper plates", "porch light"]
        };
      }

      const proposalId = `prop_${Date.now()}`;
      const proposalReceipt: SeedForgeProposal = {
        proposalId,
        packetId: packet.packetId,
        timestamp: new Date().toISOString(),
        model: "gemini-3.6-flash (SeedForge v2.4)",
        title: generatedProposal.title,
        generatedContent: generatedProposal.generatedContent,
        preserveTensionsReasoning: generatedProposal.preserveTensionsReasoning,
        keyMotifsUsed: generatedProposal.keyMotifsUsed || [],
        provenanceSources: packet.selectedSources.map(s => ({ albumId: s.albumId, title: s.title })),
        receipt: {
          promptTokens: 420,
          policyVersion: "seedforge-bounded-v1",
          hash: "0x" + crypto.createHash("md5").update(proposalId + generatedProposal.title).digest("hex").slice(0, 8)
        }
      };

      res.json(proposalReceipt);
    } catch (err: any) {
      console.error("Error in /api/seedforge/propose:", err);
      res.status(500).json({ error: err.message || "Failed to generate proposal in SeedForge" });
    }
  });

  // API 3: Human Harvest to Jubilee Append-Only Ledger
  app.post("/api/jubilee/harvest", (req, res) => {
    try {
      const { ideaId, ideaTitle, summary, content, era, lineagePacketId, proposalId, sourcesCount, tensionResolved } = req.body;

      if (!summary || !content) {
        return res.status(400).json({ error: "Summary and content are required for human harvest" });
      }

      const prevHead = ledgerEvents[ledgerEvents.length - 1];
      const previousHash = prevHead ? prevHead.currentHash : "0x0000000000";
      const eventId = `evt_${Date.now()}_harvest`;
      const currentHash = calculateHash(previousHash, summary + content);

      const newEvent: EventReceipt = {
        eventId,
        timestamp: new Date().toISOString(),
        actor: "human:jublEchat",
        eventType: "HARVEST_VERSION",
        ideaId: ideaId || `idea_${Date.now()}`,
        ideaTitle: ideaTitle || summary.slice(0, 30),
        previousHash,
        currentHash,
        payload: {
          summary,
          content,
          lineagePacketId: lineagePacketId || undefined,
          proposalId: proposalId || undefined,
          sourcesCount: sourcesCount || 1,
          tensionResolved
        }
      };

      ledgerEvents.push(newEvent);

      // Update or create active idea
      let existingIdea = activeIdeas.find(i => i.id === newEvent.ideaId);
      if (existingIdea) {
        existingIdea.currentVersionHash = currentHash;
        existingIdea.harvestCount += 1;
        existingIdea.lastUpdated = newEvent.timestamp;
      } else {
        existingIdea = {
          id: newEvent.ideaId,
          title: newEvent.ideaTitle,
          era: era || "canon",
          currentVersionHash: currentHash,
          status: "active",
          sourceAlbumIds: [26],
          tensions: tensionResolved ? [] : ["Preserved open creative tension"],
          harvestCount: 1,
          lastUpdated: newEvent.timestamp
        };
        activeIdeas.push(existingIdea);
      }

      res.json({
        success: true,
        receipt: newEvent,
        idea: existingIdea,
        chainLength: ledgerEvents.length
      });
    } catch (err: any) {
      console.error("Error in /api/jubilee/harvest:", err);
      res.status(500).json({ error: err.message || "Failed to harvest event to Jubilee ledger" });
    }
  });

  // API 4: Get Jubilee Event Ledger
  app.get("/api/jubilee/ledger", (req, res) => {
    res.json({
      events: ledgerEvents,
      ideas: activeIdeas,
      headHash: ledgerEvents[ledgerEvents.length - 1]?.currentHash || "0x0"
    });
  });

  // API 5: Refactoring & Code / Artifact Analysis Node (Gemini)
  app.post("/api/refactor/analyze", async (req, res) => {
    try {
      const { codeSnippet, language, goals, preserveScar } = req.body;

      if (!codeSnippet) {
        return res.status(400).json({ error: "Code snippet or text is required for refactoring analysis" });
      }

      const systemInstruction = `
You are the reCURV Codebase Refactoring & Analysis Node in the Jubilee Garden system.
Your job is to analyze code, lyrics, or structural schemas, identify areas for improvement (maintainability, performance, clarity, modularity, type safety), suggest precise refactored modifications, and explain the deep architectural reasoning behind your changes.

CONSTITUTIONAL CONSTRAINT:
If preserveScar is true, you MUST respect and document "Repair Scars" — preserving historical intent and user choices rather than blindly erasing past decisions.

Respond in JSON matching this schema:
{
  "analysis": "Executive summary of current code quality, smells, and structural tensions",
  "suggestedCode": "The full, refactored, polished code or structure",
  "improvements": ["array", "of", "concrete", "improvements"],
  "reasoning": "Detailed explanation of why this refactoring enhances quality and maintainability",
  "repairScarNote": "A note detailing how human intent or historical context was preserved as a repair scar"
}
`;

      const userPrompt = `
Language/Format: ${language || "typescript"}
Refactoring Goals: ${goals || "Improve modularity, type safety, and readability while preserving core logic."}
Preserve Repair Scar Context: ${preserveScar ? "Yes" : "No"}

CODE/TEXT TO ANALYZE AND REFACTOR:
\`\`\`${language || "typescript"}
${codeSnippet}
\`\`\`
`;

      let result: any = null;

      if (process.env.GEMINI_API_KEY) {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                analysis: { type: Type.STRING },
                suggestedCode: { type: Type.STRING },
                improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                reasoning: { type: Type.STRING },
                repairScarNote: { type: Type.STRING }
              },
              required: ["analysis", "suggestedCode", "improvements", "reasoning", "repairScarNote"]
            }
          }
        });

        if (response.text) {
          try {
            result = JSON.parse(response.text.trim());
          } catch (pErr) {
            console.warn("Failed to parse Gemini JSON output for refactor, using fallback", pErr);
          }
        }
      }

      if (!result) {
        result = {
          analysis: "Identified opportunities for improved functional decomposition, error boundary handling, and typed immutable data flow.",
          suggestedCode: `// Refactored Output (Offline Mode)\nexport function processJubileeData<T>(input: T[]): T[] {\n  return input.filter(Boolean);\n}`,
          improvements: [
            "Extracted explicit interface definitions",
            "Added runtime null safety guards",
            "Streamlined asynchronous event chain calls"
          ],
          reasoning: "Separating state mutation from pure computation prevents side effects and aligns with Jubilee's append-only model.",
          repairScarNote: "Preserved original human naming conventions to maintain historical continuity."
        };
      }

      res.json(result);
    } catch (err: any) {
      console.error("Error in /api/refactor/analyze:", err);
      res.status(500).json({ error: err.message || "Failed to analyze code" });
    }
  });

  // API 6: Personalized Learning Path Generator Node (Gemini)
  app.post("/api/learning-path/generate", async (req, res) => {
    try {
      const { userGoal, currentLevel, interests } = req.body;

      const systemInstruction = `
You are the LampPost Learning Path Generator in the Jubilee Garden cluster.
Your goal is to construct personalized, logical learning paths tailored to a user's stated goals and current knowledge level.
You extract key concepts, curate suggested learning resources (articles, tutorials, albums, code challenges), and structure them into progressive milestones.

Respond in JSON matching this schema:
{
  "pathTitle": "A clear, compelling title for this personalized learning path",
  "targetGoal": "Summary of the user's primary objective",
  "estimatedTotalDuration": "e.g., 2-3 weeks (15 hours)",
  "milestones": [
    {
      "stepNumber": 1,
      "title": "Milestone Title",
      "summary": "Brief explanation of what the user will master in this step",
      "keyConcepts": ["concept 1", "concept 2"],
      "suggestedResources": [
        { "title": "Resource Name", "type": "article|tutorial|code_challenge|album", "description": "Short details" }
      ],
      "practicalTask": "A hands-on action or coding challenge to verify mastery"
    }
  ]
}
`;

      const userPrompt = `
User Stated Goal: "${userGoal || "Master creative software synthesis and immutable ledger patterns"}"
Current Knowledge Level: "${currentLevel || "intermediate"}"
Interests/Motifs: "${interests || "TypeScript, Open E guitar tuning, event hash chains, folk rock"}"
`;

      let learningPath: any = null;

      if (process.env.GEMINI_API_KEY) {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                pathTitle: { type: Type.STRING },
                targetGoal: { type: Type.STRING },
                estimatedTotalDuration: { type: Type.STRING },
                milestones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      summary: { type: Type.STRING },
                      keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                      suggestedResources: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            type: { type: Type.STRING },
                            description: { type: Type.STRING }
                          },
                          required: ["title", "type", "description"]
                        }
                      },
                      practicalTask: { type: Type.STRING }
                    },
                    required: ["stepNumber", "title", "summary", "keyConcepts", "suggestedResources", "practicalTask"]
                  }
                }
              },
              required: ["pathTitle", "targetGoal", "estimatedTotalDuration", "milestones"]
            }
          }
        });

        if (response.text) {
          try {
            learningPath = JSON.parse(response.text.trim());
          } catch (pErr) {
            console.warn("Failed to parse Gemini JSON output for learning path", pErr);
          }
        }
      }

      if (!learningPath) {
        learningPath = {
          pathTitle: "From Porch Light Litany to Immutable Software Synthesis",
          targetGoal: userGoal || "Master event-driven state architecture and folk-rock thematic composition.",
          estimatedTotalDuration: "2 Weeks (~12 Hours)",
          milestones: [
            {
              stepNumber: 1,
              title: "Foundations of the 26-Album Canon & Open E Tuning",
              summary: "Understand the core motifs of kitchen table hospitality, 42 lemons, and analog tape warmth.",
              keyConcepts: ["Open E Guitar Tuning", "Kitchen Table Hospitality", "Lore Substrate"],
              suggestedResources: [
                { title: "Album #26: The Pit (Canon Core)", type: "album", description: "Listen to the thesis tracks and porch litany." },
                { title: "Guide: Open E Resonances", type: "article", description: "Understanding open string drones in folk compositions." }
              ],
              practicalTask: "Compose a 2-line lyric grounded in a kitchen table motif."
            },
            {
              stepNumber: 2,
              title: "SHA-256 Hash Chains & Bounded AI Proposals",
              summary: "Learn why AI models propose while human harvest records immutable ledger receipts.",
              keyConcepts: ["SHA-256 Hash Chain", "Bounded AI Scope", "Human Harvest Gate"],
              suggestedResources: [
                { title: "Jubilee Witness Ledger Specification", type: "article", description: "Understanding non-mutating AI proposals." },
                { title: "Build an Append-Only Chain", type: "code_challenge", description: "Implement a simple hash calculation function in TypeScript." }
              ],
              practicalTask: "Harvest your first creative proposal into the Jubilee Event Ledger."
            }
          ]
        };
      }

      res.json(learningPath);
    } catch (err: any) {
      console.error("Error in /api/learning-path/generate:", err);
      res.status(500).json({ error: err.message || "Failed to generate learning path" });
    }
  });

  // Vite Middleware for Dev, Static Files for Prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Jubilee Cluster Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
