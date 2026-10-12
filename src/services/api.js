
import axios from "axios";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://serviceapi.wedpictures.in/api",
  timeout: 15000,
  withCredentials: !DEMO_MODE,
});

// Enable demo data in development and production
if (DEMO_MODE) {
  const { demoAdapter } = await import("../../tests/demoAdapter.js");
  API.defaults.adapter = demoAdapter;
}

export default API;
