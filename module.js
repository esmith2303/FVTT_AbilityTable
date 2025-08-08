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

Hooks.on("getSceneControlButtons", controls => {
  controls.push({
    name: "stats-dashboard",
    title: "Stats Dashboard",
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
