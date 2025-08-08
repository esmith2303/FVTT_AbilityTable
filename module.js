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
    // Always update macro command & icon
    await macro.update({
      command: command,
      img: "icons/svg/statue.svg"
    });

    // Check if macro is on hotbar anywhere
    const hotbar = game.user.hotbar;
    const macroId = macro.id;
    const isOnHotbar = [...hotbar.entries()].some(([, id]) => id === macroId);

    if (!isOnHotbar) {
      // Assign to next free hotbar slot
      const maxSlots = 50;
      let freeSlot = null;
      for (let i = 1; i <= maxSlots; i++) {
        if (!hotbar.get(i)) {
          freeSlot = i;
          break;
        }
      }
      if (freeSlot !== null) {
        await macro.assignHotbar(freeSlot);
        console.log(`Assigned existing Stats Dashboard macro to hotbar slot ${freeSlot}`);
      } else {
        console.warn("No free hotbar slots available to assign the existing Stats Dashboard macro.");
      }
    } else {
      console.log("Stats Dashboard macro already on hotbar; no action taken.");
    }
  } else {
    // Create macro and assign to next free hotbar slot
    macro = await Macro.create({
      name: macroName,
      type: "script",
      scope: "global",
      command: command,
      img: "icons/svg/statue.svg"
    });

    const hotbar = game.user.hotbar;
    const maxSlots = 50;
    let freeSlot = null;
    for (let i = 1; i <= maxSlots; i++) {
      if (!hotbar.get(i)) {
        freeSlot = i;
        break;
      }
    }
    if (freeSlot !== null) {
      await macro.assignHotbar(freeSlot);
      console.log(`Created and assigned new Stats Dashboard macro to hotbar slot ${freeSlot}`);
    } else {
      console.warn("No free hotbar slots available to assign the new Stats Dashboard macro.");
    }
  }
});