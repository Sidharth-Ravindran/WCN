# NetLab Matrix — Interactive Cisco Packet Tracer & Python Lab Experiments Showcase

An interactive engineering portfolio and laboratory showcase engineered for Computer Networks (Cisco Packet Tracer) and Python systems programming experiments. Provides interactive network topology maps with animated packet dispatch simulations, in-browser runnable Python sandboxes, Cisco IOS CLI configuration viewers, and downloadable laboratory assets.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product requirements and design parameters were confirmed from your answers:
> - **Primary Domains**: Computer Networks (Cisco Packet Tracer) & Python Labs.
> - **Key Exploration Experience**: Interactive topology viewer with animated packet traversal, live Python code execution console, and downloadable experiment resources (`.pkt` config archives and `.py` scripts).
> - **Visual Identity**: Modern Tech Engineer aesthetic featuring dark slate surfaces (`#0b0f17`), crisp hairline borders (`#1e293b`), terminal emerald/cyan focal accents, and unboxed monospace metadata.

---

### 1. Overview & Core Concept

**NetLab Matrix** transforms conventional static lab manuals and screenshots into a dynamic, interactive laboratory engineering showcase. It serves university evaluators, technical recruiters, and fellow engineers by proving mastery of both network infrastructure and systems programming:

- **Computer Networks Track**:
  - Interactive SVG topology canvas for complex topologies (Inter-VLAN Routing, Multi-Area OSPF, NAT/PAT Edge Gateways, Extended Access Control Lists, and Rapid Spanning Tree Protocol).
  - Packet Tracer Simulation: Visitors can trigger simulated ICMP ping / TCP handshakes and watch packets traverse router and switch hops with interface state inspection.
  - Cisco IOS Command Inspector: Full configuration scripts (`running-config`, interface setups, routing tables) with clean copy, syntax highlights, and search.
- **Python Systems & Networking Track**:
  - In-browser execution environment for networking algorithms (Subnet Calculator & VLSM planner, Distance Vector Routing / Bellman-Ford convergence, Raw Packet Sniffer/Decoder, and Socket Communication protocols).
  - Real-time parameter tweaking with immediate console standard output.
- **Academic & Industry Polish**:
  - Full lab write-ups: Aim, Topology/Architecture, Addressing Tables, Verification Tests (`show ip route`, `traceroute`), and Viva Voce discussion questions.
  - Direct downloads of Cisco configuration files (`.txt`/`.pkt`), Python source scripts (`.py`), and formatted lab report print views.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Hero & Lab Directory**:
   - The visitor lands on a split-screen header showcasing the student's lab credentials, academic profile, and key metrics (10 verified experiments, 2 core disciplines, 100% interactive).
   - An interactive track filter bar (`All Experiments`, `Cisco Packet Tracer`, `Python Systems`) enables instant real-time filtering with tag search.
2. **Experiment Detail & Stage**:
   - Clicking an experiment opens a dedicated dual-zone lab bench:
     - **Zone A (Interactive Stage)**:
       - For Cisco labs: Interactive network topology with zoom/pan, device node status inspection (`Fa0/0`, IP, Subnet), and a "Dispatch Ping / Trace" simulation button that traces packets along cables.
       - For Python labs: Split code editor and interactive standard output terminal with runnable sample test inputs.
     - **Zone B (Lab Manual & Technical Notes)**:
       - Structured lab dossier containing: Aim & Prerequisites, Network Addressing / Variables Table, IOS CLI Commands / Algorithm Flow, and Output Verification logs.
3. **Download & Export**:
   - Quick one-click downloads for raw Cisco configs, Packet Tracer configuration bundles, and Python source files.
   - Clean "Print / Save Lab Sheet" mode for physical submission or academic evaluation.

