# Running the design preview

For a local sample-data preview that does not require the backend:

    npm ci
    npm run dev:demo

Open the Local URL printed by Vite. Sample login: demo@example.com, with any nonempty password. This development preview uses sample data and never sends real booking or payment requests.

For real data:

    npm run dev

Set VITE_API_URL in .env to your working backend base URL, including /api if your server uses that prefix. Restart Vite after changing it. Production values must be configured before npm run build, because Vite embeds them at build time.

If the catalog fails, inspect the browser Network panel for /services and /categories. A failed network request may indicate CORS, DNS, TLS, or an unreachable server. The backend must allow your frontend origin, credentialed requests and cookies; a wildcard CORS origin does not work with credentialed requests. HTTP 404 suggests a wrong URL path; HTTP 500 indicates a server failure. A frontend cannot repair an unavailable backend or its CORS policy.

The homepage now avoids duplicate catalog failure panels and distinguishes network failures from server errors. Requests time out after 15 seconds.
