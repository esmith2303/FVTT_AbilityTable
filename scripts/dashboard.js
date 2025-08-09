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
    let totalpartycurrency = {
      Platinum:0,
      Gold:0,
      Electrum:0,
      Silver:0,
      Copper:0
    };
    let totalpartygold = 0;
    const validSubstrings = ["karl", "gobb", "odd", "alisker"];
    const players = game.actors.filter(a =>
      a.type === "character" &&
      validSubstrings.some(sub => a.name.toLowerCase().includes(sub))
    );

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

const currency = {
pp: "Platinum",
gp: "Gold",
ep: "Electrum",
sp: "Silver",
cp: "Copper"
}

const currency_conversion = {
  pp : 10,
  gp: 1,
  ep: 0.5,
  sp: 0.1,
  cp: 0.01
}

const playerData = players.map(actor => {
  let skillScores = {};
  let currencyAmounts = {};

  // Process skills
  for (let skillKey of Object.keys(skills)) {
    const skill = actor.system.skills?.[skillKey];
    if (!skill) {
      skillScores[skillKey] = "N/A";
      continue;
    }

    // Get modifier value (skill.value) — it's the total skill bonus
    const mod = skill.mod ?? skill.modifier ?? 0;

    // Passive perception (and other passive skills) is usually 10 + modifier + other bonuses
    // The D&D5e system stores passive in `skill.passive` — but let's calculate it just in case:
    const passive = skill.passive ?? (10 + mod);
    // Format modifier like +3 or -1
    const modString = (mod >= 0 ? "+" : "") + mod;
    const proficiencySymbol = skill.proficient > 0? " ★" : "";

    skillScores[skills[skillKey]] = `${modString} (${passive})${proficiencySymbol}`;
  }
  let goldTotal = 0;
  // Process currency - copy all currency key-values or default to 0
  if (actor.system.currency) {
    for (const [currencyType, amount] of Object.entries(actor.system.currency)) {
      currencyAmounts[currency[currencyType]] = amount ?? 0;
      totalpartycurrency[currency[currencyType]] += currencyAmounts[currency[currencyType]];
      goldTotal += currencyAmounts[currency[currencyType]] * currency_conversion[currencyType];
    }
    currencyAmounts['Total (in Gold)'] = goldTotal;
    totalpartygold += goldTotal;
  }

  return {
    id: actor.id,
    name: actor.name,
    skills: skillScores,
    currency: currencyAmounts,
  };
});

totalpartycurrency['Total (in Gold)'] = totalpartygold;
playerData.sort((a, b) => a.name.localeCompare(b.name));

playerData.push({
  id: "-1",
  name: "Party",
  skills: { },
  currency: totalpartycurrency
});


  return {
    players: playerData
  };
  }
}