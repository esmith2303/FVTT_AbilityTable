import { StatsDashboard } from "./scripts/dashboard.js";

Handlebars.registerHelper('keys', function (obj) {
  return Object.keys(obj);
});

Hooks.once('init', () => {
  console.log("Stats Dashboard | Initializing module");
  // Register a global variable to hold the dashboard instance
  window.statsDashboard = null;
});

Hooks.once('ready', async () => {
  console.log("Stats Dashboard | Module ready");
  window.StatsDashboard = StatsDashboard;
});

Hooks.on("getSceneControlButtons", (controls, options) => {
  if (!game.user.isGM) return;

  // controls is now a ControlsReference object, not an array.
  // You can use controls.tools to inject custom buttons.
  controls.tools.push({
    name: "stats-dashboard",
    title: "Combine Player Data",
    icon: "fas fa-chart-line",
    button: true,
    onClick: () => {
      if (game.user.isGM) {
        if (!game.statsDashboard) game.statsDashboard = new StatsDashboard();
        game.statsDashboard.render(true);
      } else {
        ui.notifications.warn("Only the GM can open the Stats Dashboard.");
      }
    }
  });
});