#### Visual Identity & Theme (Modern Tech Engineer)
- **Palette**:
  - 60% Canvas: Deep slate void (`#090d16` base, `#0f172a` container cards)
  - 30% Structural: Subdued hairline dividers (`#1e293b`), dark terminal panels (`#05080f`)
  - 10% Accent: Vivid terminal emerald (`#10b981`), network cyan (`#06b6d4`), and warning amber (`#f59e0b`)
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans` / `Outfit` with tight tracking.
  - Code & Addressing Tables: `JetBrains Mono` / monospace tabular numerals (`tabular-nums`).
  - Body: Crisp geometric sans (15px, 1.6 line height).
- **Anti-Slop Discipline**:
  - Zero pill enclosures for static metadata: tags like `CCNA Lab · VLAN 10/20 · Completed` use clean unboxed text with typographic dot separators (`·`).
  - Strict Top Bar Contract: 1-line wordmark, 4 clean single-line nav links, and 1 primary action ("Download Lab Kit").
  - No decorative pulsing dots on static text; animation is reserved exclusively for the packet ping traversal and terminal running states.

---

### 3. Key Product Decisions & Trade-Offs

1. **Client-Side Python Engine with In-Browser Execution**:
   - *Chosen Approach*: Client-side execution sandbox supporting core networking algorithm execution, parameter mutation, and deterministic terminal stdout rendering.
   - *Why*: Instant sub-50ms execution speed without requiring backend server execution quotas or external container sandbox latency.
2. **Vector SVG Topology Canvas vs Static Images**:
   - *Chosen Approach*: Custom interactive SVG network topology renderer with device glyphs (Cisco routers, 2960 switches, servers, workstations) and interactive packet pulse paths.
   - *Why*: Allows visitors to click interfaces, view ARP tables, trigger pings, and see packet routing in real time.
3. **Comprehensive Lab Data Model**:
   - *Chosen Approach*: Fully populated, academically rigorous lab experiments covering standard university and CCNA curricula (IP addressing schemes, subnets, interface commands, algorithmic complexities).
   - *Why*: Real educational value rather than dummy "Lorem Ipsum" placeholders.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              NetLab Matrix                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌─────────────────────────────┐                  ┌──────────────────────────────┐
│  Track 1: Cisco Networks    │                  │  Track 2: Python Systems     │
│  - Topology Visualizer      │                  │  - Code Editor / Viewer      │
│  - Packet Traversal Sim     │                  │  - In-Browser Live Runner    │
│  - Cisco IOS CLI Viewer     │                  │  - Dynamic Parameter Inputs  │
│  - .pkt / IOS Config Export │                  │  - Terminal Stdout / Stderr  │
└──────────────┬──────────────┘                  └──────────────┬───────────────┘
               │                                                │
               └───────────────────────┬────────────────────────┘
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │     Curated Lab Data Store        │
                     │  - 10 Comprehensive Experiments  │
                     │  - Full Addressing Tables         │
                     │  - Verified IOS / Python Code     │
                     │  - Viva Voce Questions & Answers  │
                     └───────────────────────────────────┘
```

#### Planned Component Architecture
- `src/data/experiments.ts`: Typed data schema for all 10 experiments, including topology node coordinates, interfaces, addressing tables, Cisco CLI commands, Python code, and viva questions.
- `src/components/Navbar.tsx`: 3-zone clean header (Wordmark, Nav links, Quick action).
- `src/components/HeroSection.tsx`: Profile summary, track highlights, and quick stats row.
- `src/components/ExperimentCard.tsx`: Sleek cards with unboxed metadata, track badge, and interactive preview.
- `src/components/TopologyViewer.tsx`: Interactive SVG canvas with router/switch/host nodes, cable links, interface markers, and animated packet routing.
- `src/components/PythonRunner.tsx`: Code viewer with line numbers, copy button, customizable parameter controls, and live executing terminal output.
- `src/components/CiscoCliViewer.tsx`: Terminal-style IOS command inspector with syntax highlighting and search.
- `src/components/LabManualModal.tsx`: Comprehensive experiment modal with addressing table, step-by-step procedure, verification commands, and viva voce quiz mode.
- `src/components/ExportModal.tsx`: Quick file downloader (`.pkt` configs, `.py` scripts, or printable lab sheet).

---

### Step-by-Step Implementation Sequence
1. Update `metadata.json` and `index.html` with distinctive title and branding.
2. Build typed data layer `src/data/experiments.ts` containing 10 high-fidelity networking and Python experiments.
3. Implement `TopologyViewer.tsx` with animated packet routing, device nodes, and interface details.
4. Implement `PythonRunner.tsx` with live interactive script execution and parameter testing.
5. Implement `CiscoCliViewer.tsx` for IOS CLI exploration.
6. Assemble main view in `src/App.tsx` with track switcher, search/filter, and modal drawers.
7. Verify build with `compile_applet` and perform sanity checks against all anti-slop and accessibility rules.
