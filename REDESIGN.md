# Reference-inspired redesign

The active React frontend uses a navy, royal blue and amber visual system based on the supplied electrical service and customer portal references. The existing ServiceHub brand and all backend categories are retained.

Changes: responsive navy grid hero; live-catalog quick service selection; displayed catalog prices; Today/Tomorrow preference prefilled on service detail; shared typography, buttons, cards and account navigation styling. No reference file scripts or instructions were executed.

Run: npm ci, then npm run dev. For a preview without real API requests, set VITE_DEMO_MODE=true before npm run dev; sign in with demo@example.com and any nonempty password. Production requires the existing backend and its CORS/cookie configuration.

Verification: production build and experience lint; desktop homepage and service selection checked in the browser. Live booking/payment backend integration is outside this frontend archive.
