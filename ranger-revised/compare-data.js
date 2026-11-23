/* Data for compare.html.
   Text markup: ***bold italic***, **bold**, *italic*, [[kind:Name|label]] (shown as plain text).
   A paragraph starting with "- " is a bullet.
   before/after: null means "not in that version" (all new / all removed).
   Features: { name, sub, text: [] }. Spells: { name, level, school, castingTime, ritual, range, components, duration, concentration, text: [], higher }. */
(function () {
  const RAW = {
    skills: ["***Skill Proficiencies.*** Choose 3: Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, or Survival."],
    favoredEnemy: [
      "You always have the [[spell:Hunter's Mark]] spell prepared. You can cast it twice without expending a spell slot, and you regain all expended uses of this ability when you finish a Long Rest.",
      "The number of times you can cast the spell without a spell slot increases when you reach certain Ranger levels, as shown in the Favored Enemy column of the Ranger Features table."
    ],
    deftExplorer: [
      "Thanks to your travels, you gain the following benefits.",
      "***Expertise.*** Choose one of your skill proficiencies with which you lack Expertise. You gain Expertise in that skill.",
      "***Languages.*** You know two languages of your choice from the language tables in chapter 2."
    ],
    subclass: ["You gain a Ranger subclass of your choice: Beast Master, Fey Wanderer, Gloom Stalker, or Hunter. A subclass is a specialization that grants you features at certain Ranger levels."],
    roving: ["Your Speed increases by 10 feet while you aren't wearing Heavy armor. You also have a Climb Speed and a Swim Speed equal to your Speed."],
    expertise: ["Choose two of your skill proficiencies with which you lack Expertise. You gain Expertise in those skills."],
    tireless: [
      "Primal forces now help fuel you on your journeys, granting you the following benefits.",
      "***Temporary Hit Points.*** As a Magic action, you can give yourself a number of Temporary Hit Points equal to 1d8 plus your Wisdom modifier (minimum of 1). You can use this action a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
      "***Decrease Exhaustion.*** Whenever you finish a Short Rest, your Exhaustion level, if any, decreases by 1."
    ],
    relentless: ["Taking damage can't break your Concentration on [[spell:Hunter's Mark]]."],
    veil: ["You invoke spirits of nature to magically hide yourself. As a Bonus Action, you can give yourself the Invisible condition until the end of your next turn. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest."],
    precise: ["You have Advantage on attack rolls against the creature currently marked by your [[spell:Hunter's Mark]]."],
    feral: ["Your connection to the forces of nature grants you Blindsight with a range of 30 feet."],
    foeSlayer: ["The damage die of your [[spell:Hunter's Mark]] is a d10 rather than a d6."]
  };
  const f = (name, level, text) => ({ name, sub: level ? `Level ${level} Ranger Feature` : "Ranger Class Trait", text });

  const sources = [
    {
      id: "rr", name: "Ranger Revised", by: "Your version", color: "#2a6f8f", link: "knack-tree.html", linkLabel: "Knack tree",
      blurb: "Turns the fixed exploration features into Knacks and makes relying on Hunter's Mark less painful.",
      takes: ["Deft Explorer, Roving, Expertise (9) and Nature's Veil, which become Knacks", "Foe Slayer"],
      gives: ["Knacks: about the same budget, plus 1–2 spare picks by level 14", "Hunter's Mark support: Hunter's Instinct, Feral Senses at 5, Hunter's Mind, Relentless Hunter", "Champion of the Wilds"],
      cats: { hm: ["Hunter's Mark", "New Features"], identity: ["Class Identity", "Knacks"] }
    },
    {
      id: "twig", name: "twig Edition", by: "the_twig", color: "#7a3fb0",
      link: "https://docs.google.com/document/d/1goV6vLzliLk1hfv11bJwijSX05WQ5hEcxIrfSMdJxeo/edit?usp=sharing", linkLabel: "twig's document",
      blurb: "Moves power out of subclasses into three base-class identities: Hunter, Beast Master and Trapper.",
      takes: ["Subclasses: Hunter and Beast Master stop being subclasses, and no level-3 damage rider", "A weaker pet", "Favored Enemy, moved to level 2", "Hunter's Mark upgrades at 13, 17 and 20", "Tireless temp HP", "Conjure Woodland Beings"],
      gives: ["Favored Form at 2 and Perfected Form at 10", "Deft Explorer, Roving, Nature's Veil and Feral Senses arrive earlier", "Land's Stride, Greater Nature's Veil, Primal Awareness", "Buffed Ranger spells and about 14 added to the list"],
      note: "Reconstructed from twig's video. The exact wording and numbers are in twig's document.",
      cats: { hm: ["Hunter's Mark", "Favored Form"], identity: ["Class Identity", "Feature Reworks"] }
    },
    {
      id: "tm", name: "Treantmonk", by: "Treantmonk's Temple", color: "#a8572a",
      link: "https://docs.google.com/document/d/11tctNmoKT5Fw35yLKoG0oy9wWlC_nWEqja_atnoe_uY/edit?usp=sharing", linkLabel: "Treantmonk's document",
      blurb: "Keeps every feature and adds to it. Hunter's Mark becomes optional through a new Favored Enemy.",
      takes: ["Free Hunter's Mark casts, which become slot refunds on 2 chosen spells (about equal power)", "Hail of Thorns' 1d10 save becomes an automatic 1d6", "Lightning Arrow's 4d8 + 2d8 saves become an automatic 3d8 + 1d8 (but the attack keeps its damage)"],
      gives: ["Additions to Roving, Tireless, Relentless Hunter, Nature's Veil, Precise Hunter, Feral Senses and Foe Slayer", "Hunter's Mark: longer range, sees invisible targets, and no Concentration from level 3+ slots", "Concentration removed from Ensnaring Strike and Swift Quiver", "Combat boosts deferred to subclasses at levels 7 and 11"],
      note: "Text from Treantmonk's document.",
      cats: { hm: ["Hunter's Mark", "Favored Spells"], identity: ["Class Identity", "Feature Buffs"] }
    }
  ];

  const features = [
    /* ---------------- Ranger Revised: Knacks ---------------- */
    { id: "rr-knacks", source: "rr", group: "knacks", level: 1, change: "new", summary: "A pool of small, invocation-style choices that replaces the fixed exploration features.",
      before: null,
      after: f("Knacks", 1, [
        "In the wild, you have learned bits of primal knowledge, known as Knacks, which bolster your hunting, survival, and tracking skills. At 1st level, you know one Knack of your choice from the list at the end of this class.",
        "Whenever you gain a Ranger level, you can replace one Knack you know with a Knack of your choice, so long as you meet the prerequisites for that Knack. You cannot replace a Knack that is a prerequisite for another Knack you know.",
        "At certain Ranger levels, you learn additional Knacks, as shown in the Knacks Known column of the Ranger table."
      ]) },
    { id: "rr-deft", source: "rr", group: "knacks", level: 2, change: "absorbed", summary: "Becomes the Deft Explorer I Knack, which adds a skill proficiency and drops one language.",
      before: f("Deft Explorer", 2, RAW.deftExplorer),
      after: f("Deft Explorer I (Knack)", 1, [
        "*Removed as a class feature. Its benefits are now the Deft Explorer I Knack:*",
        "***Proficiency.*** Choose one skill with which you lack proficiency. You gain proficiency in that skill.",
        "***Expertise.*** Choose one of your skill proficiencies with which you lack Expertise. You gain Expertise in that skill.",
        "***Languages.*** You know one language of your choice."
      ]) },
    { id: "rr-roving", source: "rr", group: "knacks", level: 6, change: "absorbed", summary: "Split across Strider III (speed), Alpine Adept (climb) and Aquatic Adept (swim).",
      before: f("Roving", 6, RAW.roving),
      after: f("Strider III, Alpine Adept, Aquatic Adept (Knacks)", 6, [
        "*Removed as a class feature. Its benefits are now spread across three Knacks:*",
        "***Strider III.*** You can surmount almost any obstacle that would block your path. Your Speed increases by 10 feet, your movement is unaffected by Difficult Terrain imposed by any spell, magical phenomena, or any other supernatural effect.",
        "***Alpine Adept.*** You are an expert climber. You gain a 30-foot Climb Speed and Resistance to Bludgeoning damage you take from falling. If you already have a Climb Speed, it increases by 10 feet. You gain Expertise in Climb and proficiency in Jump.",
        "***Aquatic Adept.*** You can swim through the water like a native creature of the sea. You gain a Swim Speed of 30 feet, and you can hold your breath for twice as long underwater. If you already have a Swim Speed, it increases by 10 feet. You gain Expertise in Swim and proficiency in Endurance."
      ]),
      note: "Strider III needs Strider I and II. Your Ranger Revised note points this feature at Stalker III, which is Nondetection. The Quick Guide's Strider III is the right one." },
    { id: "rr-expertise", source: "rr", group: "knacks", level: 9, change: "absorbed", summary: "Becomes Deft Explorer II and III: the same 2 expertises, plus 2 proficiencies and 2 languages.",
      before: f("Expertise", 9, RAW.expertise),
      after: f("Deft Explorer II & III (Knacks)", 6, [
        "*Removed as a class feature. Its benefits are now the Deft Explorer II (level 6) and Deft Explorer III (level 9) Knacks, each of which grants:*",
        "***Proficiency.*** Choose one skill with which you lack proficiency. You gain proficiency in that skill.",
        "***Expertise.*** Choose another of your skill proficiencies with which you lack Expertise. You gain Expertise in that skill.",
        "***Languages.*** You know one additional language of your choice."
      ]) },
    { id: "rr-veil", source: "rr", group: "knacks", level: 14, change: "absorbed", summary: "Becomes Stalker II (bonus-action Hide at 3) and Stalker IV (invisible on Hide at 14).",
      before: f("Nature's Veil", 14, RAW.veil),
      after: f("Stalker II & IV (Knacks)", 3, [
        "*Removed as a class feature. Its benefits are now the Stalker II and Stalker IV Knacks:*",
        "***Stalker II (level 3).*** You have learned to hunt your prey while remaining unseen. You can take the Hide action as a Bonus Action on your turn.",
        "***Stalker IV (level 14).*** Your mythic skill allow you to become undetectable. When you take a Hide action, you have the Invisible condition until the start of your next turn. This effect instantly ends if you Cast a Spell, or you attack or force a creature to make an ability check or saving throw."
      ]) },

    /* ---------------- Ranger Revised: Hunter's Mark & capstone ---------------- */
    { id: "rr-instinct", source: "rr", group: "hm", level: 3, change: "new", summary: "Move Hunter's Mark as a Reaction when its target drops, so your Bonus Action stays free.",
      before: null,
      after: f("Hunter's Instinct", 3, ["When a creature marked with your [[spell:Hunter's Mark]] drops to 0 Hit Points or dies before the spell ends, you can take a Reaction to move the mark to another creature you can see within 90 feet."]) },
    { id: "rr-feral5", source: "rr", group: "hm", level: 5, change: "new", summary: "An early Feral Senses: you can't have Disadvantage attacking your marked target.",
      before: null,
      after: f("Feral Senses", 5, ["You hunt with the skills of an apex predator. At 5th level, you can't have Disadvantage on attack rolls against the creature currently marked by your [[spell:Hunter's Mark]]."]) },
    { id: "rr-mind", source: "rr", group: "hm", level: 9, change: "new", summary: "Concentrate on two Ranger spells at once if one of them is Hunter's Mark.",
      before: null,
      after: f("Hunter's Mind", 9, ["You may maintain Concentration on two Ranger spells at once as long as one of the spells is [[spell:Hunter's Mark]]."]) },
    { id: "rr-relentless", source: "rr", group: "hm", level: 13, change: "changed", summary: "Instead of protecting Hunter's Mark, you can drop it to keep your other spell.",
      before: f("Relentless Hunter", 13, RAW.relentless),
      after: f("Relentless Hunter", 13, ["When you fail a Constitution saving throw to maintain Concentration, you can choose to end Concentration on [[spell:Hunter's Mark]] to succeed instead."]) },
    { id: "rr-vicious", source: "rr", group: "hm", level: 17, change: "proposed", summary: "Proposed: replace Advantage with a wider crit range, because Advantage is easy to get.",
      before: f("Precise Hunter", 17, RAW.precise),
      after: f("Vicious Hunter", 17, [
        "Your attack rolls can score a Critical Hit on a roll of 19 or 20 on the d20.",
        "Your attack rolls against the creature currently marked by your [[spell:Hunter's Mark]] can score a Critical Hit on a roll of 18-20 on the d20."
      ]),
      note: "Your note still keeps Precise Hunter and floats this as a replacement. Watch the overlap: Fell-Handed II already gives a 19–20 crit range, and Fell-Handed I's +1 per hit would stack on top of the 18–20." },
    { id: "rr-feral18", source: "rr", group: "hm", level: 18, change: "renamed", summary: "Renamed only, because Feral Senses now arrives at level 5.",
      before: f("Feral Senses", 18, RAW.feral),
      after: f("Improved Feral Senses", 18, RAW.feral) },
    { id: "rr-champion", source: "rr", group: "hm", level: 20, change: "replaced", summary: "+4 Dexterity and Wisdom (max 25) instead of a d10 Hunter's Mark die.",
      before: f("Foe Slayer", 20, RAW.foeSlayer),
      after: f("Champion of the Wilds", 20, ["Your Dexterity and Wisdom scores increase by 4, to a maximum of 25."]) },

    /* ---------------- twig: Favored Form ---------------- */
    { id: "tw-form", source: "twig", group: "form", level: 2, levelFrom: 1, change: "replaced", summary: "Choose Hunter, Beast Master or Trapper at level 2 instead of free Hunter's Mark casts at 1.",
      before: f("Favored Enemy", 1, RAW.favoredEnemy),
      after: f("Favored Form", 2, [
        "At level 2, choose one of the following forms.",
        "***Form of the Hunter.*** You always have the [[spell:Hunter's Mark]] spell prepared. You can cast it without expending a spell slot a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. When the target of your Hunter's Mark drops to 0 Hit Points, you can move the mark to a new creature you can see within range without taking an action, even more than once per turn.",
        "***Form of the Beast Master.*** You gain the Beast Master's Primal Companion, with these changes. You summon it with a 10-minute ritual, which you can perform without a spell slot a number of times equal to your Wisdom modifier (minimum of once) per Long Rest. You can't give up one of your attacks to command it. It has fewer Hit Points, and you don't add your Wisdom modifier to its damage.",
        "***Form of the Trapper.*** You can take the Utilize action, or activate a magic item, as a Bonus Action. When an item you use calls for a saving throw, it uses your spell save DC if that is higher. You can't cast a spell from a magic item with this Bonus Action."
      ]) },
    { id: "tw-perfected", source: "twig", group: "form", level: 10, change: "new", summary: "Upgrades your form: Hunter's Mark without Concentration, a 4th attunement slot, or a pet that attacks twice.",
      before: null,
      after: f("Perfected Form", 10, [
        "The form you chose with Favored Form improves.",
        "***Hunter.*** Your [[spell:Hunter's Mark]] no longer requires Concentration.",
        "***Trapper.*** You can attune to a fourth magic item.",
        "***Beast Master.*** Your Primal Companion can attack twice when it takes the Attack action, and its Hit Point maximum increases. A Beast of the Land or Sea can become Large, letting you ride it, and can take the Disengage action as a Bonus Action. A Beast of the Sky can take the Dodge or Help action as a Bonus Action."
      ]) },
    { id: "tw-subclass", source: "twig", group: "form", level: 3, change: "changed", summary: "New subclass list, each with 2 spells per spell level and no level-3 damage rider.",
      before: f("Ranger Subclass", 3, RAW.subclass),
      after: f("Ranger Subclass", 3, ["You gain a Ranger subclass of your choice: Gloom Stalker, Horizon Walker, Monster Slayer, or Swarmkeeper. A subclass is a specialization that grants you features at certain Ranger levels. Each subclass grants two always-prepared spells per spell level, and its level 3 features are utility features rather than a once-per-turn damage bonus."]) },
    { id: "tw-skills", source: "twig", group: "form", level: 1, change: "changed", summary: "Adds Acrobatics, Medicine and Sleight of Hand to the skill options.",
      before: f("Core Ranger Traits", 0, RAW.skills),
      after: f("Core Ranger Traits", 0, ["***Skill Proficiencies.*** Choose 3: Acrobatics, Animal Handling, Athletics, Insight, Investigation, Medicine, Nature, Perception, Sleight of Hand, Stealth, or Survival."]) },

    /* ---------------- twig: moved & replaced ---------------- */
    { id: "tw-deft", source: "twig", group: "moved", level: 1, levelFrom: 2, change: "moved", summary: "Moved to level 1, with 2 expertises instead of 1.",
      before: f("Deft Explorer", 2, RAW.deftExplorer),
      after: f("Deft Explorer", 1, [
        "Thanks to your travels, you gain the following benefits.",
        "***Expertise.*** Choose two of your skill proficiencies with which you lack Expertise. You gain Expertise in those skills.",
        "***Languages.*** You know two languages of your choice from the language tables in chapter 2."
      ]) },
    { id: "tw-roving", source: "twig", group: "moved", level: 5, levelFrom: 6, change: "moved", summary: "Moved to level 5, so it arrives with Extra Attack like other martials' movement features.",
      before: f("Roving", 6, RAW.roving), after: f("Roving", 5, RAW.roving) },
    { id: "tw-veil", source: "twig", group: "moved", level: 6, levelFrom: 14, change: "moved", summary: "Moved to level 6 as a way to slip away, but it now ends at the start of your next turn.",
      before: f("Nature's Veil", 14, RAW.veil),
      after: f("Nature's Veil", 6, ["You invoke spirits of nature to magically hide yourself. As a Bonus Action, you can give yourself the Invisible condition until the start of your next turn. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest."]) },
    { id: "tw-rapid", source: "twig", group: "moved", level: 10, change: "replaced", summary: "Temp HP removed. Exhaustion and condition recovery happens once per Short Rest, with no action.",
      before: f("Tireless", 10, RAW.tireless),
      after: f("Rapid Recovery", 10, ["Once per Short Rest, at the end of your turn (no action required), your Exhaustion level, if any, decreases by 1, and you recover from certain conditions affecting you."]),
      note: "The list of conditions it ends is in twig's document." },
    { id: "tw-landstride", source: "twig", group: "moved", level: 13, change: "replaced", summary: "Ignore all Difficult Terrain, replacing a Hunter's Mark upgrade.",
      before: f("Relentless Hunter", 13, RAW.relentless),
      after: f("Land's Stride", 13, ["Difficult Terrain costs you no extra movement."]) },
    { id: "tw-feral14", source: "twig", group: "moved", level: 14, change: "new", summary: "An early 10-foot Blindsight that stacks with Blind Fighting.",
      before: null,
      after: f("Feral Senses", 14, ["Your connection to the forces of nature grants you Blindsight with a range of 10 feet. If you already have Blindsight, its range increases by 10 feet instead."]) },
    { id: "tw-greaterveil", source: "twig", group: "moved", level: 17, change: "replaced", summary: "Nothing can see you, attacking doesn't end the veil, and you can veil an ally instead.",
      before: f("Precise Hunter", 17, RAW.precise),
      after: f("Greater Nature's Veil", 17, ["While you have the Invisible condition from Nature's Veil, creatures can't see you even with Blindsight or Truesight, and attacking doesn't end the condition. When you use Nature's Veil, you can give the Invisible condition to an ally you can see instead of yourself."]) },
    { id: "tw-feral18", source: "twig", group: "moved", level: 18, change: "changed", summary: "Blindsight rises to 30 feet, or 40 feet with Blind Fighting.",
      before: f("Feral Senses", 18, RAW.feral),
      after: f("Greater Feral Senses", 18, ["Your Blindsight from Feral Senses increases to 30 feet. If you have the Blind Fighting Fighting Style, it increases to 40 feet instead."]) },
    { id: "tw-primal", source: "twig", group: "moved", level: 20, change: "replaced", summary: "You never have Disadvantage, and nothing has Advantage against you.",
      before: f("Foe Slayer", 20, RAW.foeSlayer),
      after: f("Primal Awareness", 20, ["You can't have Disadvantage on D20 Tests, and creatures can't have Advantage on attack rolls against you. This doesn't cancel your Advantage: if you would have both Advantage and Disadvantage on a roll, you have Advantage."]) },

    /* ---------------- Treantmonk ---------------- */
    { id: "tm-fe", source: "tm", group: "hm", level: 1, change: "changed", summary: "Pick 2 Ranger-only spells and spend uses to refund their slots, so Hunter's Mark is optional.",
      before: f("Favored Enemy", 1, RAW.favoredEnemy),
      after: f("Favored Enemy", 1, [
        "Choose any two spells from the list below that you could select as prepared Ranger spells. Those spells are always prepared for you. When you use a spell slot to cast any of the chosen spells, you may immediately recover the spell slot (no action required) by expending a number of uses of this ability equal to the spell slot level.",
        "You begin with two uses of this ability and the uses increase when you reach certain levels as shown on the Ranger class chart. You recover any expended uses of this ability and may change your selected spells when you complete a Long Rest.",
        "- Ensnaring Strike (level 1)", "- Hail of Thorns (level 1)", "- Hunter's Mark (level 1)", "- Cordon of Arrows (level 2)",
        "- Conjure Barrage (level 3)", "- Lightning Arrow (level 3)", "- Conjure Volley (level 5)", "- Swift Quiver (level 5)"
      ]),
      note: "Six of these eight spells are also reworked. See the Spells section." },
    { id: "tm-relentless", source: "tm", group: "hm", level: 13, change: "changed", summary: "Damage can't break Concentration on any Ranger spell, not just Hunter's Mark.",
      before: f("Relentless Hunter", 13, RAW.relentless),
      after: f("Relentless Hunter", 13, ["Taking damage can't break your Concentration on your Ranger Spells."]) },
    { id: "tm-precise", source: "tm", group: "hm", level: 17, change: "changed", summary: "Advantage on all attack rolls, with no Hunter's Mark needed.",
      before: f("Precise Hunter", 17, RAW.precise),
      after: f("Precise Hunter", 17, ["You have Advantage on attack rolls."]) },
    { id: "tm-foe", source: "tm", group: "hm", level: 20, change: "changed", summary: "Keeps the d10 die. You can also turn a hit into a crit, Wis-mod times per Long Rest.",
      before: f("Foe Slayer", 20, RAW.foeSlayer),
      after: f("Foe Slayer", 20, [...RAW.foeSlayer,
        "When you hit with an attack roll, you may turn the hit into a Critical Hit. You may turn a hit into a Critical Hit a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest."
      ]) },
    { id: "tm-roving", source: "tm", group: "util", level: 6, change: "changed", summary: "Adds Advantage to climb and swim checks, and no travel-pace penalties for the party.",
      before: f("Roving", 6, RAW.roving),
      after: f("Roving", 6, [
        RAW.roving[0] + " You have Advantage on the roll whenever you make a Strength (Athletics) check to Climb or Swim.",
        "You, and creatures of your choice traveling with you, do not suffer penalties for traveling at a Normal or Fast pace."
      ]) },
    { id: "tm-tireless", source: "tm", group: "util", level: 10, change: "changed", summary: "Adds Endurance: spend a Favored Enemy use to avoid exhaustion, and exhaustion hurts half as much.",
      before: f("Tireless", 10, RAW.tireless),
      after: f("Tireless", 10, [...RAW.tireless,
        "***Endurance.*** Whenever you would gain Exhaustion, you may reduce the Exhaustion gained by 1 by expending one use of your Favored Enemy ability. Your D20 Tests are reduced by 1 times your Exhaustion level (instead of 2 times). Your Exhaustion level is halved (rounded down) when determining the amount your Speed is reduced."
      ]) },
    { id: "tm-veil", source: "tm", group: "util", level: 14, change: "changed", summary: "Spend an action to extend it, up to 10 minutes, for scouting.",
      before: f("Nature's Veil", 14, RAW.veil),
      after: f("Nature's Veil", 14, [RAW.veil[0].replace("next turn. ", "next turn. You may extend your Nature's Veil for another round by taking an action to extend it, in which case it lasts until the end of your next turn. You can maintain Nature's Veil for up to 10 minutes. ")]) },
    { id: "tm-feral", source: "tm", group: "util", level: 18, change: "changed", summary: "Blindsight goes from 30 feet to 60 feet.",
      before: f("Feral Senses", 18, RAW.feral),
      after: f("Feral Senses", 18, ["Your connection to the forces of nature grants you Blindsight with a range of 60 feet."]) }
  ];

  // Column each change sits in on the level grid: Hunter's Mark (and whatever a revision
  // turns its budget into) or Class Identity. "cross" marks a Hunter's Mark feature torn out
  // to pay for a Class Identity one; it spans both columns.
  const CAT = {
    hm: ["rr-instinct", "rr-feral5", "rr-mind", "rr-relentless", "rr-vicious",
      "tw-form", "tw-perfected",
      "tm-fe", "tm-relentless", "tm-precise", "tm-foe"],
    cross: ["rr-champion", "tw-landstride", "tw-greaterveil", "tw-primal"]
  };
  features.forEach(it => { it.cat = Object.keys(CAT).find(c => CAT[c].includes(it.id)) || "identity"; });

  const sp = (o) => Object.assign({ ritual: false, concentration: false }, o);
  // 2024 spell text, shared by every revision that changes the spell.
  const S24 = {
    ensnaring: sp({ name: "Ensnaring Strike", level: 1, school: "Conjuration", castingTime: "Bonus Action, which you take immediately after hitting a creature with a weapon", range: "Self", components: "V", duration: "up to 1 minute", concentration: true,
      text: ["As you hit the target, grasping vines appear on it, and it makes a Strength saving throw. A Large or larger creature has Advantage on this save. On a failed save, the target has the Restrained condition until the spell ends. On a successful save, the vines shrivel away, and the spell ends.",
        "While Restrained, the target takes 1d6 Piercing damage at the start of each of its turns. The target or a creature within reach of it can take an action to make a Strength (Athletics) check against your spell save DC. On a success, the spell ends."],
      higher: "The damage increases by 1d6 for each spell slot level above 1." }),
    hail: sp({ name: "Hail of Thorns", level: 1, school: "Conjuration", castingTime: "Bonus Action, which you take immediately after hitting a creature with a Ranged weapon", range: "Self", components: "V", duration: "Instantaneous",
      text: ["As you hit the creature, this spell creates a rain of thorns that sprouts from your Ranged weapon or ammunition. The target of the attack and each creature within 5 feet of it make a Dexterity saving throw, taking 1d10 Piercing damage on a failed save or half as much damage on a successful one."],
      higher: "The damage increases by 1d10 for each spell slot level above 1." }),
    mark: sp({ name: "Hunter's Mark", level: 1, school: "Divination", castingTime: "Bonus Action", range: "90 feet", components: "V", duration: "up to 1 hour", concentration: true,
      text: ["You magically mark one creature you can see within range as your quarry. Until the spell ends, you deal an extra 1d6 Force damage to the target whenever you hit it with an attack roll. You also have Advantage on any Wisdom (Perception or Survival) check you make to find it.",
        "If the target drops to 0 Hit Points before this spell ends, you can take a Bonus Action to move the mark to a new creature you can see within range."],
      higher: "Your Concentration can last longer with a spell slot of level 3–4 (up to 8 hours) or 5+ (up to 24 hours)." }),
    cordon: sp({ name: "Cordon of Arrows", level: 2, school: "Transmutation", castingTime: "Action", range: "Touch", components: "V, S, M (an ornamental braid)", duration: "8 hours",
      text: ["You touch up to four nonmagical Arrows or Bolts and plant them in the ground in your space. Until the spell ends, the ammunition can't be physically uprooted, and whenever a creature other than you enters a space within 30 feet of the ammunition for the first time on a turn or ends its turn there, one piece of ammunition flies up to strike it.",
        "The creature must succeed on a Dexterity saving throw or take 2d4 Piercing damage. The piece of ammunition is then destroyed. The spell ends when none of the ammunition remains planted in the ground.",
        "When you cast this spell, you can designate any creatures you choose, and the spell ignores them."],
      higher: "The amount of ammunition that can be affected increases by two for each spell slot level above 2." }),
    lightning: sp({ name: "Lightning Arrow", level: 3, school: "Transmutation", castingTime: "Bonus Action, which you take immediately after hitting or missing a target with a ranged attack using a weapon", range: "Self", components: "V, S", duration: "Instantaneous",
      text: ["As your attack hits or misses the target, the weapon or ammunition you're using transforms into a lightning bolt. Instead of taking any damage or other effects from the attack, the target takes 4d8 Lightning damage on a hit or half as much damage on a miss. Each creature within 10 feet of the target then makes a Dexterity saving throw, taking 2d8 Lightning damage on a failed save or half as much damage on a successful one.",
        "The weapon or ammunition then returns to its normal form."],
      higher: "The damage for both effects of the spell increases by 1d8 for each spell slot level above 3." }),
    quiver: sp({ name: "Swift Quiver", level: 5, school: "Transmutation", castingTime: "Bonus Action", range: "Self", components: "V, S, M (a Quiver worth 1+ GP)", duration: "up to 1 minute", concentration: true,
      text: ["When you cast the spell and as a Bonus Action until it ends, you can make two attacks with a weapon that fires Arrows or Bolts, such as a Longbow or a Light Crossbow. The spell magically creates the ammunition needed for each attack. Each Arrow or Bolt created by the spell deals damage like a nonmagical piece of ammunition of its kind and disintegrates immediately after it hits or misses."] })
  };
  const spells = [
    /* ---------------- Treantmonk ---------------- */
    { id: "sp-tm-ensnaring", source: "tm", level: 1, change: "changed", summary: "Rebuilt like Wrathful Smite: no Concentration, 1d6 on the hit, no Advantage for big creatures, and an end-of-turn save.",
      before: S24.ensnaring,
      after: sp({ name: "Ensnaring Strike", level: 1, school: "Conjuration", castingTime: "Bonus Action, which you take immediately after hitting a creature with a weapon", range: "Self", components: "V", duration: "1 minute",
        text: ["The target takes an extra 1d6 Piercing damage from the attack as grasping vines appear on it, and it must succeed on a Strength saving throw or have the Restrained condition until the spell ends. At the end of each of its turns, the Restrained target repeats the save, ending the spell on itself on a success."],
        higher: "The damage increases by 1d6 for each spell slot level above 1." }),
      note: "Treantmonk's comparison spell: Wrathful Smite." },
    { id: "sp-tm-hail", source: "tm", level: 1, change: "changed", summary: "Any weapon, and no save: you and your chosen targets take an automatic 1d6 instead of a 1d10 Dexterity save.",
      before: S24.hail,
      after: sp({ name: "Hail of Thorns", level: 1, school: "Conjuration", castingTime: "Bonus Action, which you take immediately after hitting a creature with a weapon", range: "Self", components: "V", duration: "Instantaneous",
        text: ["As you hit the creature, this spell creates a rain of thorns that sprouts from your weapon or ammunition. The target of the attack and each creature of your choice within 5 feet of it take 1d6 Piercing damage."],
        higher: "The damage increases by 1d6 for each spell slot level above 1." }) },
    { id: "sp-tm-mark", source: "tm", level: 1, change: "changed", summary: "150-foot range, Somatic only, sees the target through invisibility, and level 3+ slots drop Concentration.",
      before: S24.mark,
      after: sp({ name: "Hunter's Mark", level: 1, school: "Divination", castingTime: "Bonus Action", range: "150 feet", components: "S", duration: "up to 1 hour", concentration: true,
        text: ["You magically mark one creature within range as your quarry. Until the spell ends, you deal an extra 1d6 Force damage to the target whenever you hit it with an attack roll. For the duration, you see the target if they have the Invisible condition as if they were visible. You also have Advantage on any Wisdom (Survival) check you make to find them.",
          "If the target drops to 0 Hit Points before this spell ends, you can take a Bonus Action to move the mark to a new creature you can see within range."],
        higher: "If you cast this spell using a level 3+ spell slot, the spell doesn't require Concentration and the duration becomes 8 hours. If you use a level 5 spell slot, the spell lasts until you complete a Long Rest." }),
      note: "Treantmonk's comparison spell: Bestow Curse. His document runs the two paragraphs together; they're split here so the diff lines up." },
    { id: "sp-tm-cordon", source: "tm", level: 2, change: "changed", summary: "Can be cast as a Ritual, and no save: each arrow hits for 1d8, which scales with slot level instead of adding arrows.",
      before: S24.cordon,
      after: sp({ name: "Cordon of Arrows", level: 2, school: "Transmutation", castingTime: "Action", ritual: true, range: "Touch", components: "V, S, M (an ornamental braid)", duration: "8 hours",
        text: [S24.cordon.text[0],
          "The creature takes 1d8 Piercing damage. The piece of ammunition is then destroyed. The spell ends when none of the ammunition remains planted in the ground.",
          S24.cordon.text[2]],
        higher: "The damage increases by 1d8 for each spell slot level above 2." }) },
    { id: "sp-tm-lightning", source: "tm", level: 3, change: "changed", summary: "No saves, and the attack keeps its own damage: 3d8 to the target, plus 1d8 to everyone within 10 feet.",
      before: S24.lightning,
      after: sp({ name: "Lightning Arrow", level: 3, school: "Transmutation", castingTime: S24.lightning.castingTime, range: "Self", components: "V, S", duration: "Instantaneous",
        text: ["As your attack hits or misses the target, the weapon or ammunition you're using transforms into a lightning bolt. The target takes 3d8 Lightning damage. Each creature within 10 feet of the target takes 1d8 Lightning damage.",
          "The weapon or ammunition then returns to its normal form."],
        higher: S24.lightning.higher }) },
    { id: "sp-tm-quiver", source: "tm", level: 5, change: "changed", summary: "No longer Concentration. Everything else is unchanged.",
      before: S24.quiver,
      after: sp(Object.assign({}, S24.quiver, { duration: "1 minute", concentration: false })) },

    /* ---------------- twig ---------------- */
    { id: "sp-ensnaring", source: "twig", level: 1, change: "changed", summary: "No Concentration, 1d6 damage on the hit, and escape with an end-of-turn save instead of an action.",
      before: S24.ensnaring,
      after: sp({ name: "Ensnaring Strike", level: 1, school: "Conjuration", castingTime: "Bonus Action, which you take immediately after hitting a creature with a weapon", range: "Self", components: "V", duration: "1 minute",
        text: ["As you hit the target, grasping vines appear on it. The target takes an extra 1d6 Piercing damage from the attack, and it makes a Strength saving throw. A Large or larger creature has Advantage on this save. On a failed save, the target has the Restrained condition until the spell ends. On a successful save, the vines shrivel away, and the spell ends.",
          "While Restrained, the target takes 1d6 Piercing damage at the start of each of its turns. At the end of each of its turns, the target repeats the saving throw, ending the spell on itself on a success."],
        higher: "The initial damage increases by 1d6 for each spell slot level above 1." }) },
    { id: "sp-hail", source: "twig", level: 1, change: "changed", summary: "Works with any weapon, and you choose who the thorns spare.",
      before: S24.hail,
      after: sp({ name: "Hail of Thorns", level: 1, school: "Conjuration", castingTime: "Bonus Action, which you take immediately after hitting a creature with a weapon", range: "Self", components: "V", duration: "Instantaneous",
        text: ["As you hit the creature, this spell creates a rain of thorns that sprouts from your weapon or ammunition. The target of the attack and each creature of your choice within 5 feet of it make a Dexterity saving throw, taking 1d10 Piercing damage on a failed save or half as much damage on a successful one."],
        higher: "The damage increases by 1d10 for each spell slot level above 1." }) },
    { id: "sp-cordon", source: "twig", level: 2, change: "changed", summary: "6 arrows placed within 60 feet, half damage on a save, and a failed save drops Speed to 0.",
      before: S24.cordon,
      after: sp({ name: "Cordon of Arrows", level: 2, school: "Transmutation", castingTime: "Action", range: "60 feet", components: "V, S, M (an ornamental braid)", duration: "8 hours",
        text: ["You plant up to six nonmagical Arrows or Bolts in the ground in unoccupied spaces you choose within range. Until the spell ends, the ammunition can't be physically uprooted, and whenever a creature other than you enters a space within 30 feet of a piece of ammunition for the first time on a turn or ends its turn there, one piece of ammunition flies up to strike it.",
          "The creature makes a Dexterity saving throw, taking 2d4 Piercing damage on a failed save or half as much damage on a successful one. On a failed save, its Speed is also reduced to 0 until the start of its next turn. The piece of ammunition is then destroyed. The spell ends when none of the ammunition remains planted in the ground.",
          S24.cordon.text[2]],
        higher: S24.cordon.higher }),
      note: "The video doesn't cover components or casting at higher levels, so those are shown unchanged." },
    { id: "sp-elemental", source: "twig", level: 3, change: "replaced", summary: "Renamed. Any weapon and any damage type, keeps the weapon's damage, and deals 4d8 in a 15-foot radius.",
      before: S24.lightning,
      after: sp({ name: "Elemental Strike", level: 3, school: "Transmutation", castingTime: "Bonus Action, which you take immediately after hitting or missing a target with an attack using a weapon", range: "Self", components: "V, S", duration: "Instantaneous",
        text: ["As your attack hits or misses the target, the weapon or ammunition you're using surges with elemental power of a damage type you choose. The target takes the attack's normal damage on a hit, and it takes an extra 2d8 damage of the chosen type whether the attack hits or misses. Each creature of your choice within 15 feet of the target then makes a Dexterity saving throw, taking 4d8 damage of the chosen type on a failed save or half as much damage on a successful one.",
          "The weapon or ammunition then returns to its normal form."],
        higher: "The damage for both effects of the spell increases by 1d8 for each spell slot level above 3." }),
      note: "The video doesn't say which damage types you can choose, or what casting at higher levels does. Those parts are shown unchanged or left general." },
    { id: "sp-quiver", source: "twig", level: 5, change: "changed", summary: "No longer Concentration: one Bonus Action, five attacks right away.",
      before: S24.quiver,
      after: sp({ name: "Swift Quiver", level: 5, school: "Transmutation", castingTime: "Bonus Action", range: "Self", components: "V, S, M (a Quiver worth 1+ GP)", duration: "Instantaneous",
        text: ["When you cast the spell, you immediately make five attacks with a weapon that fires Arrows or Bolts, such as a Longbow or a Light Crossbow. The spell magically creates the ammunition needed for each attack. Each Arrow or Bolt created by the spell deals damage like a nonmagical piece of ammunition of its kind and disintegrates immediately after it hits or misses."] }) },
    { id: "sp-cwb", source: "twig", level: 4, change: "removed", summary: "Removed from the Ranger list: too strong alongside Extra Attack and Ranger mobility.",
      before: sp({ name: "Conjure Woodland Beings", level: 4, school: "Conjuration", castingTime: "Action", range: "Self", components: "V, S", duration: "up to 10 minutes", concentration: true,
        text: ["You call forth nature spirits, which flit around you in a 10-foot Emanation for the duration. Whenever the Emanation enters the space of a creature you can see and whenever a creature you can see enters the Emanation or ends its turn there, you can force that creature to make a Wisdom saving throw. The creature takes 5d8 Force damage on a failed save or half as much damage on a successful one. A creature makes this save only once per turn.",
          "In addition, you can take the Disengage action as a Bonus Action for the spell's duration."],
        higher: "The damage increases by 1d8 for each spell slot level above 4." }),
      after: null, afterNote: "Removed from the Ranger spell list.", listOnly: true }
  ];

  // Text of spells a revision adds to the Ranger list (2024 versions), keyed by name.
  const listSpells = Object.fromEntries([
    sp({ name: "Comprehend Languages", level: 1, school: "Divination", castingTime: "Action", ritual: true, range: "Self", components: "V, S, M (a pinch of soot and salt)", duration: "1 hour",
      text: ["For the duration, you understand the literal meaning of any language that you hear or see signed. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text. This spell doesn't decode symbols or secret messages."] }),
    sp({ name: "Detect Evil and Good", level: 1, school: "Divination", castingTime: "Action", range: "Self", components: "V, S", duration: "up to 10 minutes", concentration: true,
      text: ["For the duration, you sense the location of any Aberration, Celestial, Elemental, Fey, Fiend, or Undead within 30 feet of yourself. You also sense whether the Hallow spell is active there and, if so, where.",
        "The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead."] }),
    sp({ name: "Expeditious Retreat", level: 1, school: "Transmutation", castingTime: "Bonus Action", range: "Self", components: "V, S", duration: "up to 10 minutes", concentration: true,
      text: ["You take the Dash action, and until the spell ends, you can take that action again as a Bonus Action."] }),
    sp({ name: "Purify Food and Drink", level: 1, school: "Transmutation", castingTime: "Action", ritual: true, range: "10 feet", components: "V, S", duration: "Instantaneous",
      text: ["You remove poison and rot from nonmagical food and drink in a 5-foot-radius Sphere centered on a point within range."] }),
    sp({ name: "Find Steed", level: 2, school: "Conjuration", castingTime: "Action", range: "30 feet", components: "V, S", duration: "Instantaneous",
      text: ["You summon an otherworldly being that appears as a loyal steed in an unoccupied space of your choice within range. This creature uses the Otherworldly Steed stat block. If you already have a steed from this spell, the steed is replaced by the new one.",
        "The steed resembles a Large, rideable animal of your choice, such as a horse, a camel, a dire wolf, or an elk. Whenever you cast the spell, choose the steed's creature type (Celestial, Fey, or Fiend), which determines certain traits in the stat block.",
        "***Combat.*** The steed is an ally to you and your allies. In combat, it shares your Initiative count, and it functions as a controlled mount while you ride it. If you have the Incapacitated condition, the steed takes its turn immediately after yours and acts independently, focusing on protecting you.",
        "***Disappearance of the Steed.*** The steed disappears if it drops to 0 Hit Points or if you die. When it disappears, it leaves behind anything it was wearing or carrying. If you cast this spell again, you decide whether you summon the steed that disappeared or a different one."],
      higher: "Use the spell slot's level for the spell's level in the stat block." }),
    sp({ name: "See Invisibility", level: 2, school: "Divination", castingTime: "Action", range: "Self", components: "V, S, M (a pinch of talc)", duration: "1 hour",
      text: ["For the duration, you see creatures and objects that have the Invisible condition as if they were visible, and you can see into the Ethereal Plane. Creatures and objects there appear ghostly."] }),
    sp({ name: "Spider Climb", level: 2, school: "Transmutation", castingTime: "Action", range: "Touch", components: "V, S, M (a drop of bitumen and a spider)", duration: "up to 1 hour", concentration: true,
      text: ["Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and along ceilings, while leaving its hands free. The target also gains a Climb Speed equal to its Speed."],
      higher: "You can target one additional creature for each spell slot level above 2." }),
    sp({ name: "Tongues", level: 3, school: "Divination", castingTime: "Action", range: "Touch", components: "V, M (a miniature ziggurat)", duration: "1 hour",
      text: ["This spell grants the creature you touch the ability to understand any spoken or signed language that it hears or sees. Moreover, when the target communicates by speaking or signing, any creature that knows at least one language can understand it if that creature can hear the speech or see the signing."] }),
    sp({ name: "Control Water", level: 4, school: "Transmutation", castingTime: "Action", range: "300 feet", components: "V, S, M (a mixture of water and dust)", duration: "up to 10 minutes", concentration: true,
      text: ["Until the spell ends, you control any water inside an area you choose that is a Cube up to 100 feet on a side, using one of the following effects. As a Magic action on your later turns, you can repeat the same effect or choose a different one.",
        "***Flood.*** The water level of all standing water in the area rises by as much as 20 feet. If you choose a large body of water, you instead create a 20-foot-tall wave that travels across the area and crashes down, carrying Huge or smaller vehicles and possibly capsizing them.",
        "***Part Water.*** You part water in the area and create a trench that extends across it, with walls of water to either side. The trench remains until the spell ends or you choose a different effect.",
        "***Redirect Flow.*** You cause flowing water in the area to move in a direction you choose, even if it has to flow over obstacles, up walls, or in other unlikely directions.",
        "***Whirlpool.*** If the area is at least 50 feet square and 25 feet deep, you create a whirlpool in its center. A creature that starts its turn in the whirlpool or enters it is pulled toward the center and makes a Strength saving throw, taking 2d8 Bludgeoning damage on a failed save or half as much on a success. A creature can swim away with a successful Strength (Athletics) check against your spell save DC."],
      note: "Shortened: each effect has more detail in the rules." }),
    sp({ name: "Giant Insect", level: 4, school: "Conjuration", castingTime: "Action", range: "60 feet", components: "V", duration: "up to 10 minutes", concentration: true,
      text: ["You summon a giant centipede, spider, or wasp (chosen when you cast the spell). It manifests in an unoccupied space you can see within range and uses the Giant Insect stat block. The form you choose determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.",
        "The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger."],
      higher: "Use the spell slot's level for the spell's level in the stat block." }),
    sp({ name: "Stone Shape", level: 4, school: "Transmutation", castingTime: "Action", range: "Touch", components: "V, S, M (soft clay)", duration: "Instantaneous",
      text: ["You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape you like. For example, you could shape a large rock into a weapon, statue, or coffer, or you could make a small passage through a wall that is 5 feet thick. You could also shape a stone door or its frame to seal the door shut. The object you create can have up to two hinges and a latch, but finer mechanical detail isn't possible."] }),
    sp({ name: "Insect Plague", level: 5, school: "Conjuration", castingTime: "Action", range: "300 feet", components: "V, S, M (a locust)", duration: "up to 10 minutes", concentration: true,
      text: ["Swarming locusts fill a 20-foot-radius Sphere centered on a point you choose within range. The Sphere remains for the duration, and its area is Lightly Obscured and Difficult Terrain.",
        "When the swarm appears, each creature in it makes a Constitution saving throw, taking 4d10 Piercing damage on a failed save or half as much damage on a successful one. A creature also makes this save when it enters the spell's area for the first time on a turn or ends its turn there. A creature makes this save only once per turn."],
      higher: "The damage increases by 1d10 for each spell slot level above 5." }),
    sp({ name: "Legend Lore", level: 5, school: "Divination", castingTime: "10 minutes", range: "Self", components: "V, S, M (incense worth 250+ GP, which the spell consumes, and four ivory strips worth 50+ GP each)", duration: "Instantaneous",
      text: ["Name or describe a famous person, place, or object. The spell brings to your mind a brief summary of the significant lore about that famous thing, as described by the GM.",
        "The lore might consist of important details, amusing revelations, or even secret lore that has never been widely known. The more information you already know about the thing, the more precise and detailed the information you receive is. That information is accurate but might be couched in figurative language or poetry, as determined by the GM.",
        "If the famous thing you chose isn't actually famous, you hear sad musical notes played on a trombone, and the spell fails."] }),
    sp({ name: "Mislead", level: 5, school: "Illusion", castingTime: "Action", range: "Self", components: "S", duration: "up to 1 hour", concentration: true,
      text: ["You gain the Invisible condition at the same time that an illusory double of you appears where you are standing. The double lasts for the duration, but the invisibility ends immediately after you make an attack roll, deal damage, or cast a spell.",
        "As a Magic action, you can move the illusory double up to twice your Speed and make it gesture, speak, and behave in whatever way you choose. It is intangible and invulnerable.",
        "You can see through its eyes and hear through its ears as if you were located where it is."] })
  ].map(s => [s.name, s]));

  // Ranger spell list additions/removals, by spell level. A removed spell with an id opens its comparison.
  const spellList = [
    { source: "twig", summary: "14 spells added across levels 1–5, mostly senses, mobility and nature. One removed.",
      levels: {
        1: { added: ["Comprehend Languages", "Detect Evil and Good", "Expeditious Retreat", "Purify Food and Drink"] },
        2: { added: ["Find Steed", "See Invisibility", "Spider Climb"] },
        3: { added: ["Tongues"] },
        4: { added: ["Control Water", "Giant Insect", "Stone Shape"], removed: [{ name: "Conjure Woodland Beings", id: "sp-cwb" }] },
        5: { added: ["Insect Plague", "Legend Lore", "Mislead"] }
      },
      notes: ["Find Steed must be prepared and uses a spell slot, unlike the Paladin's version.", "Conjure Woodland Beings is removed because it's too strong alongside Extra Attack and Ranger mobility."] }
  ];

  const placeholders = [
    { source: "tm", text: "Conjure Barrage and Conjure Volley are unchanged (\"No change necessary\"), but both are on the Favored Enemy list." },
    { source: "rr", text: "Ranger Revised doesn't change any spells. Some Knacks grant spells (Wild Insight, Nature Spirit), and the knack tree covers those." }
  ];

  window.COMPARE = { sources, features, spells, spellList, listSpells, placeholders };
})();
