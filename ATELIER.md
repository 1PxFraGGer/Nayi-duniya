# Atelier — flagship edition

This edition adds a new editorial homepage and a consistent midnight-blue, ivory and copper palette. It preserves the existing service, account and booking routes.

Features:
- Original AI-generated architectural hero image, with a CSS day/evening mood control.
- Staggered headline entrance and scroll-linked image movement.
- Decorative orbital motion with an explicit pause/resume control.
- Sticky desktop journey, responsive layouts, semantic sections, one main landmark, labelled controls and visible keyboard focus.
- Operating-system reduced-motion support and a quiet mode for homepage decorative animations.
- Working catalog search and category navigation using existing API data.

Validation: production build and redesigned-code lint passed. Browser checks covered desktop/mobile rendering, matching mobile card heights, absence of horizontal overflow, scene controls, pause controls and search-to-catalog navigation. Existing booking integration remains subject to the backend limitations in README.md; this visual edition does not certify live server transactions.

The hero visual is illustrative, not a photograph of a completed customer project. Sample service cards in demo mode reuse it for visual testing. Production service images continue to come from your API.

Start with the setup steps in README.md. Styling specific to this edition is in src/experience/atelier.css. Main homepage code is in src/experience/Home.jsx.
