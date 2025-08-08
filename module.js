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

Hooks.on("getSceneControlButtons", (controls) => {
  // Find the "token" control group
  if (!game.user.isGM) return;
  const tokenControls = controls.find(c => c.name === "token");
  if (tokenControls) {
    tokenControls.tools.push({
      name: "stats-dashboard",
      title: "Combine Player Data",
      icon: "fas fa-chart-line",
      button: true,  // Important: no submenu, single-click button
      onClick: () => {
        if (game.user.isGM) {
          if (!game.statsDashboard) game.statsDashboard = new StatsDashboard();
          game.statsDashboard.render(true);
        } else {
          ui.notifications.warn("Only the GM can open the Stats Dashboard.");
        }
      }
    });
  }
});
