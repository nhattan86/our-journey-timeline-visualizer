<div align="right">
  <a href="README.md"><img src="https://img.shields.io/badge/Language-Tiếng_Việt-lightgrey?style=for-the-badge" alt="Tiếng Việt"></a>
  <a href="README.en.md"><img src="https://img.shields.io/badge/Language-English-2196F3?style=for-the-badge" alt="English"></a>
</div>

# Our Journey - Timeline Visualizer

![Version](https://img.shields.io/badge/version-2.0.0-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-5.2.0-blue?style=for-the-badge)
![Tone.js](https://img.shields.io/badge/Tone.js-15.0.4-orange?style=for-the-badge)
![Test](https://img.shields.io/badge/Formal_Tests-27%2F27_Passed-success?style=for-the-badge)
![Deploy](https://img.shields.io/badge/GitHub_Pages-Live-success?style=for-the-badge)

An interactive web application designed to visualize `.kml` and `.kmz` geographic data into realistic 3D road navigation journeys. Engineered with a **Single-Source Standalone Application** architecture optimized for GitHub Pages, featuring an **Intelligent Map Tile Preloader Engine** and a rigorous **Formal Verification Test Suite** achieving a 100% pass rate.

- **Live Demo on GitHub Pages**: [https://nhattan86.github.io/our-journey-timeline-visualizer/](https://nhattan86.github.io/our-journey-timeline-visualizer/)

---

## Quick Start Guide

### Option 1: Access Online (GitHub Pages)
Visit directly at:
[https://nhattan86.github.io/our-journey-timeline-visualizer/](https://nhattan86.github.io/our-journey-timeline-visualizer/)

The `index.html` entry point automatically redirects to `our-journey.html` with zero latency.

---

### Option 2: Run Locally (Offline Standalone)
Thanks to the standalone zero-dependency architecture:
1. Download or clone the repository:
   ```bash
   git clone https://github.com/nhattan86/our-journey-timeline-visualizer.git
   cd our-journey-timeline-visualizer
   ```
2. Double-click **`our-journey.html`** to open directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari). No Node.js or bundlers required.
3. Click **"Explore Sample Journey"** or **"Change Map"** to upload your custom `.kml` / `.kmz` file.

---

### Option 3: Run via Local Web Server
If you want to develop or run through a local server:
```bash
# Option A: Using Python
python -m http.server 8000

# Option B: Using Node.js serve
npx serve .
```
Open your browser at `http://localhost:8000/our-journey.html`.

---

## Deployment & Automation (Makefile)

The project includes a standard `Makefile` automating verification, builds, and GitHub Pages deployments:

| Target | Description |
| :--- | :--- |
| `make test` | Runs all 27 formal test cases using Node.js Test Runner |
| `make build` | Validates integrity of `our-journey.html` and the `index.html` redirect |
| `make status` | Displays current Git status |
| `make deploy` | Automates: `test` -> `build` -> Stage All (`git add -A`) -> Commit (English) -> Push to `origin main` |
| `make clean` | Cleans temporary scratch files |
| `make help` | Displays list of available make commands |

Example deployment with custom commit message:
```bash
make deploy COMMIT_MSG="feat: improve lookahead caching and update documentation"
```

---

## Formal Verification Test Suite

Built upon **Karl Popper's Falsificationism** philosophy and the **ISO/IEC/IEEE 29119** standard, the verification suite is located in `tests/`:

```bash
# Run complete test suite
npm test

# Or run directly via Node.js native runner
node --test tests/*.test.js
```

Verification Outcome: **27/27 Test Cases Passed (100% Pass) in ~300ms:**
- `TC-GEO-01` to `TC-GEO-07`: Haversine distance, Web Mercator Tile math, Route Corridor calculation, Lookahead vectors.
- `TC-KML-01` to `TC-KML-06`: KML/KMZ Placemark and LineString parsers, XSS prevention, data boundary validations.
- `TC-ROU-01` to `TC-ROU-04`: OSRM chunked routing ($\le 24$ waypoints), API response caching, automatic direct-flight fallback.
- `TC-PRE-01` to `TC-PRE-04`: Multi-layer Tile Preloader, URL resolvers for 4 map providers, Dynamic Lookahead Prefetching.
- `TC-FSM-01` to `TC-FSM-06`: Finite State Machine transitions, scrubbing smoothness, binary search interpolation.

---

## Core Engineering Features

### 1. Intelligent Map Tile Preloader Engine
- **Eliminates gray/blank tile flashes**: Computes Web Mercator $(x, y, z)$ tiles along the route corridor buffer and preloads them into browser HTTP cache via concurrent workers ($\le 6$).
- **Dynamic Lookahead Prefetching**: Predicts camera heading vector during playback and preloads tiles $500\text{m} - 1500\text{m}$ ahead.
- **Clean Progress Badge**: Non-intrusive UI badge displaying real-time preload percentage (`Preloading map: X%`) which auto-hides upon reaching 100% readiness.

### 2. 3D MapLibre GL v5.2.0 WebGL 2.0
- GPU hardware acceleration ensuring steady 60fps rendering at a $45^\circ$ 3D camera pitch.
- Supports 4 reliable map layer sources:
  - **CartoDB Pastel Voyager** (Default): Soft, pleasant pastel palette.
  - **Google Maps**: High-definition street mapping with Vietnamese localization.
  - **ESRI World Street Map**: Dependable global street network without 403 errors.
  - **Mapbox Streets v12**: Support for custom user Access Tokens.

### 3. Vietnam Maritime Sovereignty Markers
- Prominently displays the **Paracel Islands (Hoang Sa)** and **Spratly Islands (Truong Sa)** as inseparable sovereign territory of Vietnam across all map styles.

### 4. Audio & Particle FX System
- Integrated with **Tone.js v15.0.4** generating ambient background generative music via AudioWorklet.
- Supports YouTube Iframe API and custom MP3 streams.
- **Particle Pool Pattern** recycling memory allocations to eliminate Garbage Collection stutter during celebratory fireworks.

---

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Space` | Play / Pause playback |
| `->` (Right Arrow) | Jump to next stop |
| `<-` (Left Arrow) | Jump to previous stop |
| `Home` | Return to starting point |
| `End` | Jump to final destination |
| `Escape` | Close active dialogs (Music, Map Layer, List) |
| `M` | Open background music settings |
| `F` | Toggle fullscreen mode |
| `Left Click + Drag` | Pan map view |
| `Right Click + Drag`| Rotate bearing and pitch in 3D |
| `Mouse Scroll` | Zoom in / out |

---

## Repository Structure

```
our-journey-timeline-visualizer/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions workflow for GitHub Pages
├── .agents/
│   └── rules/
│       └── engineering-rules.md  # Engineering rules and standards
├── scripts/
│   └── build-standalone.js   # Application integrity verification script
├── tests/
│   ├── engine.js             # Mathematical & FSM engine harness for tests
│   ├── geo-math.test.js      # Geographic coordinate & Web Mercator tests
│   ├── kml-parser.test.js    # KML/KMZ parsing & XSS sanitization tests
│   ├── router.test.js        # Route calculation & fallback tests
│   ├── tile-preloader.test.js# Tile Preloader & cache warming tests
│   └── timeline-fsm.test.js  # Timeline FSM state transition tests
├── our-journey.html          # CORE APPLICATION: 100% logic, UI, and 3D engine
├── index.html                # Lightweight 0ms redirect entry point for GitHub Pages
├── Makefile                  # Automated test, build, and deploy pipeline
├── package.json              # Project metadata, test, and build commands
├── rule.md                   # Engineering verification protocol
├── README.md                 # Documentation in Vietnamese
└── README.en.md              # Documentation in English
```

---

## License

This project is licensed under the open-source **MIT License**.

---

<h3 align="center">
  <i>built with love by nhattan ❤️</i>
</h3>
