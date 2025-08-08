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

  const macroName = "Open Stats Dashboard";
  let macro = game.macros.find(m => m.name === macroName && m.author.id === game.user.id);

  const command = `if (game.user.isGM) { 
    if (!game.statsDashboard) game.statsDashboard = new StatsDashboard();
    game.statsDashboard.render(true);
  } else {
    ui.notifications.warn("Only the GM can open the Stats Dashboard.");
  }`;

  if (macro) {
    // Update macro command & img but keep current hotbar assignment
    await macro.update({
      command: command,
      img: "icons/svg/statue.svg"
    });

    console.log(`Stats Dashboard macro already exists with ID ${macro.id}`);
  } else {
    // Create macro and assign to first free hotbar slot
    macro = await Macro.create({
      name: macroName,
      type: "script",
      scope: "global",
      command: command,
      img: "icons/svg/statue.svg"
    });

    const hotbar = game.user.hotbar;
    const slots = 50;
    let freeSlot = null;

    for (let i = 1; i <= slots; i++) {
      if (!hotbar.has(i)) {
        freeSlot = i;
        break;
      }
    }

    if (freeSlot !== null) {
      await macro.assignHotbar(freeSlot);
      console.log(`Assigned new Stats Dashboard macro to hotbar slot ${freeSlot}`);
    } else {
      console.warn("No free hotbar slots available to assign the new Stats Dashboard macro.");
    }
  }
});