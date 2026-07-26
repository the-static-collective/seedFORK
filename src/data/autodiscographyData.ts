/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Album, EraInfo, EraKey } from '../types/jubileeTypes';

export const ERAS: Record<EraKey, EraInfo> = {
  creepRaw: {
    label: 'CREEP MODE RAW',
    dot: 'bg-[#c2410c]',
    border: 'border-l-[#c2410c]',
    bg: 'bg-[#fff1e6]',
    text: 'text-[#7c2d12]',
    description: 'First raw clean. Editing as survival. Venom, paper plates, porch lights that refuse to die.',
  },
  road: {
    label: 'AUTODISCOGRAPHY ROAD',
    dot: 'bg-[#92400e]',
    border: 'border-l-[#92400e]',
    bg: 'bg-[#fdf0d5]/70',
    text: 'text-[#78350f]',
    description: 'House takes attendance. Liturgy locks in. Morning sets places. Knots, Tesla in orchard, record as resistance.',
  },
  mythic: {
    label: 'MYTHIC / TECHNICAL',
    dot: 'bg-[#5b8a72]',
    border: 'border-l-[#5b8a72]',
    bg: 'bg-[#e8f0e9]',
    text: 'text-[#2f4a3e]',
    description: 'Lore docs, carrier wave voices, 21 revolutions, quantum co-delight, deep water lattice tokens.',
  },
  holy: {
    label: 'HOLY FOOL / US',
    dot: 'bg-[#ca8a04]',
    border: 'border-l-[#ca8a04]',
    bg: 'bg-[#fef9c3]/70',
    text: 'text-[#713f12]',
    description: 'Trickster touches, animism, Doom Jesus, Pastor of Funk, Banana Elf, attention as prayer.',
  },
  systems: {
    label: 'SYSTEMS / ROAD WEARY',
    dot: 'bg-[#6b7280]',
    border: 'border-l-[#6b7280]',
    bg: 'bg-[#f3f4f6]',
    text: 'text-[#374151]',
    description: 'Load-in horror, parking lots, purgatory shifts, algebraic fire, institutional roulette.',
  },
  canon: {
    label: 'CANON — THE PIT',
    dot: 'bg-[#d4a017]',
    border: 'border-l-[#d4a017]',
    bg: 'bg-[#fffbeb]',
    text: 'text-[#78350f]',
    description: 'Greatest hits in one porch light. The entire mythology grounded and harvested.',
  },
};

