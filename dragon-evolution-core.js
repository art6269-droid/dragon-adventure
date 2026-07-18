(function attachDragonEvolutionCore(root) {
  "use strict";

  const STAGES = ["egg", "baby", "youth", "adult", "evolved"];
  const RARITIES = ["C", "B", "A", "S", "SS", "SSS"];
  const ELEMENTS = ["fire", "water", "wood", "light", "dark"];

  function number(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, number(value, min)));
  }

  function normalizeStage(stage) {
    const value = String(stage || "baby").toLowerCase();
    if (value === "middle") return "youth";
    if (value === "evolve" || value === "evolution") return "evolved";
    return STAGES.includes(value) ? value : "baby";
  }

  function isValidStage(stage) {
    return [...STAGES, "middle", "evolve", "evolution"].includes(String(stage || "").toLowerCase());
  }

  function nextRarity(rarity) {
    const index = RARITIES.indexOf(String(rarity || "C").toUpperCase());
    return RARITIES[Math.min(RARITIES.length - 1, Math.max(0, index) + 1)];
  }

  function normalizeCareStats(value = {}) {
    const training = value.training && typeof value.training === "object" ? value.training : {};
    return {
      affection: number(value.affection),
      mood: clamp(value.mood, 0, 100),
      hungerCare: number(value.hungerCare),
      careMistakes: number(value.careMistakes),
      battleWins: number(value.battleWins),
      battleLosses: number(value.battleLosses),
      foods: value.foods && typeof value.foods === "object" ? { ...value.foods } : {},
      training: {
        attack: number(training.attack),
        defense: number(training.defense),
        speed: number(training.speed),
        magic: number(training.magic),
        flight: number(training.flight)
      },
      items: value.items && typeof value.items === "object" ? { ...value.items } : {},
      locations: Array.isArray(value.locations) ? [...value.locations] : [],
      lastLocation: value.lastLocation || null
    };
  }

  function graphNodes(graph) {
    return Array.isArray(graph?.nodes) ? graph.nodes : [];
  }

  function createNodeMap(graph) {
    return new Map(graphNodes(graph).filter((node) => node?.id).map((node) => [node.id, node]));
  }

  function getEvolutionNode(graph, nodeId) {
    if (!nodeId) return null;
    return graphNodes(graph).find((node) => node.id === nodeId) || null;
  }

  function favoriteFoodTag(dragon) {
    const foods = normalizeCareStats(dragon?.careStats).foods;
    return Object.entries(foods).sort((a, b) => number(b[1]) - number(a[1]))[0]?.[0] || null;
  }

  function metricValue(dragon, key) {
    const care = normalizeCareStats(dragon?.careStats);
    const aliases = {
      attackTraining: care.training.attack,
      defenseTraining: care.training.defense,
      speedTraining: care.training.speed,
      magicTraining: care.training.magic,
      flightTraining: care.training.flight,
      affection: care.affection,
      mood: care.mood,
      hungerCare: care.hungerCare,
      careMistakes: care.careMistakes,
      battleWins: care.battleWins,
      battleLosses: care.battleLosses
    };
    if (Object.prototype.hasOwnProperty.call(aliases, key)) return aliases[key];
    return number(dragon?.[key]);
  }

  function conditionMatches(dragon, key, expected, context = {}) {
    const care = normalizeCareStats(dragon?.careStats);
    if (key === "favoriteFoodTag") return favoriteFoodTag(dragon) === expected;
    if (key === "itemId") return number(care.items[expected] ?? context.items?.[expected]) > 0;
    if (key === "location") return care.lastLocation === expected || care.locations.includes(expected) || context.location === expected;
    if (key === "locations") return (Array.isArray(expected) ? expected : [expected]).includes(care.lastLocation || context.location);
    if (key === "timeWindow") {
      const hour = number(context.hour, new Date().getHours());
      const start = number(expected?.start, 0);
      const end = number(expected?.end, 24);
      return start <= end ? hour >= start && hour < end : hour >= start || hour < end;
    }
    if (key === "requiredItems") {
      return Object.entries(expected || {}).every(([id, count]) => number(care.items[id] ?? context.items?.[id]) >= number(count));
    }
    if (key.endsWith("Max")) return metricValue(dragon, key.slice(0, -3)) <= number(expected);
    if (key.endsWith("Min")) return metricValue(dragon, key.slice(0, -3)) >= number(expected);
    if (typeof expected === "boolean") return Boolean(dragon?.[key]) === expected;
    if (typeof expected === "string" && !Number.isFinite(Number(expected))) return String(dragon?.[key] ?? "") === expected;
    return metricValue(dragon, key) >= number(expected);
  }

  function routeRequirementsMet(dragon, route, context = {}) {
    return Object.entries(route?.requirements || {}).every(([key, value]) => conditionMatches(dragon, key, value, context));
  }

  function scoreEvolutionRoute(dragon, route, context = {}) {
    if (!routeRequirementsMet(dragon, route, context)) return 0;
    let score = Math.max(0.0001, number(route.priorityWeight, 100));
    for (const [key, expected] of Object.entries(route.softConditions || {})) {
      if (conditionMatches(dragon, key, expected, context)) score += number(route.softConditionWeight, 25);
    }
    for (const [key, expected] of Object.entries(route.requirements || {})) {
      if (typeof expected !== "number") continue;
      const actual = metricValue(dragon, key.replace(/(?:Min|Max)$/, ""));
      if (!key.endsWith("Max") && actual > expected) score += Math.min(30, (actual - expected) * 0.35);
    }
    const research = number(context.lineageResearch?.[route.id || route.targetId]);
    score *= 1 + Math.min(number(context.researchBonusCap, 0.12), research * number(context.researchBonusPerPoint, 0.005));
    return Math.max(0.0001, score);
  }

  function getEligibleEvolutionRoutes(graph, dragon, context = {}) {
    const node = getEvolutionNode(graph, dragon?.evolutionNodeId);
    if (!node) return [];
    return (Array.isArray(node.routes) ? node.routes : [])
      .filter((route) => getEvolutionNode(graph, route.targetId) && routeRequirementsMet(dragon, route, context))
      .map((route) => ({ ...route, score: scoreEvolutionRoute(dragon, route, context) }));
  }

  function weightedRandom(items, getWeight = (item) => item.weight, rng = Math.random) {
    const prepared = items.map((item) => ({ item, weight: Math.max(0, number(getWeight(item))) })).filter((entry) => entry.weight > 0);
    const total = prepared.reduce((sum, entry) => sum + entry.weight, 0);
    if (!prepared.length || total <= 0) return null;
    let roll = clamp(rng(), 0, 0.999999999999) * total;
    for (const entry of prepared) {
      roll -= entry.weight;
      if (roll < 0) return entry.item;
    }
    return prepared[prepared.length - 1].item;
  }

  function selectNormalEvolutionTarget(graph, dragon, context = {}, rng = Math.random) {
    const routes = getEligibleEvolutionRoutes(graph, dragon, context);
    const route = weightedRandom(routes, (item) => item.score, rng);
    return route ? { route, targetId: route.targetId, eligibleRoutes: routes } : null;
  }

  function getTendencyLabel(score, maxScore) {
    if (!score || !maxScore) return "極低";
    const ratio = score / maxScore;
    if (ratio >= 0.9) return "很高";
    if (ratio >= 0.7) return "偏高";
    if (ratio >= 0.45) return "普通";
    if (ratio >= 0.2) return "偏低";
    return "極低";
  }

  function getEvolutionTendencies(graph, dragon, context = {}) {
    const node = getEvolutionNode(graph, dragon?.evolutionNodeId);
    const routes = (node?.routes || []).map((route) => ({
      route,
      eligible: routeRequirementsMet(dragon, route, context),
      score: scoreEvolutionRoute(dragon, route, context)
    }));
    const maxScore = Math.max(0, ...routes.map((item) => item.score));
    return routes.sort((a, b) => b.score - a.score).slice(0, 3).map((item) => ({
      routeId: item.route.id || item.route.targetId,
      targetId: item.route.targetId,
      label: item.route.label || item.route.hint || item.route.targetId,
      hint: item.route.hint || "牠的血統仍在沉睡",
      eligible: item.eligible,
      tendency: item.eligible ? getTendencyLabel(item.score, maxScore) : "極低",
      score: item.score
    }));
  }

  function calculateMutationChance(dragon, targetNode, mutationConfig) {
    const rarity = String(dragon?.originalRarity || dragon?.rarity || "C").toUpperCase();
    const stage = normalizeStage(targetNode?.stage);
    const base = number(mutationConfig?.baseChanceByRarity?.[rarity]);
    const multiplier = number(mutationConfig?.stageMultiplier?.[stage], 1);
    const cap = number(mutationConfig?.resonanceCap, 5);
    const resonance = clamp(dragon?.mutation?.resonance, 0, cap);
    return clamp(base * multiplier + resonance, 0, 100);
  }

  function validMutationTargets(graph, route, normalTargetId) {
    const nodeMap = createNodeMap(graph);
    const normal = nodeMap.get(normalTargetId);
    return (Array.isArray(route?.mutationPool) ? route.mutationPool : []).filter((entry) => {
      const target = nodeMap.get(entry.targetId);
      if (!target || !normal) return false;
      if (normalizeStage(target.stage) !== normalizeStage(normal.stage)) return false;
      const normalRarityIndex = RARITIES.indexOf(String(normal.rarity || "C").toUpperCase());
      const targetRarityIndex = RARITIES.indexOf(String(target.rarity || normal.rarity || "C").toUpperCase());
      return targetRarityIndex <= normalRarityIndex + 1;
    });
  }

  function selectMutationTarget(graph, route, normalTargetId, mutationConfig, rng = Math.random) {
    const pool = validMutationTargets(graph, route, normalTargetId);
    return weightedRandom(pool, (entry) => {
      const typeWeight = number(mutationConfig?.resultWeights?.[entry.resultType || entry.type], 1);
      return number(entry.weight, 1) * typeWeight;
    }, rng);
  }

  function resolveEvolutionOutcome(graph, mutationConfig, dragon, context = {}, rng = Math.random) {
    const normal = selectNormalEvolutionTarget(graph, dragon, context, rng);
    if (!normal) return { ok: false, reason: "no-eligible-route", eligibleRoutes: [] };
    const normalTarget = getEvolutionNode(graph, normal.targetId);
    const chance = calculateMutationChance(dragon, normalTarget, mutationConfig);
    const mutationRoll = clamp(rng(), 0, 0.999999999999) * 100;
    let mutationTarget = null;
    if (mutationRoll < chance) {
      mutationTarget = selectMutationTarget(graph, normal.route, normal.targetId, mutationConfig, rng);
    }
    const mutated = Boolean(mutationTarget);
    return {
      ok: true,
      route: normal.route,
      normalTargetId: normal.targetId,
      targetId: mutationTarget?.targetId || normal.targetId,
      mutationType: mutationTarget?.type || mutationTarget?.resultType || null,
      mutationChance: chance,
      mutationRoll,
      mutated,
      eligibleRoutes: normal.eligibleRoutes
    };
  }

  function calculateCareScore(dragon) {
    const care = normalizeCareStats(dragon?.careStats);
    const trainingValues = Object.values(care.training);
    const trainingTotal = trainingValues.reduce((sum, value) => sum + value, 0);
    const nonZero = trainingValues.filter((value) => value > 0);
    const balance = nonZero.length > 1 ? Math.min(...nonZero) / Math.max(...nonZero) : 0;
    return clamp(
      care.affection * 0.25 +
      care.mood * 0.25 +
      Math.min(100, care.battleWins * 5) * 0.2 +
      Math.min(100, trainingTotal) * 0.15 +
      balance * 100 * 0.15 -
      care.careMistakes * 6,
      0,
      100
    );
  }

  function calculateCareGrade(dragon) {
    const score = calculateCareScore(dragon);
    if (score >= 80) return "S";
    if (score >= 65) return "A";
    if (score >= 50) return "B";
    if (score >= 35) return "C";
    return "D";
  }

  function findSkill(skillConfig, skillId) {
    return (Array.isArray(skillConfig?.skills) ? skillConfig.skills : []).find((skill) => skill.id === skillId) || null;
  }

  function selectFinalAwakeningSkill(dragon, skillConfig, rng = Math.random) {
    const grade = ["D", "C", "B", "A", "S"].includes(dragon?.careGradeOverride)
      ? dragon.careGradeOverride
      : calculateCareGrade(dragon);
    const pools = skillConfig?.finalAwakeningPools || {};
    const gradePool = Array.isArray(pools.byCareGrade?.[grade]) ? pools.byCareGrade[grade] : [];
    const elementPool = Array.isArray(pools.byElement?.[dragon?.element]) ? pools.byElement[dragon.element] : [];
    const combined = [...gradePool, ...elementPool].filter((entry) => findSkill(skillConfig, entry.skillId));
    const selected = weightedRandom(combined, (entry) => entry.weight, rng);
    return selected ? { skill: findSkill(skillConfig, selected.skillId), grade } : { skill: null, grade };
  }

  function getTransferableSkills(dragon, skillConfig) {
    const catalog = new Map((skillConfig?.skills || []).map((skill) => [skill.id, skill]));
    return (Array.isArray(dragon?.skills) ? dragon.skills : []).map((owned) => {
      const id = typeof owned === "string" ? owned : owned.skillId || owned.id;
      const template = catalog.get(id) || (typeof owned === "object" ? owned : null);
      return template ? { ...template, ...((typeof owned === "object" && owned) || {}), id, skillId: id } : null;
    }).filter((skill) => skill && skill.transferable !== false && !skill.unique && !skill.ultimate && skill.id !== "skill-devour");
  }

  function canDragonDevour(dragon, mutationConfig = {}) {
    const rarity = String(dragon?.rarity || "C").toUpperCase();
    const traits = Array.isArray(dragon?.traits) ? dragon.traits : [];
    return ["SS", "SSS"].includes(rarity) && (traits.includes("devour") || dragon?.hasDevour === true) && number(mutationConfig?.devour?.inheritedSlots?.[rarity], rarity === "SSS" ? 2 : 1) > 0;
  }

  function getInheritedSlotLimit(dragon, mutationConfig = {}) {
    const rarity = String(dragon?.rarity || "C").toUpperCase();
    return Math.max(0, number(mutationConfig?.devour?.inheritedSlots?.[rarity], rarity === "SSS" ? 2 : rarity === "SS" ? 1 : 0));
  }

  function cleanupDonorReferences(state, donorId, receiverId = null) {
    if (!state || !donorId) return { removed: false };
    const before = Array.isArray(state.dragons) ? state.dragons.length : 0;
    if (Array.isArray(state.dragons)) state.dragons = state.dragons.filter((dragon) => dragon?.id !== donorId);
    if (Array.isArray(state.battleTeam)) state.battleTeam = state.battleTeam.filter((id) => id !== donorId);
    if (Array.isArray(state.homeIsland?.restDragons)) state.homeIsland.restDragons = state.homeIsland.restDragons.filter((id) => id !== donorId);
    if (Array.isArray(state.marketListings)) state.marketListings = state.marketListings.filter((listing) => ![
      listing?.dragonId,
      listing?.donorId,
      listing?.itemId,
      listing?.entityId
    ].includes(donorId));
    for (const teams of [state.teams, state.dragonTeams]) {
      if (!Array.isArray(teams)) continue;
      teams.forEach((team) => {
        if (Array.isArray(team?.memberIds)) team.memberIds = team.memberIds.filter((id) => id !== donorId);
      });
    }
    const scrub = (value, key = "") => {
      if (Array.isArray(value)) {
        if (/dragon/i.test(key)) return value.filter((item) => item !== donorId);
        value.forEach((item) => scrub(item, key));
        return value;
      }
      if (!value || typeof value !== "object") return value;
      Object.entries(value).forEach(([childKey, childValue]) => {
        if (/dragon.*id|target.*dragon/i.test(childKey) && childValue === donorId) value[childKey] = null;
        else value[childKey] = scrub(childValue, childKey);
      });
      return value;
    };
    if (state.missions) state.missions = scrub(state.missions, "missions");
    if (state.activeDragonId === donorId) state.activeDragonId = receiverId;
    for (const key of ["selectedDragonId", "selectedRestDragonId", "trainingDragonId", "missionDragonId"]) {
      if (state[key] === donorId) state[key] = null;
    }
    if (state.ui?.activeDragonEvolutionId === donorId) state.ui.activeDragonEvolutionId = null;
    if (state.ui?.activeDragonDevourId === donorId) state.ui.activeDragonDevourId = receiverId;
    if (state.ui?.dragonDevourDraft?.donorId === donorId) state.ui.dragonDevourDraft.donorId = null;
    return { removed: before > (state.dragons?.length || 0), donorId, receiverId };
  }

  function rarityJumpIsLegal(from, to) {
    const fromIndex = RARITIES.indexOf(String(from || "C").toUpperCase());
    const toIndex = RARITIES.indexOf(String(to || from || "C").toUpperCase());
    return fromIndex >= 0 && toIndex >= 0 && toIndex <= fromIndex + 1;
  }

  function validateEvolutionGraph(graph, mutationConfig = {}, skillConfig = {}) {
    const issues = [];
    const nodes = graphNodes(graph);
    const nodeMap = new Map();
    const skillIds = new Set((skillConfig?.skills || []).map((skill) => skill.id));
    for (const node of nodes) {
      if (!node?.id) {
        issues.push({ level: "error", code: "missing-node-id", message: "進化節點缺少 id" });
        continue;
      }
      if (nodeMap.has(node.id)) issues.push({ level: "error", code: "duplicate-node", nodeId: node.id, message: `重複節點 ${node.id}` });
      nodeMap.set(node.id, node);
      if (!isValidStage(node.stage)) issues.push({ level: "error", code: "invalid-stage", nodeId: node.id, message: `${node.id} 階段無效` });
      if (!RARITIES.includes(String(node.rarity || "").toUpperCase())) issues.push({ level: "error", code: "invalid-rarity", nodeId: node.id, message: `${node.id} 稀有度無效` });
      if (!ELEMENTS.includes(String(node.element || "").toLowerCase())) issues.push({ level: "warning", code: "invalid-element", nodeId: node.id, message: `${node.id} 屬性不在五屬性清單` });
    }
    for (const node of nodes) {
      const routes = Array.isArray(node.routes) ? node.routes : [];
      if (normalizeStage(node.stage) !== "evolved" && routes.length === 0) issues.push({ level: "warning", code: "no-routes", nodeId: node.id, message: `${node.id} 沒有正常進化路線` });
      for (const route of routes) {
        const target = nodeMap.get(route.targetId);
        if (!target) {
          issues.push({ level: "error", code: "missing-target", nodeId: node.id, targetId: route.targetId, message: `${node.id} 指向不存在的 ${route.targetId}` });
          continue;
        }
        const sourceStageIndex = STAGES.indexOf(normalizeStage(node.stage));
        const targetStageIndex = STAGES.indexOf(normalizeStage(target.stage));
        if (targetStageIndex !== sourceStageIndex + 1) {
          issues.push({ level: "error", code: "non-sequential-route", nodeId: node.id, targetId: target.id, message: `${node.id} 必須依序前往下一階段，不能跳階或倒退` });
        }
        if (!rarityJumpIsLegal(node.rarity, target.rarity)) issues.push({ level: "error", code: "illegal-rarity-jump", nodeId: node.id, targetId: target.id, message: `${node.id} 到 ${target.id} 稀有度跳級非法` });
        if (!Array.isArray(route.mutationPool) || route.mutationPool.length === 0) {
          issues.push({ level: "warning", code: "empty-mutation-pool", nodeId: node.id, targetId: target.id, message: `${node.id} → ${target.id} 的 mutationPool 為空，將回到正常進化` });
        }
        for (const mutation of route.mutationPool || []) {
          const mutationNode = nodeMap.get(mutation.targetId);
          if (!mutationNode) issues.push({ level: "error", code: "missing-mutation-target", nodeId: node.id, targetId: mutation.targetId, message: `突變目標 ${mutation.targetId} 不存在` });
          else {
            if (normalizeStage(mutationNode.stage) !== normalizeStage(target.stage)) issues.push({ level: "error", code: "mutation-stage-mismatch", nodeId: node.id, targetId: mutation.targetId, message: `突變目標 ${mutation.targetId} 必須與正常目標同階段` });
            if (!rarityJumpIsLegal(target.rarity, mutationNode.rarity)) issues.push({ level: "error", code: "illegal-mutation-rarity", nodeId: node.id, targetId: mutation.targetId, message: `突變 ${target.id} → ${mutation.targetId} 跳級非法` });
          }
        }
        for (const skillId of route.unlockSkills || []) {
          if (!skillIds.has(skillId)) issues.push({ level: "error", code: "invalid-skill", nodeId: node.id, skillId, message: `路線引用不存在技能 ${skillId}` });
        }
      }
      if (node.mutationSkillId && !skillIds.has(node.mutationSkillId)) issues.push({ level: "error", code: "invalid-mutation-skill", nodeId: node.id, skillId: node.mutationSkillId, message: `${node.id} 引用不存在的突變技能 ${node.mutationSkillId}` });
    }

    const visiting = new Set();
    const visited = new Set();
    function walk(nodeId) {
      if (visiting.has(nodeId)) {
        issues.push({ level: "error", code: "cycle", nodeId, message: `偵測到循環進化：${nodeId}` });
        return;
      }
      if (visited.has(nodeId)) return;
      visiting.add(nodeId);
      const node = nodeMap.get(nodeId);
      for (const route of node?.routes || []) {
        if (nodeMap.has(route.targetId)) walk(route.targetId);
        for (const mutation of route.mutationPool || []) if (nodeMap.has(mutation.targetId)) walk(mutation.targetId);
      }
      visiting.delete(nodeId);
      visited.add(nodeId);
    }
    nodes.forEach((node) => walk(node.id));

    const entryIds = Array.isArray(graph?.entryNodeIds) && graph.entryNodeIds.length
      ? graph.entryNodeIds
      : nodes.filter((node) => normalizeStage(node.stage) === "egg" || normalizeStage(node.stage) === "baby").map((node) => node.id);
    const reachable = new Set();
    const queue = [...entryIds];
    while (queue.length) {
      const id = queue.shift();
      if (reachable.has(id) || !nodeMap.has(id)) continue;
      reachable.add(id);
      const node = nodeMap.get(id);
      for (const route of node.routes || []) {
        queue.push(route.targetId);
        for (const mutation of route.mutationPool || []) queue.push(mutation.targetId);
      }
    }
    nodes.filter((node) => !reachable.has(node.id)).forEach((node) => issues.push({ level: "warning", code: "unreachable", nodeId: node.id, message: `${node.id} 無法從入口節點到達` }));
    for (const pools of Object.values(skillConfig?.finalAwakeningPools?.byCareGrade || {})) {
      if (!Array.isArray(pools) || pools.length === 0) issues.push({ level: "error", code: "empty-awakening-pool", message: "覺醒技能池為空" });
      for (const entry of pools || []) if (!skillIds.has(entry.skillId)) issues.push({ level: "error", code: "invalid-awakening-skill", skillId: entry.skillId, message: `覺醒池引用不存在技能 ${entry.skillId}` });
    }
    for (const [element, pools] of Object.entries(skillConfig?.finalAwakeningPools?.byElement || {})) {
      if (!Array.isArray(pools) || pools.length === 0) issues.push({ level: "warning", code: "empty-element-awakening-pool", element, message: `${element} 屬性覺醒加權池為空，將只使用照顧評級池` });
      for (const entry of pools || []) if (!skillIds.has(entry.skillId)) issues.push({ level: "error", code: "invalid-element-awakening-skill", skillId: entry.skillId, message: `${element} 覺醒池引用不存在技能 ${entry.skillId}` });
    }
    return {
      valid: !issues.some((issue) => issue.level === "error"),
      issues,
      counts: {
        nodes: nodes.length,
        errors: issues.filter((issue) => issue.level === "error").length,
        warnings: issues.filter((issue) => issue.level === "warning").length,
        unreachable: issues.filter((issue) => issue.code === "unreachable").length
      }
    };
  }

  function mulberry32(seed) {
    let value = seed >>> 0;
    return function random() {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ result >>> 15, result | 1);
      result ^= result + Math.imul(result ^ result >>> 7, result | 61);
      return ((result ^ result >>> 14) >>> 0) / 4294967296;
    };
  }

  function simulateEvolution(graph, mutationConfig, skillConfig, options = {}) {
    const runs = Math.min(100000, Math.max(1, Math.floor(number(options.runs, 1000))));
    const startNode = getEvolutionNode(graph, options.startNodeId) || graphNodes(graph).find((node) => normalizeStage(node.stage) === "baby");
    if (!startNode) throw new Error("找不到可模擬的初始節點");
    const rng = mulberry32(number(options.seed, 20260717));
    const profile = options.profile || {};
    const counts = { youth: {}, adult: {}, evolved: {}, mutationTypes: {}, awakeningSkills: {} };
    let mutations = 0;
    let rarityUpgrades = 0;
    let ancientMutations = 0;
    let awakenings = 0;
    let completed = 0;
    let totalSteps = 0;
    let targetHits = 0;

    for (let run = 0; run < runs; run += 1) {
      const dragon = {
        id: `simulation-${run}`,
        evolutionNodeId: startNode.id,
        originalRarity: String(options.originalRarity || startNode.rarity || "C").toUpperCase(),
        rarity: String(options.originalRarity || startNode.rarity || "C").toUpperCase(),
        element: startNode.element,
        stage: normalizeStage(startNode.stage),
        careGradeOverride: ["D", "C", "B", "A", "S"].includes(profile.careGrade) ? profile.careGrade : null,
        level: number(profile.level, 100),
        careStats: normalizeCareStats({
          affection: profile.affection ?? 60,
          mood: profile.mood ?? 70,
          careMistakes: profile.careMistakes ?? 0,
          battleWins: profile.battleWins ?? 20,
          foods: profile.foods || { meat: 20 },
          training: profile.training || { attack: 60, defense: 45, speed: 45, magic: 35, flight: 35 },
          items: profile.items || {},
          lastLocation: profile.location || null
        }),
        mutation: { count: 0, resonance: number(profile.mutationResonance), failedChecks: 0, history: [] },
        skills: []
      };
      let steps = 0;
      while (steps < 10) {
        const current = getEvolutionNode(graph, dragon.evolutionNodeId);
        if (!current || normalizeStage(current.stage) === "evolved") break;
        const outcome = resolveEvolutionOutcome(graph, mutationConfig, dragon, { items: profile.items, location: profile.location }, rng);
        if (!outcome.ok) break;
        const normalTarget = getEvolutionNode(graph, outcome.normalTargetId);
        const target = getEvolutionNode(graph, outcome.targetId);
        if (outcome.mutated) {
          mutations += 1;
          dragon.mutation.count += 1;
          dragon.mutation.resonance = 0;
          counts.mutationTypes[outcome.mutationType] = number(counts.mutationTypes[outcome.mutationType]) + 1;
          if (outcome.mutationType === "ancient") ancientMutations += 1;
          if (RARITIES.indexOf(String(target.rarity).toUpperCase()) > RARITIES.indexOf(String(normalTarget.rarity).toUpperCase())) rarityUpgrades += 1;
        } else {
          dragon.mutation.failedChecks += 1;
          dragon.mutation.resonance = Math.min(number(mutationConfig?.resonanceCap, 5), dragon.mutation.resonance + number(mutationConfig?.resonanceGainPerFailure, 0.5));
        }
        dragon.evolutionNodeId = target.id;
        dragon.stage = normalizeStage(target.stage);
        dragon.rarity = String(target.rarity || dragon.rarity).toUpperCase();
        dragon.element = target.element || dragon.element;
        steps += 1;
        const bucket = counts[dragon.stage];
        if (bucket) bucket[target.id] = number(bucket[target.id]) + 1;
      }
      totalSteps += steps;
      const finalNode = getEvolutionNode(graph, dragon.evolutionNodeId);
      if (normalizeStage(finalNode?.stage) === "evolved") {
        completed += 1;
        if (["C", "B", "A"].includes(dragon.originalRarity) && dragon.mutation.count === 0) {
          const awakening = selectFinalAwakeningSkill(dragon, skillConfig, rng);
          if (awakening.skill) {
            awakenings += 1;
            counts.awakeningSkills[awakening.skill.id] = number(counts.awakeningSkills[awakening.skill.id]) + 1;
          }
        }
      }
      if (options.targetNodeId && dragon.evolutionNodeId === options.targetNodeId) targetHits += 1;
    }

    const mutationChecks = totalSteps || 1;
    const targetRate = options.targetNodeId ? targetHits / runs : 0;
    return {
      runs,
      startNodeId: startNode.id,
      completed,
      completionRate: completed / runs,
      stageResults: counts,
      mutationRate: mutations / mutationChecks,
      mutationCount: mutations,
      rarityUpgradeRate: rarityUpgrades / mutationChecks,
      ancientMutationRate: ancientMutations / mutationChecks,
      finalAwakeningRate: awakenings / runs,
      averageEvolutionSteps: totalSteps / runs,
      averageCultivationHours: totalSteps / runs * Math.max(0, number(profile.cultivationHoursPerStage, 24)),
      targetNodeId: options.targetNodeId || null,
      targetRate,
      averageEggsForTarget: targetRate > 0 ? 1 / targetRate : null,
      unreachableTarget: Boolean(options.targetNodeId && targetHits === 0)
    };
  }

  root.DragonEvolutionCore = Object.freeze({
    STAGES,
    RARITIES,
    ELEMENTS,
    normalizeStage,
    normalizeCareStats,
    getEvolutionNode,
    getEligibleEvolutionRoutes,
    scoreEvolutionRoute,
    selectNormalEvolutionTarget,
    getEvolutionTendencies,
    calculateMutationChance,
    resolveEvolutionOutcome,
    calculateCareScore,
    calculateCareGrade,
    selectFinalAwakeningSkill,
    findSkill,
    getTransferableSkills,
    canDragonDevour,
    getInheritedSlotLimit,
    cleanupDonorReferences,
    weightedRandom,
    validateEvolutionGraph,
    simulateEvolution,
    nextRarity
  });
})(typeof globalThis !== "undefined" ? globalThis : window);
