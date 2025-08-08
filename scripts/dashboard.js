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
    Hooks.on("updateActor", (actor) => {
      if (actor.data.type === "character" && this.rendered) this.render();
    });
    Hooks.on("createActor", (actor) => {
      if (actor.data.type === "character" && this.rendered) this.render();
    });
    Hooks.on("deleteActor", (actor) => {
      if (actor.data.type === "character" && this.rendered) this.render();
    });
  }

  getData() {
    // All character actors
    const players = game.actors.filter(a => a.data.type === "character");

    // List of skills for D&D5e with their ability abbreviations
    const skills = {
      acrobatics: "DEX",
      animalhandling: "WIS",
      arcana: "INT",
      athletics: "STR",
      deception: "CHA",
      history: "INT",
      insight: "WIS",
      intimidation: "CHA",
      investigation: "INT",
      medicine: "WIS",
      nature: "INT",
      perception: "WIS",
      performance: "CHA",
      persuasion: "CHA",
      religion: "INT",
      sleightofhand: "DEX",
      stealth: "DEX",
      survival: "WIS"
    };

    return {
      players: players.map(actor => {
        // Prepare skill scores
        let skillScores = {};
        for (let [skill, ability] of Object.entries(skills)) {
          const skillData = actor.data.data.skills?.[skill];
          skillScores[skill] = skillData?.total ?? "N/A";
        }

        return {
          id: actor.id,
          name: actor.name,
          skills: skillScores
        };
      }),
      skills: Object.keys(skills).map(skill => skill.charAt(0).toUpperCase() + skill.slice(1))
    };
  }
}
