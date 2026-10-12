# ServiceHub "Evergreen" redesign

Fresh visual identity: emerald + marigold on sage paper, Bricolage Grotesque (display) and Plus Jakarta Sans (text, loaded from Google Fonts).
Tokens and shared component styles: `src/experience/theme.css`. Homepage layout: `src/experience/home.css`. Route transition: `src/experience/transition.css`.

## Homepage structure
1. Hero with search, real category quick-links and a spotlight service from the API.
2. **All categories** (`CategoryDirectory`): every category returned by `/categories`, in backend order, each linking to `/services/category/:id`.
3. **Category-wise services** (`CategoryServicesSections`): one generated section per category (and per unknown category found on a service), at most 6 cards (`HOME_LIMIT` in `data.js`), 3 columns on desktop, 2 on tablet, 1 on mobile, plus **View All** to the category listing. Empty categories show an empty state. Listing pages show every service.
4. How it works, FAQ (from `/faqs`).

The city chosen in the header filters services the same way the catalog always did; services with no city show everywhere.

## Page transition
`PageTransition.jsx` wraps the routes. Every pathname change (links, programmatic navigation, back/forward) plays a 1000 ms branded cover/hold/reveal. The old page stays mounted until fully covered, the new route is swapped in underneath, and clicks and keyboard are blocked (`inert`) meanwhile. If the destination still reports `aria-busy` after 0.7 s, the overlay holds (max 5 s) rather than exposing a half-loaded page. Query-only changes (search, sort) do not trigger it. Reduced-motion users get fades only.

## Unchanged
API client, auth/location contexts, routes, booking/cart/checkout logic, chatbot, and the service-detail, address and informational pages (re-coloured only).

## Dev sample data
`tests/demoAdapter.js` (opt-in, `VITE_DEMO_MODE=true`, development only) now has 8 categories / 21 services, including a category with no services, to exercise the 6-card cap and empty state.
