# ServiceHub Evergreen — frontend

This is the revised React customer application from the supplied client.zip. Existing backend service URLs remain configurable; the server and admin application were not included in the archive.

## Run locally

Use Node.js 22.12+ or a compatible newer version. From this folder:

```sh
npm ci
npm run dev
```

Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend API URL. Restart the development server after changing environment values. The original API address remains the fallback. Your API must allow the frontend origin and credentialed requests because authentication uses cookies.

## Safe design preview

For the sample-data preview, start a separate development session with:

```powershell
$env:VITE_DEMO_MODE="true"
npm run dev
```

Use `demo@example.com` and any nonempty password to exercise the sample login. This mode uses an in-memory adapter, makes no real API requests, and displays a sample-data banner. Cart and booking data reset on reload. It is development-only and is removed from production builds. For normal server integration, remove this environment variable or set it to false before starting Vite.

## Build and validate

```sh
npm run build
npm run lint:experience
```

The deployment output is `dist/`. Configure your host to serve `index.html` for client routes such as `/services/2`. `npm run lint` also checks preserved legacy modules; it is separate from the checked redesigned application scope.

## What changed

See `DESIGN.md` for the Evergreen redesign: new identity, all-categories homepage section, per-category 6-card service sections, branded 1 s route transition and restyled inner pages.

## Integration boundaries

This delivery is a frontend, not a replacement backend. Confirm backend response shapes, permissions and business rules in staging before release. In particular, verify wishlist creation, profile updates, booking creation/cancellation and notifications with your server. Service-detail direct booking retains `/bookings`; cart checkout retains `/bookings/customer`. Do not assume these endpoints have identical response formats.

Checkout stores quantity in booking notes because the existing booking contract has no verified quantity field. Server-side totals, quantities, availability, payment, refunds and idempotency require backend support. The UI does not claim to take online payment. A partial or uncertain cart checkout is locked and directs the customer to booking history before another attempt.

The old browser-storage admin screen is not presented as a production admin dashboard. Connect a real, server-authorized admin application separately. Public ratings and service content are read from your API; preview ratings are sample data only.

Older source pages remain for reference but active routes use `src/experience/` plus the retained detail/informational/address pages. Update active routes rather than the previous standalone CategoryServices stylesheet.
