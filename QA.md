# Validation record

Checked locally on 7 October 2026 using development sample data:

- Production Vite build completed.
- ESLint passed for the redesigned experience, App and contexts.
- Homepage cards: matching 424 x 408 pixel boxes at the desktop test size.
- Catalog cards: matching 346 x 375 pixel boxes at the desktop test size.
- Mobile catalog: all six cards matched at approximately 343 x 410 pixels; no horizontal page overflow.
- Search reduced the catalog to the matching camera service.
- Login returned to the chosen catalog context; adding a service updated the cart.
- Cart appointment checkout created a sample booking, cleared the booked cart line and showed it in booking history.
- Service details rendered admin HTML inside an automatically sized iframe. Desktop booking column remained sticky at 100 pixels from the top while navigating to details.
- Mobile service detail, page heading and booking access were visually inspected.

These checks use the opt-in in-memory fixture, not the live service backend. Live authentication, real bookings, payments, address/geolocation providers, contact delivery and every legacy page interaction have not been certified. The archive contains no backend to test those against. Full-repository legacy lint is not claimed as passing.
