# ENGINEERING & VERIFICATION RULES (OUR JOURNEY VISUALIZER)
> Automatically discovered and loaded by Antigravity IDE Customization System.

Please strictly follow the rules defined in `rule.md` at the workspace root:

1. **SINGLE-SOURCE STANDALONE ARCHITECTURE:**
   - `our-journey.html` is the core single-source application file containing 100% of the logic, 3D engine, and UI.
   - `index.html` serves as a lightweight 0ms redirect entry point for GitHub Pages.
   - Do NOT create duplicate source directories like `src/`. Keep the repository clean and maintainable.

2. **STRICT ZERO-ICON ABUSE RULE:**
   - Do NOT use decorative emojis in code, UI elements, `README.md`, or rules.
   - When action icons are technically required, use clean, minimal vector SVGs with `currentColor`.

3. **LEAD QA & POPPERIAN VERIFICATION PHILOSOPHY:**
   - Always act as a Lead QA/Verification Engineer following Karl Popper's Falsificationism philosophy (systematically seeking failure points against specification).
   - Comply with ISTQB / ISO/IEC/IEEE 29119 principles.
   - Every test case must be modeled as a formal mathematical tuple:
     TC = <S_pre, I, E, S_post, O> with independent Test Oracle (O).
   - 100% of test cases (27/27) must pass before any commit.

4. **AUTOMATED DEPLOYMENT PROTOCOL (MAKE DEPLOY):**
   - Always run `make test` and `make build` before deploying.
   - Stage ALL modified and untracked files (`git add -A`) before committing.
   - Commit and push to `origin main` cleanly using `make deploy`.

5. **PRESERVE CORRECT BUSINESS LOGIC:**
   - Never break or delete existing correct business logic (Routing modes Nav/Direct, Sovereignty markers for Hoang Sa & Truong Sa & Bien Dong, Sample Vietnam journey, Audio Tone.js/YouTube, bilingual VI/EN).

6. **PERFORMANCE & TILE PRELOADER ENGINE:**
   - Maintain 60fps performance without gray/blank tile flashing.
   - Always preserve the Tile Preloader Engine (Web Mercator tile math, corridor preloading, lookahead prefetching).
   - Use Particle Pool Pattern for Canvas 2D fireworks to prevent Garbage Collection pauses.
