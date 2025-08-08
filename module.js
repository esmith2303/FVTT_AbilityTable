import { StatsDashboard } from "./scripts/dashboard.js";

Handlebars.registerHelper('keys', function (obj) {
  return Object.keys(obj);
});

Hooks.once('init', () => {
  console.log("Stats Dashboard | Initializing module");
  // Register a global variable to hold the dashboard instance
  window.statsDashboard = null;
});

Hooks.once('ready', () => {
  console.log("Stats Dashboard | Module ready");
  // Expose StatsDashboard class globally so macros can access it
  window.StatsDashboard = StatsDashboard;
});