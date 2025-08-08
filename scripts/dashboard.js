export class StatsDashboard extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "stats-dashboard",
      title: "Player Ability Stats",
      template: "modules/FVTT_AbilityTable/templates/dashboard.html",
      width: 700,
      height: "auto",
      resizable: true,
      minimizable: true,
      scrollY: [".table-container"],
    });
  }

  constructor(...args) {
    super(...args);

    // Re-render dashboard whenever actor data changes
    Hooks.on("updateActor", (actor, data, options, userId) => {
      if (actor.data.type === "character" && this.rendered) {
        this.render();
      }
    });

    // Also update when actors are created or deleted
    Hooks.on("createActor", (actor) => {
      if (actor.data.type === "character" && this.rendered) {
        this.render();
      }
    });
    Hooks.on("deleteActor", (actor) => {
      if (actor.data.type === "character" && this.rendered) {
        this.render();
      }
    });
  }

  getData() {
    const players = game.actors.filter(a => a.data.type === "character");

    const data = {
      players: players.map(actor => ({
        id: actor.id,
        name: actor.name,
        abilities: {
          str: actor.data.data.abilities?.str?.value ?? "N/A",
          dex: actor.data.data.abilities?.dex?.value ?? "N/A",
          con: actor.data.data.abilities?.con?.value ?? "N/A",
          int: actor.data.data.abilities?.int?.value ?? "N/A",
          wis: actor.data.data.abilities?.wis?.value ?? "N/A",
          cha: actor.data.data.abilities?.cha?.value ?? "N/A"
        }
      })),
      abilities: ["STR", "DEX", "CON", "INT", "WIS", "CHA"]
    };

    return data;
  }
}
