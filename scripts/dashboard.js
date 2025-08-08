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
  itm: "Intimidation",    // fixed typo: "inm" → "itm"
  inv: "Investigation",
  med: "Medicine",
  nat: "Nature",
  prc: "Perception",
  prf: "Performance",
  per: "Persuasion",
  rel: "Religion",       // fixed typo "Religoin" → "Religion"
  slt: "Sleight of Hand",// fixed typo "slt" → "sle"
  ste: "Stealth",
  sur: "Survival"       // fixed typo "sur" → "surv"
}

const playerData = players.map(actor => {
  let skillScores = {};

  for (let skillKey of Object.keys(skills)) {
    const skill = actor.system.skills?.[skillKey];
    if (!skill) {
      skillScores[skillKey] = "N/A";
      continue;
    }
    console.log(skill);

    // Get modifier value (skill.value) — it's the total skill bonus
    const mod = skill.mod ?? skill.modifier ?? 0;

    // Passive perception (and other passive skills) is usually 10 + modifier + other bonuses
    // The D&D5e system stores passive in `skill.passive` — but let's calculate it just in case:
    const passive = skill.passive ?? (10 + mod);
    console.log(mod);
    // Format modifier like +3 or -1
    const modString = (mod >= 0 ? "+" : "") + mod;
    console.log(modString);
    skillScores[skillKey] = `${modString} (${passive})`;
  }

  return {
    id: actor.id,
    name: actor.name,
    skills: skillScores,
  };
});

  console.log(playerData);
  }}
