# Jubilee Unified Studio & Autodiscography Engine

An open-source creative workstation, code refactoring studio, and learning path synthesizer powered by Google Gemini AI and an append-only SHA-256 event ledger.

## 🌟 Overview

The **Jubilee Unified Studio** consolidates creative proposal generation, codebase refactoring, learning path generation, and 26-album autodiscography lore into a streamlined, single-screen workstation.

### Core Architectural Principles
1. **Bounded AI Proposals**: Gemini AI models propose content, suggestions, and learning structures; humans review and execute the **Harvest Gate**.
2. **Immutable SHA-256 Event Ledger**: Every harvested proposal, refactoring commit, or learning milestone is recorded to an append-only event chain with strict cryptographic parent hashing.
3. **Repair Scar Preservation**: Refactoring and synthesis tools actively preserve historical context, active creative tensions, and structural intent rather than silently mutating state.

---

## 🚀 Features

- **Proposal AI Studio (SeedForge)**: Synthesize lyrics, folk-rock litanies, or creative proposals attached to specific album lore.
- **AI Refactoring & Repair Engine (reCURV)**: Analyze TypeScript, JavaScript, Python, or SQL codebases for type safety, state immutability, and quality smells while recording repair scar context.
- **Personalized Learning Path Generator**: Curate tailored concept progressions, tutorials, album tracks, and coding challenges based on user goals and knowledge profile.
- **26-Album Autodiscography Canon**: Explore the complete mythology, track listings, and thematic lore of The Static Collective's 26 albums.
- **Jubilee Witness Ledger**: Audit the append-only event stream with real-time cryptographic hash chains.

---

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/jubilee-unified-studio.git
cd jubilee-unified-studio

# Install dependencies
npm install
```

### Environment Setup
Copy `.env.example` to `.env` and add your Gemini API Key:
```bash
cp .env.example .env
```

In `.env`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### Development
Start the full-stack Express + Vite development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Deployment
Build the bundled client and backend server:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

---

## 📂 Project Structure

```
├── server.ts                   # Express server entry point & Gemini API proxy
├── src/
│   ├── App.tsx                 # Main React Application entry & state shell
│   ├── components/
│   │   ├── UnifiedWorkbench.tsx# Single-screen studio workbench
│   │   ├── HeaderNav.tsx       # Top navigation header & ledger status
│   │   ├── AlbumExplorer.tsx   # 26-album canon explorer
│   │   └── JubileeLedgerView.tsx# Immutable SHA-256 event stream view
│   ├── data/                   # Autodiscography lore & initial ledger state
│   ├── types/                  # Shared TypeScript interfaces & types
│   └── index.css               # Tailwind CSS v4 entry
├── package.json
└── README.md
```

---

## 📜 License

Licensed under the Apache License, Version 2.0.
