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
  if (!game.user.isGM) return;
  console.log("Stats Dashboard | controls object:", controls);
  console.log("Stats Dashboard | controls keys:", Object.keys(controls));
  console.log("Stats Dashboard | controls values:", Object.values(controls));
  // controls is now a ControlsReference object, not an array.
  // You can use controls.tools to inject custom buttons.
  const tokenControls = controls["tokens"];
  if (tokenControls) {
    tokenControls.tools["stats-dashboard"] = {
      name: "stats-dashboard",
      title: "Combine Player Data",
      icon: "fas fa-chart-line",
      button: true,
      onClick: () => {
        if (!game.statsDashboard) game.statsDashboard = new StatsDashboard();
        game.statsDashboard.render(true);
      }
    };
  }

  console.log("Stats Dashboard | updated tokenControls:", tokenControls);
});