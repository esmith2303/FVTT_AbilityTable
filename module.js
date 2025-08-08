import { StatsDashboard } from "./dashboard.js";

Hooks.once('ready', () => {
  console.log("Creating StatsDashboard instance");
  game.statsDashboard = new StatsDashboard();
});