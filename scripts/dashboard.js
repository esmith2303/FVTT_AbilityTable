export class StatsDashboard extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "stats-dashboard",
      title: "Player Stats",
      template: "modules/stats-dashboard/templates/dashboard.html",
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
      if (actor.type === "character" && this.rendered) this.render();
    });
    Hooks.on("createActor", (actor) => {
      if (actor.type === "character" && this.rendered) this.render();
    });
    Hooks.on("deleteActor", (actor) => {
      if (actor.type === "character" && this.rendered) this.render();
    });
  }

  getData() {
    // All character actors
    console.log(game.actors);
    const players = game.actors.filter(a => a.type === "character");

    // List of skills for D&D5e with their ability abbreviations
    const skills = {
        acr: "Acrobatics",
        ani: "Animal Handling",
        arc: "Arcana",
        ath: "Athletics",
        dec: "Deception",
        his: "History",
        ins: "Insight",
        inm: "Intimidation",
        inv: "Investigation",
        med: "Medicine",
        nat: "Nature",
        prc: "Perception",
        prf: "Performance", // duplicate key issue here
        per: "Persuasion", // last one wins
        rel: "Religoin",
        slt: "Slight of Hand",
        ste: "Stealth",
        sur: "Survival"
    };

    return {
      players: players.map(actor => {
        // Prepare skill scores
        let skillScores = {};
        for (let [skill, ability] of Object.entries(skills)) {
          const skillData = actor.system.skills?.[skill].mod;
          const passData  = actor.system.skills?.[skill].passive;
          skillScores[skill] = (skillData != null && passData != null) 
          ? `${skillData}(${passData})`
          : "N/A";
        }

        return {
          id: actor.id,
          name: actor.name,
          skills: skillScores
        };
      }),
      skills: Object.values(skills)
    };
  }
}
