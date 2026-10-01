# Rohan Chaudhary — ML Engineer Portfolio

## Product scope
A single-page responsive portfolio for Machine Learning Engineer Rohan Chaudhary. It presents his applied ML / RAG work, skills, technical writing, open-source activity, credentials, and professional contact paths. The site uses the provided reference data as the source of truth for copy, links, stats, projects, and technology list.

## Design direction

- **Design movement:** Neo-industrial editorial — a restrained technical interface with a lab-notebook rhythm, luminous machine accents, and tactile surfaces.
- **Core principles:** (1) Evidence over hype: metrics, stack labels, and source links stay visible. (2) Quiet contrast: near-black canvas, slate structure, one electric signal color. (3) Motion as explanation: 3D orbital geometry and scanning lines suggest models, retrieval, and data flow. (4) Dense but breathable: asymmetric editorial bands instead of a generic centered dashboard.
- **Color philosophy:** Carbon black creates a focused, high-signal field; slate gray carries structure and long-form readability; neon green is the ownable “inference active” color for actions, metrics, and motion.
- **Layout paradigm:** A long-scroll, left-anchored editorial column with numbered section rails and offset modules. The hero pairs text on the left with a floating neural-core visualization on the right; subsequent content alternates split bands and card clusters.
- **Signature elements:** A green “signal” line that connects sections; glassy slate cards with hairline borders; a perspective 3D neural-core made from CSS orbital rings, nodes, and a central inference panel.
- **Interaction philosophy:** Hover and focus states feel like instrument readouts: cards lift by a few pixels, metrics brighten, links reveal a green signal arrow, and buttons show immediate pressed/active feedback. No interaction is decorative without conveying hierarchy.
- **Animation:** Load with a short staggered reveal. Keep the neural core in a slow continuous orbital drift, pulse nodes on offset timings, and use a subtle scanline sweep over visualizations. Respect `prefers-reduced-motion` by freezing transforms and keeping content fully legible.
- **Typography system:** `Space Grotesk` for display and navigation, `IBM Plex Mono` for labels, metrics, metadata, and technical annotations. Headlines are oversized and tight; body copy stays 16–18px with generous line height.
- **Brand essence:** “Applied intelligence, shipped with proof.” For technical teams who care about grounded systems, measurable performance, and readable code. Personality: rigorous, kinetic, direct.
- **Brand voice:** Headlines are declarative and specific; CTAs are action-oriented without hype. Example lines: “Building the layer between raw data and reliable decisions.” / “Inspect the work →”.
- **Wordmark & logo:** A monogram mark formed from a bracket pair `[R]` with a small green signal slash, paired with the wordmark `rohan.exe` in mono.
- **Signature brand color:** `#b7ff3c` — a sharp chartreuse signal used only for active states, key numbers, and inference cues.

## Implementation

- Plain Node static server on port 3000, no external runtime dependencies.
- `index.html` contains the semantic page structure and content sections; `styles.css` owns the responsive visual system and 3D orbital art direction; `app.js` handles nav state, filtering, scroll reveals, contact feedback, and current-year copy.
- Inline SVG icons keep the site self-contained and sharp at any resolution; supplied image URLs are used for the portrait and project cards.
- `public/manus-routes.json` exposes the sole `/` page route to the hosting platform.
- `public/resume.pdf` is generated from the provided reference data so the resume CTA resolves even though no binary was included with the source note.
- `app.config.ts` provides a durable project logo URL for checkpoint metadata.

## Iteration: interactive visual layer

The hero now includes a no-dependency WebGL fragment shader rendered on a canvas behind the existing neural-core DOM art. The shader creates a pointer-reactive field of drifting particles with a green inference glow and is hidden gracefully when WebGL is unavailable.

A persisted `brutal / off` header control toggles a Neo-Brutalist theme: cream paper background, cyan and yellow surfaces, hot-pink signal color, thick black borders, and offset hard shadows. The original dark signal theme remains the default.

The new `Signal Catcher` arcade section is a self-contained 4×4 reflex game. Visitors get a 20-second run, score, streak, target relocation, miss feedback, and a run-complete state. It is intentionally local-only with no tracking or leaderboard.

## Iteration: four switchable design directions

The header now exposes an obvious `design / ...` palette control with four named options: **Cybercore** (default dark shader / green signal system), **Neo-Brutalism** (cream, cyan, yellow, hot-pink, thick borders and hard shadows), **Scrapbook** (paper, dashed ink rules, taped-note yellow, collage rotations), and **Y2K Aesthetic** (midnight violet, chrome-cyan, magenta glow, neon gradients). The selection menu is keyboard-readable, visually lists every option, persists through local storage, and maps the previous `signal` preference to Cybercore for backward compatibility.

## Iteration: arcade expansion and education update

The arcade section now contains a second browser game, **Snake / Vector Route**, alongside Signal Catcher. It supports keyboard arrows plus an on-screen four-button pad, live score and best score persistence, wall/self collision, restart flow, and canvas rendering driven from the active theme CSS variables. Switching Cybercore, Neo-Brutalism, Scrapbook, or Y2K repaints the board to match the active palette.

Education now includes **Resonance Academy**, 10th Matriculation, RBSE Board, Bharatpur, Rajasthan, with a 96% score. The long decorative vertical guide line was removed from the page to keep the layouts cleaner.

## Iteration: Space Math visual system and project physics

Cybercore is now presented as **Space Math**: orbital-grid backgrounds, Kepler/vector labels, cosine/angle/context notation, and measured signal styling. Project cards use pointer-driven 3D tilt physics with depth and theme-specific shadow/glow treatments in Space Math, Neo-Brutalism, Scrapbook, and Y2K.

The GitHub live API experiment was intentionally deferred after the server-side contribution-calendar request proved too slow for a stable preview. The portfolio keeps a complete local contribution visualization and a direct profile link instead of shipping a flaky external request.

## Iteration: Orbit Lab, Web Audio, and Data Console

The arcade now includes **Orbit Lab / Newton 01**, a canvas-based two-body simulation with adjustable gravity, probe launch/restart, live energy/distance/state readouts, orbital trails, and the equation `F = G · m₁m₂ / r²`.

The header includes a user-initiated **sound / on-off** control. Web Audio API generates a low ambient space drone and short click tones without external audio assets; the preference persists locally.

A **Data Console** section lets the owner edit hero headline, description, location, and availability in the browser. Save/reset uses localStorage, while export/import supports JSON handoff for future content updates without editing source files.

## Iteration: visibility recovery and competitive programming spotlight

Restored the original reveal/theme/game runtime after a JavaScript overwrite caused the page body to render as empty space. Added a visible-content fallback so `.reveal` elements remain readable if observers are delayed or unavailable.

Added a dedicated **Competitive Programming / Problem Solving** section with a radar-style algorithm visual, LeetCode Top 25% highlight, daily problem-solving positioning, platform cards, and direct links to LeetCode (`rohan0_9`) and Codeforces (`rohan0_9`). Updated navigation numbering to make the section easy to find.
