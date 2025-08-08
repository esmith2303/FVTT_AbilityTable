class StatsDashboard extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "stats-dashboard",
      template: "modules/stats-dashboard/templates/dashboard.html",
      title: "Stats Dashboard",
      width: 800,
      height: "auto"
    });
  }

  getData() {
    // Get all player-owned characters
    const characters = game.actors.filter(a => a.hasPlayerOwner);

    // Ability score keys
    const abilities = ["str", "dex", "con", "int", "wis", "cha"];

    // Build table data
    return {
      characters: characters.map(c => ({
        name: c.name,
        abilities: abilities.map(ab => c.system.abilities[ab]?.value ?? "")
      })),
      abilities
    };
  }
}

Hooks.on("ready", () => {
  if (!game.user.isGM) return;

  // Store a global reference
  game.statsDashboard = new StatsDashboard();

  // Auto-create macro for GM
  let macroName = "Open Stats Dashboard";
  let macro = game.macros.find(m => m.name === macroName && m.author.id === game.user.id);
  if (!macro) {
    Macro.create({
      name: macroName,
      type: "script",
      scope: "global",
      command: `if (game.user.isGM) { 
                  if (!game.statsDashboard) game.statsDashboard = new StatsDashboard();
                  game.statsDashboard.render(true);
                } else {
                  ui.notifications.warn("Only the GM can open the Stats Dashboard.");
                }`,
      img: "icons/svg/statue.svg"
    }).then(m => {
      m.assignHotbar(1); // Assign to hotbar slot 1
    });
  }
});