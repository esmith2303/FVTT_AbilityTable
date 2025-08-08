import { StatsDashboard } from "./scripts/dashboard.js";

Hooks.once('init', () => {
  console.log("Stats Dashboard | Initializing module");
  // Register a global variable to hold the dashboard instance
  window.statsDashboard = null;
});

Hooks.once('ready', () => {
  console.log("Stats Dashboard | Module ready");
  // Optionally you could create and render dashboard here automatically,
  // but better to open via macro so DM controls it.
});