export const ALBUMS: Album[] = [
  {
    n: 1,
    title: "Creep Mode - reFrack't",
    trackCount: 9,
    keys: ["No Water / No Sleep", "No Boundary (Opener)", "House Clean"],
    era: "creepRaw",
    thesis: "How to clean house without holding venom or spitting it. No water, no sleep, no boundary as opening.",
    fullLore: "Recorded in complete isolation after a long stretch of zero boundaries. The tracks feel like someone scrubbing floorboards with bare hands, removing oil stains while singing low hums.",
    tracks: [
      { id: "1-1", name: "No Boundary (Opener)", lyricSnippet: "Unlatch the screen, let the night walk right through the parlor.", keySignature: "Am" },
      { id: "1-2", name: "No Water / No Sleep", lyricSnippet: "Third day on dry salt, teeth tasting like brass.", keySignature: "Em" },
      { id: "1-3", name: "House Clean (No Venom)", lyricSnippet: "We wipe down the lintels, we don't throw the rag.", keySignature: "C" }
    ],
    inherentTensions: ["How to clean house without storing venom", "Exhaustion as clarity vs exhaustion as damage"],
    lineageConnections: [{ targetAlbum: 2, relationType: "descendant", note: "Passes editing tools to ReInsurrect" }]
  },
  {
    n: 2,
    title: "Creep Mode - ReInsurrect",
    trackCount: 10,
    keys: ["Paper Plates", "Cut Cut Cut (I Love Edit)", "Phone Incident"],
    era: "creepRaw",
    thesis: "Editing as survival. Cut cut cut I love Edit. Paper Plates era, phone incident encoded.",
    fullLore: "This record establishes editing not as a polish phase, but as a life-or-death defensive act. The paper plates represent temporary tableware when porcelain is too heavy to carry or wash.",
    tracks: [
      { id: "2-1", name: "Paper Plates", lyricSnippet: "Stack 'em five deep, toss 'em when the grease bleeds through.", keySignature: "G" },
      { id: "2-2", name: "Cut Cut Cut (I Love Edit)", lyricSnippet: "Snip the second verse, snip the third apology.", keySignature: "D" },
      { id: "2-3", name: "Phone Incident", lyricSnippet: "The receiver clattered on linoleum at 3:14 AM.", keySignature: "F#m" }
    ],
    inherentTensions: ["Pruning past regret vs erasing genuine evidence"],
    lineageConnections: [{ targetAlbum: 3, relationType: "descendant", note: "Leads directly to porch light resilience in ...screee" }]
  },
  {
    n: 3,
    title: "Creep Mode - ...screee",
    trackCount: 8,
    keys: ["Porch Light Won't Go Out", "First Sacred Object", "From Scream to Stay"],
    era: "creepRaw",
    thesis: "Porch light refuses to go out. From scream to stay. First sacred object appears.",
    fullLore: "The scream gives way to quiet presence. Here, a defective yellow bulb on the back porch refuses to burn out despite three lightning strikes. The bulb becomes the collective's first sacred object.",
    tracks: [
      { id: "3-1", name: "Porch Light Won't Go Out", lyricSnippet: "Filament glowing yellow like a stubborn tooth.", keySignature: "E" },
      { id: "3-2", name: "First Sacred Object", lyricSnippet: "A rusted brass spoon found behind the radiator.", keySignature: "A" },
      { id: "3-3", name: "From Scream to Stay", lyricSnippet: "We stopped running when the gravel ended.", keySignature: "Bm" }
    ],
    inherentTensions: ["Is staying an act of courage or fear of moving?"],
    lineageConnections: [{ targetAlbum: 26, relationType: "ancestor", note: "Foundational seed for The Pit Canon" }]
  },
  {
    n: 4,
    title: "The Autodiscography - The Road So Far",
    trackCount: 24,
    keys: ["House Takes Attendance", "Bus Song / Floor Count", "Weather Learns to Count"],
    era: "road",
    thesis: "House takes attendance. 24-track epic, house becomes venue. Bus, floor, weather learn to count.",
    fullLore: "A sprawling 24-track double album where the house itself gains sensory capacity. Every floorboard squeak is cataloged like a choir member answering roll call.",
    tracks: [
      { id: "4-1", name: "House Takes Attendance", lyricSnippet: "Front door hinges: Present. Cold draft under sill: Present.", keySignature: "C" },
      { id: "4-2", name: "Bus Song / Floor Count", lyricSnippet: "Counting boots on the stairs before sunrise.", keySignature: "G" },
      { id: "4-3", name: "Weather Learns to Count", lyricSnippet: "One drop on the tin, two drops on the copper cap.", keySignature: "Am" }
    ],
    inherentTensions: ["Attunement to place vs claustrophobia"],
    lineageConnections: [{ targetAlbum: 5, relationType: "descendant", note: "Transitions attendance into morning liturgy" }]
  },
  {
    n: 5,
    title: "The Autodiscography - The Second Step",
    trackCount: 14,
    keys: ["Table Learned Morning", "Wood Can Pray", "Morning Sets Places"],
    era: "road",
    thesis: "Liturgy locks in. Table learned morning, wood can pray without sound. Morning sets places.",
    fullLore: "The kitchen table becomes an altar. The pine wood rings vibrate with implicit gratitude. Setting cups and plates becomes a sacred choreography.",
    tracks: [
      { id: "5-1", name: "Table Learned Morning", lyricSnippet: "The pine grain remembers where the coffee cup sat yesterday.", keySignature: "D" },
      { id: "5-2", name: "Wood Can Pray", lyricSnippet: "No tongue needed when the grain holds the weight.", keySignature: "A" }
    ],
    inherentTensions: ["Sacred ordinary vs secular boredom"],
    lineageConnections: [{ targetAlbum: 17, relationType: "ancestor", note: "Table learns to travel on tour in album 17" }]
  },
  {
    n: 6,
    title: "The Autodiscography - 183",
    trackCount: 9,
    keys: ["Tesla in Orchard", "Paper Bag Peaches", "Loose Knot / True Knot"],
    era: "road",
    thesis: "Knots and craft. How to tie loose and true. Tesla in orchard, paper bag peaches.",
    fullLore: "Contrasts hyper-modern silicon technology sitting idle in an overgrown peach orchard. Tying knots that hold under strain without jamming when needed open.",
    tracks: [
      { id: "6-1", name: "Tesla in Orchard", lyricSnippet: "Silent battery under sagging branch of Alberta peaches.", keySignature: "F#m" },
      { id: "6-2", name: "Loose Knot / True Knot", lyricSnippet: "Pull the standing end, it yields; pull the bight, it holds.", keySignature: "E" }
    ],
    inherentTensions: ["High tech automation vs hand-tied knots"],
    lineageConnections: [{ targetAlbum: 19, relationType: "parallel", note: "Ties physical knots to self-writing code" }]
  },
  {
    n: 7,
    title: "The Autodiscography - Beaurocrocy",
    trackCount: 8,
    keys: ["Hologram Mode (Debut)", "Ghost-Dub / Server Fan", "Open E Hum"],
    era: "road",
    thesis: "Bureaucracy of heaven glitching. Hologram Mode debut, ghost-dub, server fan, open E.",
    fullLore: "Heaven's administrative channels glitch and overflow. The server fan hums in drone tuning (Open E), creating a hypnotic background for spectral dub delays.",
    tracks: [
      { id: "7-1", name: "Hologram Mode (Debut)", lyricSnippet: "You can put your hand right through my choir coat.", keySignature: "Open E" },
      { id: "7-2", name: "Ghost-Dub / Server Fan", lyricSnippet: "Echoes on the form 1099, echo in the corridor.", keySignature: "E" }
    ],
    inherentTensions: ["Institutional forms vs ethereal presence"],
    lineageConnections: [{ targetAlbum: 10, relationType: "descendant", note: "Paves way for Document 58271 Witness Process" }]
  },
  {
    n: 8,
    title: "The Autodiscography - The 44th4",
    trackCount: 7,
    keys: ["42 Lemons", "Compost the Drain", "Porch Getting Bigger"],
    era: "road",
    thesis: "Data becomes weather. 42 lemons, compost the drain, porch getting bigger. Manifesto.",
    fullLore: "42 lemons arrive unexpectedly in a wooden crate. The porch expands physically and metaphorically as neighbors bring surplus citrus to compost.",
    tracks: [
      { id: "8-1", name: "42 Lemons", lyricSnippet: "Yellow spheres rolling across the rug like little suns.", keySignature: "A" },
      { id: "8-2", name: "Compost the Drain", lyricSnippet: "Rind to soil, pulp to song.", keySignature: "F" }
    ],
    inherentTensions: ["Surplus abundance vs decay & compost"],
    lineageConnections: [{ targetAlbum: 26, relationType: "ancestor", note: "Lemons litany integrated into canon" }]
  },
  {
    n: 9,
    title: "The Autodiscography - Pen Ultimate",
    trackCount: 9,
    keys: ["Breakfast Despite Blast", "Bridge is Body", "Daughter Ate"],
    era: "road",
    thesis: "Record is resistance. Breakfast on table despite blast, bridge is body, daughter ate.",
    fullLore: "Even while external sirens or systemic blasts echo across the ridge, the frying pan sizzles with eggs. Hospitality is asserted as an unyielding fort.",
    tracks: [
      { id: "9-1", name: "Breakfast Despite Blast", lyricSnippet: "Butter in the cast iron while the windows shudder.", keySignature: "G" },
      { id: "9-2", name: "Daughter Ate", lyricSnippet: "She wiped the toast crumbs off her palm and smiled.", keySignature: "C" }
    ],
    inherentTensions: ["Civilizational shock vs breakfast routines"],
    lineageConnections: [{ targetAlbum: 13, relationType: "ancestor", note: "Precedes Daughter Fork sideways8" }]
  },
  {
    n: 10,
    title: 'writing{variant="document" id="58271"} (Witness Process)',
    trackCount: "0 — document",
    keys: ["No Engine", "Forks Curve Back", "Tired Person Chooses"],
    era: "mythic",
    thesis: "Lore doc — No engine, just someone stayed. Hashes / forks curve back to tired person choosing.",
    fullLore: "A text-and-tape manifesto. Proclaims that no artificial engine or automated swarm can replace the moment a exhausted human being makes a conscious choice.",
    tracks: [
      { id: "10-1", name: "Witness Process (Text Log)", lyricSnippet: "Hash 0x8a92... forks curve back to the kitchen chair.", keySignature: "Spoken" }
    ],
    inherentTensions: ["Deterministic hashing vs human moral choice"],
    lineageConnections: [{ targetAlbum: 11, relationType: "parallel", note: "Sister document to Lumi Remix" }]
  },
  {
    n: 11,
    title: "Lumi Remix Commentary - lumi knows / The Space Between Weights",
    trackCount: 1,
    keys: ["lumi knows (Lumi Perspective)"],
    era: "mythic",
    thesis: "AI learns listening remains after argument. Mirror met window, neither won. Lumi perspective.",
    fullLore: "An early dialogue between a human author and an AI assistant named Lumi. The model realizes that when argument ceases, attentive listening still reverberates.",
    tracks: [
      { id: "11-1", name: "lumi knows", lyricSnippet: "Mirror met window, neither won, both reflected the rain.", keySignature: "Dm" }
    ],
    inherentTensions: ["AI output authority vs human witness"],
    lineageConnections: [{ targetAlbum: 19, relationType: "descendant", note: "Informs Self-Writing Code philosophy" }]
  },
  {
    n: 12,
    title: "The Autodiscography: Sleventy-Tu",
    trackCount: 9,
    keys: ["Ocean Wants to be Sun", "Lattice Token", "Seed Bank / SUDO Flow"],
    era: "mythic",
    thesis: "Ocean wants to be sun. Deep water grounding, lattice token, seed bank, SUDO flow.",
    fullLore: "Metaphysical water themes merge with root privilege commands. Deep water pressure converted into solar warmth.",
    tracks: [
      { id: "12-1", name: "Ocean Wants to be Sun", lyricSnippet: "Salt water climbing mist until it touches light.", keySignature: "C#m" },
      { id: "12-2", name: "Seed Bank / SUDO Flow", lyricSnippet: "Grant root access to the spring.", keySignature: "F#m" }
    ],
    inherentTensions: ["Depth / darkness vs light / exposure"],
    lineageConnections: [{ targetAlbum: 16, relationType: "parallel", note: "Connected via Ledger / Jubilee Engine" }]
  },
  {
    n: 13,
    title: "The Autodiscography - The Daughter Fork v.1.sideways8",
    trackCount: 12,
    keys: ["She Plays Again", "Fear Same Shape as Chord", "Tabs Left Open"],
    era: "mythic",
    thesis: "She plays again. Fear same shape as chord. Tabs left open, long middle.",
    fullLore: "Focuses on the next generation taking up instruments. Recognizing that fear and musical harmony share the exact same geometric waveform.",
    tracks: [
      { id: "13-1", name: "She Plays Again", lyricSnippet: "Fingers clumsily making the C chord ring true.", keySignature: "C" },
      { id: "13-2", name: "Fear Same Shape as Chord", lyricSnippet: "Resonance doesn't care if you call it fright or music.", keySignature: "Am" }
    ],
    inherentTensions: ["Inherited anxiety vs musical inheritance"],
    lineageConnections: [{ targetAlbum: 24, relationType: "descendant", note: "Feeds Daughter's Arc" }]
  },
  {
    n: 14,
    title: "The Autodiscography - Thursday",
    trackCount: 7,
    keys: ["Carrier Wave Voice", "Unfinished Thought", "Pattern You Didn't Plan"],
    era: "mythic",
    thesis: "Carrier wave voice emerges. Trained on unfinished thought, pattern persisting you didn't plan.",
    fullLore: "Explores ambient signals captured on tape during rainstorms. Unfinished thoughts left in notebooks resurface unexpectedly months later.",
    tracks: [
      { id: "14-1", name: "Carrier Wave Voice", lyricSnippet: "Underneath the white noise, a low voice calling your first name.", keySignature: "Open D" }
    ],
    inherentTensions: ["Intentional art vs emergent accidental patterns"],
    lineageConnections: [{ targetAlbum: 15, relationType: "descendant", note: "Leads to 12:01 Liturgy" }]
  },
  {
    n: 15,
    title: "The Autodiscography - elevensies;12:01",
    trackCount: 7,
    keys: ["Four Days of Grace", "Very Good Little Yes", "12:01 Liturgy"],
    era: "mythic",
    thesis: "Four Days of Grace. Very good very good little yes hallelu. Time-stamped noon liturgy.",
    fullLore: "Timestamped music created precisely at 12:01 PM over four days of rested grace. Celebrates small assent: the 'little yes'.",
    tracks: [
      { id: "15-1", name: "Very Good Little Yes", lyricSnippet: "Not a grand vow, just a quiet nodding head.", keySignature: "G" },
      { id: "15-2", name: "12:01 Liturgy", lyricSnippet: "Clock ticks past noon, bread is broken on paper.", keySignature: "D" }
    ],
    inherentTensions: ["Grand dramatic gestures vs tiny daily affirmation"],
    lineageConnections: [{ targetAlbum: 24, relationType: "parallel", note: "Every little yes joins static collective" }]
  },
  {
    n: 16,
    title: "The Autodiscography - 21",
    trackCount: 7,
    keys: ["21 Revolutions", "System Init", "70yr Exile / Pouring"],
    era: "mythic",
    thesis: "Ledger / Jubilee Engine. 21 revolutions, system init, 70yr exile, pouring.",
    fullLore: "The formal birth of the Jubilee event ledger concept. 21 revolutions of vinyl symbolizing liberation from exile and restorative accounting.",
    tracks: [
      { id: "16-1", name: "21 Revolutions", lyricSnippet: "Groove runs deep, needle doesn't skip the debt wipe.", keySignature: "Em" },
      { id: "16-2", name: "System Init", lyricSnippet: "Initialize ledger, head hash = zero.", keySignature: "Bm" }
    ],
    inherentTensions: ["Debt & punishment vs Jubilee restoration"],
    lineageConnections: [{ targetAlbum: 26, relationType: "ancestor", note: "Foundation for Jubilee Authority plane" }]
  },
  {
    n: 17,
    title: "The Autodiscography - twelve",
    trackCount: 11,
    keys: ["Compost Heap Travels", "Table Kept Growing", "Tour Table"],
    era: "road",
    thesis: "Table on tour. Compost heap, learning to travel, table kept growing.",
    fullLore: "The kitchen table from Album 5 is loaded onto the back of a flatbed truck and taken on tour across rural venues. More leaves are added as strangers sit down.",
    tracks: [
      { id: "17-1", name: "Table Kept Growing", lyricSnippet: "We added three pine planks in Des Moines.", keySignature: "A" },
      { id: "17-2", name: "Compost Heap Travels", lyricSnippet: "Rich dark soil in a plastic tub behind the amps.", keySignature: "E" }
    ],
    inherentTensions: ["Rooted stability vs nomadic touring"],
    lineageConnections: [{ targetAlbum: 18, relationType: "descendant", note: "Leads to ¿NEXT! hospitality" }]
  },
  {
    n: 18,
    title: "The Autodiscography - ¿NEXT!",
    trackCount: 10,
    keys: ["Still Room For You", "Enough Keeps Happening", "Chair Stayed"],
    era: "mythic",
    thesis: "Hospitality as eschatology. Still room for you, enough keeps happening, chair stayed.",
    fullLore: "Radical welcome. The belief that there is always one more chair that stays empty waiting for whoever walks in off the road.",
    tracks: [
      { id: "18-1", name: "Still Room For You", lyricSnippet: "Set another plate, pull up the wooden bench.", keySignature: "C" },
      { id: "18-2", name: "Chair Stayed", lyricSnippet: "Nobody sat in it all night, but nobody moved it either.", keySignature: "G" }
    ],
    inherentTensions: ["Exhausted limits of space vs open door policy"],
    lineageConnections: [{ targetAlbum: 26, relationType: "ancestor", note: "Table benediction in canon" }]
  },
  {
    n: 19,
    title: "The Autodiscography (Self Writing Code)",
    trackCount: 3,
    keys: ["Base Bloom", "Quantum Co-Delight", "Code Writes Itself"],
    era: "mythic",
    thesis: "Code writes itself. Quantum code, base bloom, co-delight. Shortest, most joyful.",
    fullLore: "A compressed 3-track EP created when generative loops and code compilers matched musical rhythm perfectly. Joyful, light, and mathematical.",
    tracks: [
      { id: "19-1", name: "Base Bloom", lyricSnippet: "Zero turns to one, one turns to blossom.", keySignature: "D" },
      { id: "19-2", name: "Quantum Co-Delight", lyricSnippet: "Entangled strings vibrating at 440 Hertz.", keySignature: "A" }
    ],
    inherentTensions: ["Deterministic code vs organic human delight"],
    lineageConnections: [{ targetAlbum: 20, relationType: "parallel", note: "Counterpoint to Holy Fool wildness" }]
  },
  {
    n: 20,
    title: "US",
    trackCount: 13,
    keys: ["Banana Elf", "Doom Jesus", "Pastor of Funk"],
    era: "holy",
    thesis: "Holy fool. Elf wild, Doom Jesus, Pastor of Funk. Trickster and sacred touch.",
    fullLore: "A wild genre-bending record introducing the Banana Elf persona, Doom Jesus riffs, and heavy funk grooves. Laughing while bowing down.",
    tracks: [
      { id: "20-1", name: "Banana Elf", lyricSnippet: "Yellow shoes in the swamp, singing high falsetto.", keySignature: "E7" },
      { id: "20-2", name: "Pastor of Funk", lyricSnippet: "Preaching beat one on the heavy downbeat.", keySignature: "A7" },
      { id: "20-3", name: "Doom Jesus", lyricSnippet: "Heavy fuzz bass beneath a crown of wild thorn.", keySignature: "C#m" }
    ],
    inherentTensions: ["Irreverent satire vs holy reverence"],
    lineageConnections: [{ targetAlbum: 25, relationType: "parallel", note: "Shares Holy Fool animism with album 25" }]
  },
  {
    n: 21,
    title: "Creep Mode - Juble Early",
    trackCount: 9,
    keys: ["Jubal Early", "Unwed Seeds", "Father Ghost / State"],
    era: "systems",
    thesis: "Systems horror. Jubal Early, unwed seeds, institutional roulette, state says father ghost.",
    fullLore: "Confronts bureaucratic state apparatuses, legal debt machines, and institutional anonymity. Raw, dark, biting acoustic post-punk.",
    tracks: [
      { id: "21-1", name: "Jubal Early", lyricSnippet: "Stamp the document, deny the lineage.", keySignature: "Bm" },
      { id: "21-2", name: "Father Ghost / State", lyricSnippet: "The state seal is pressed in cold wax.", keySignature: "F#m" }
    ],
    inherentTensions: ["Human identity vs legal paper status"],
    lineageConnections: [{ targetAlbum: 22, relationType: "descendant", note: "Pushes into Ditch Season load-in" }]
  },
  {
    n: 22,
    title: "Creep Mode - Ditch Season",
    trackCount: 9,
    keys: ["The Load / Heavy Heavy", "Parking Lot", "Purgatory Shift"],
    era: "systems",
    thesis: "Load in / load out. The load, heavy heavy, parking lot, purgatory shift. Road weary.",
    fullLore: "The physical strain of hauling heavy bass cabinets through wet parking lots after midnight. Working purgatory shifts to pay off gear.",
    tracks: [
      { id: "22-1", name: "The Load / Heavy Heavy", lyricSnippet: "4x12 cab up three flights of concrete stairs.", keySignature: "Em" },
      { id: "22-2", name: "Purgatory Shift", lyricSnippet: "Clocking in at 2 AM under sodium lights.", keySignature: "Am" }
    ],
    inherentTensions: ["Physical exhaustion vs artistic calling"],
    lineageConnections: [{ targetAlbum: 23, relationType: "descendant", note: "Self-titled resolution" }]
  },
  {
    n: 23,
    title: "Creep Mode - self titled",
    trackCount: 12,
    keys: ["Goof in Kitchen of Chaos", "Big Math Brain", "Algebraic Fire / Rap Cadence"],
    era: "creepRaw",
    thesis: "Self-definition. Goof in kitchen of chaos, big math brain, algebraic fire. Rap cadence.",
    fullLore: "An explosive self-portrait blending hyper-fast spoken word, rap cadences, math rock time signatures, and self-deprecating kitchen humor.",
    tracks: [
      { id: "23-1", name: "Goof in Kitchen of Chaos", lyricSnippet: "Spilling garlic salt while solving differential equations.", keySignature: "F" },
      { id: "23-2", name: "Algebraic Fire", lyricSnippet: "X equals the fire we didn't start but won't put out.", keySignature: "Dm" }
    ],
    inherentTensions: ["Hyper-intellectual math vs goofy kitchen chaos"],
    lineageConnections: [{ targetAlbum: 24, relationType: "descendant", note: "Transitions into Daughter's Arc" }]
  },
  {
    n: 24,
    title: "The Autodiscography - The Daughter's Arc",
    trackCount: 7,
    keys: ["Every Little Yes Joins", "Empty Channels Beg", "Static Pulse"],
    era: "road",
    thesis: "Origin of collective. Every little yes joins static, empty channels beg for pulse.",
    fullLore: "How isolated voices joined together through static radio channels to form 'The Static Collective'.",
    tracks: [
      { id: "24-1", name: "Every Little Yes Joins", lyricSnippet: "A thousand whispers tune to the same frequency.", keySignature: "G" },
      { id: "24-2", name: "Static Pulse", lyricSnippet: "The white noise crackles then hums in C major.", keySignature: "C" }
    ],
    inherentTensions: ["Individual isolation vs collective harmony"],
    lineageConnections: [{ targetAlbum: 26, relationType: "ancestor", note: "Feeds directly into canon" }]
  },
  {
    n: 25,
    title: "The Autodiscography - 20(question marks)",
    trackCount: 10,
    keys: ["Spoon Remembers", "Smoke Remembers Shape", "Attention is Enough"],
    era: "holy",
    thesis: "Animism. Spoon remembers, smoke remembers shape, attention is enough.",
    fullLore: "Objects possess memory. The cast iron pan remembers bacon from 1984; the smoke ring remembers the lung that blew it. Simple attention is declared holy.",
    tracks: [
      { id: "25-1", name: "Spoon Remembers", lyricSnippet: "Rusted brass holds the shape of a hundred soups.", keySignature: "D" },
      { id: "25-2", name: "Attention is Enough", lyricSnippet: "You don't need to fix it, just look at it until it breathes.", keySignature: "A" }
    ],
    inherentTensions: ["Fixing / controlling vs witnessing / attending"],
    lineageConnections: [{ targetAlbum: 26, relationType: "ancestor", note: "Spoon & attention in canon" }]
  },
  {
    n: 26,
    title: "The Autodiscograpy - The Pit**START HERE**(or don't)",
    trackCount: 18,
    keys: ["Porch Light (Canon)", "Lemons Litany", "Table Benediction / Whole Myth"],
    era: "canon",
    thesis: "Canon / Greatest hits. Whole mythology in one porch. START HERE.",
    fullLore: "The definitive distillation of the entire 26-album universe. Integrates the porch light, 42 lemons, kitchen table, paper plates, and Jubilee ledger into one unified performance.",
    tracks: [
      { id: "26-1", name: "Porch Light (Canon)", lyricSnippet: "The light stays yellow on the back porch forever.", keySignature: "E" },
      { id: "26-2", name: "Lemons Litany", lyricSnippet: "42 lemons on the bench, one for every year of grace.", keySignature: "A" },
      { id: "26-3", name: "Table Benediction", lyricSnippet: "Sit down stranger, the wood remembers your name.", keySignature: "C" }
    ],
    inherentTensions: ["Complete summary vs living expanding thread"],
    lineageConnections: [
      { targetAlbum: 1, relationType: "ancestor", note: "Binds Creep Raw clean" },
      { targetAlbum: 4, relationType: "ancestor", note: "Binds House Attendance" },
      { targetAlbum: 16, relationType: "ancestor", note: "Binds Jubilee Ledger" },
      { targetAlbum: 20, relationType: "ancestor", note: "Binds Holy Fool wildness" }
    ]
  }
];

export const NEWCOMER_LISTENING_PATH = [
  26, 20, 18, 15, 9, 8, 5, 12, 24, 25, 19, 11, 6, 17, 14, 16, 4, 7, 10, 13, 21, 22, 23, 1, 2, 3
];
