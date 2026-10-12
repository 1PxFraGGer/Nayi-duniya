import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://serviceapi.wedpictures.in/api",

  timeout: 15000,
  withCredentials: true
});

export default API;

// Opt-in development fixture. Production builds never activate sample data.
if (import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE === "true") {
  const { demoAdapter } = await import("../../tests/demoAdapter.js");
  API.defaults.adapter = demoAdapter;
}

