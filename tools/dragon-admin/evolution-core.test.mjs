import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
await import(new URL("../../dragon-evolution-core.js", import.meta.url));

const readJson = async (relativePath) => JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
const graph = await readJson("config/dragon-evolution.json");
const mutation = await readJson("config/dragon-mutation.json");
const skills = await readJson("config/dragon-skills.json");
const core = globalThis.DragonEvolutionCore;

assert.ok(core, "DragonEvolutionCore should be available");
const validation = core.validateEvolutionGraph(graph, mutation, skills);
assert.equal(validation.valid, true, validation.issues.map((issue) => issue.message).join("\n"));
assert.equal(validation.counts.unreachable, 0, "all sample nodes should be reachable");

const dragon = {
  evolutionNodeId: "fire-baby-0001",
  level: 10,
  originalRarity: "C",
  rarity: "C",
  element: "fire",
  careStats: {
    affection: 70,
    mood: 80,
    battleWins: 8,
    foods: { meat: 12, fruit: 9 },
    training: { attack: 50, defense: 20, speed: 42, magic: 20, flight: 38 }
  },
  mutation: { count: 0, resonance: 0, failedChecks: 0, history: [] }
};
const routes = core.getEligibleEvolutionRoutes(graph, dragon);
assert.equal(routes.length, 2, "the sample baby should have two reachable youth routes");
assert.ok(routes.every((route) => route.score > 0));

const simulation = core.simulateEvolution(graph, mutation, skills, {
  runs: 100000,
  startNodeId: "fire-baby-0001",
  originalRarity: "C",
  seed: 6269,
  profile: {
    level: 100,
    affection: 75,
    mood: 80,
    battleWins: 20,
    foods: { meat: 20, fruit: 18 },
    training: { attack: 65, defense: 50, speed: 50, magic: 40, flight: 45 }
  }
});
assert.equal(simulation.runs, 100000);
assert.equal(simulation.completed, 100000, "every configured sample path should reach evolved");
assert.ok(Object.keys(simulation.stageResults.youth).length >= 2, "more than one youth branch should be reachable");
assert.ok(Object.keys(simulation.stageResults.adult).length >= 2, "more than one adult branch should be reachable");
assert.ok(Object.keys(simulation.stageResults.evolved).length >= 3, "more than one final branch should be reachable");
assert.ok(simulation.mutationCount > 0, "mutation should occur in a large simulation");
assert.ok(simulation.finalAwakeningRate > 0, "non-mutated low-rarity runs should awaken");
assert.equal(simulation.averageCultivationHours, 72, "three configured stages at 24 hours should average 72 hours");

const emptyMutationOutcome = core.resolveEvolutionOutcome(graph, mutation, {
  ...dragon,
  evolutionNodeId: "fire-egg-0001",
  stage: "egg"
}, {}, () => 0);
assert.equal(emptyMutationOutcome.ok, true);
assert.equal(emptyMutationOutcome.mutated, false, "empty mutation pools must fall back to the normal target");
assert.equal(emptyMutationOutcome.targetId, "fire-baby-0001");

const invalidGraph = structuredClone(graph);
invalidGraph.nodes.find((node) => node.id === "fire-egg-0001").routes[0].targetId = "fire-adult-0001";
const invalidValidation = core.validateEvolutionGraph(invalidGraph, mutation, skills);
assert.equal(invalidValidation.valid, false, "stage-skipping routes must be rejected");
assert.ok(invalidValidation.issues.some((issue) => issue.code === "non-sequential-route"));

const receiver = { rarity: "SSS", traits: ["devour"], skills: [] };
const donor = {
  skills: [
    { skillId: "skill-flame-burst", level: 1 },
    { skillId: "skill-dragon-ultimate", level: 1 },
    { skillId: "skill-devour", level: 1 }
  ]
};
assert.equal(core.canDragonDevour(receiver, mutation), true);
assert.equal(core.getInheritedSlotLimit(receiver, mutation), 2);
assert.deepEqual(core.getTransferableSkills(donor, skills).map((skill) => skill.skillId), ["skill-flame-burst"]);

const cleanupState = {
  dragons: [{ id: "receiver" }, { id: "donor" }],
  battleTeam: ["donor"],
  homeIsland: { restDragons: ["receiver", "donor"] },
  marketListings: [{ dragonId: "donor" }],
  teams: [{ memberIds: ["donor"] }],
  missions: { targetDragonId: "donor", trackedDragonIds: ["donor"] },
  activeDragonId: "donor",
  selectedRestDragonId: "donor",
  ui: { activeDragonEvolutionId: "donor", dragonDevourDraft: { donorId: "donor" } }
};
const cleanup = core.cleanupDonorReferences(cleanupState, "donor", "receiver");
assert.equal(cleanup.removed, true);
assert.deepEqual(cleanupState.dragons.map((item) => item.id), ["receiver"]);
assert.deepEqual(cleanupState.battleTeam, []);
assert.deepEqual(cleanupState.homeIsland.restDragons, ["receiver"]);
assert.deepEqual(cleanupState.marketListings, []);
assert.deepEqual(cleanupState.teams[0].memberIds, []);
assert.equal(cleanupState.missions.targetDragonId, null);
assert.deepEqual(cleanupState.missions.trackedDragonIds, []);
assert.equal(cleanupState.activeDragonId, "receiver");
assert.equal(cleanupState.selectedRestDragonId, null);

console.log(JSON.stringify({ validation: validation.counts, simulation }, null, 2));
