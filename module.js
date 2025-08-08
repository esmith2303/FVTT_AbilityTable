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
  const command = `if (game.user.isGM) { 
    if (!game.statsDashboard) game.statsDashboard = new StatsDashboard();
    game.statsDashboard.render(true);
  } else {
    ui.notifications.warn("Only the GM can open the Stats Dashboard.");
  }`;

  let macro = game.macros.find(m => m.name === macroName && m.author.id === game.user.id);

  if (macro) {
    // update macro's command & image
    await macro.update({ command, img: "icons/svg/statue.svg" });

    // get hotbar mapping
    const hotbar = game.user.getFlag("core", "hotbar") || {};

    // check if macro is already on hotbar
    const isOnHotbar = Object.values(hotbar).includes(macro.id);

    if (!isOnHotbar) {
      const maxSlots = 50;
      let freeSlot = null;
      for (let i = 1; i <= maxSlots; i++) {
        if (!hotbar[i]) {
          freeSlot = i;
          break;
        }
      }
      if (freeSlot !== null) {
        hotbar[freeSlot] = macro.id;
        await game.user.setFlag("core", "hotbar", hotbar);
        console.log(`Assigned existing Stats Dashboard macro to hotbar slot ${freeSlot}`);
      } else {
        console.warn("No free hotbar slots available to assign existing macro.");
      }
    } else {
      console.log("Macro already assigned to hotbar, no changes made.");
    }
  } else {
    // Create macro
    macro = await Macro.create({
      name: macroName,
      type: "script",
      scope: "global",
      command,
      img: "icons/svg/statue.svg"
    });

    // Assign to hotbar
    const hotbar = game.user.getFlag("core", "hotbar") || {};
    const maxSlots = 50;
    let freeSlot = null;
    for (let i = 1; i <= maxSlots; i++) {
      if (!hotbar[i]) {
        freeSlot = i;
        break;
      }
    }
    if (freeSlot !== null) {
      hotbar[freeSlot] = macro.id;
      await game.user.setFlag("core", "hotbar", hotbar);
      console.log(`Created and assigned new Stats Dashboard macro to hotbar slot ${freeSlot}`);
    } else {
      console.warn("No free hotbar slots available for new macro.");
    }
  }
});
