// ============================================================================
// LocalStorage Persistence Layer
// ============================================================================

import type {
  LocalWorkspace,
  SkillResponse,
  TeamResponse,
  DeveloperResponse,
  SprintResponse,
  TaskResponse,
  AssignmentResponse,
  PredictionResponse,
} from "./types";

const STORAGE_KEY = "sprintcost_workspace";

const emptyWorkspace = (): LocalWorkspace => ({
  skills: [],
  teams: [],
  developers: [],
  sprints: [],
  tasks: [],
  assignments: [],
  predictions: [],
});

// ============================================================================
// Core Storage Operations
// ============================================================================

export function loadWorkspace(): LocalWorkspace {
  if (typeof window === "undefined") return emptyWorkspace();
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyWorkspace();
    return JSON.parse(raw) as LocalWorkspace;
  } catch {
    return emptyWorkspace();
  }
}

export function saveWorkspace(workspace: LocalWorkspace): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  } catch (err) {
    console.error("Failed to save workspace:", err);
  }
}

export function clearWorkspace(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(STORAGE_KEY);
}

// ============================================================================
// Entity-Specific Operations
// ============================================================================

export function addSkill(skill: SkillResponse): void {
  const workspace = loadWorkspace();
  workspace.skills.push(skill);
  saveWorkspace(workspace);
}

export function addTeam(team: TeamResponse): void {
  const workspace = loadWorkspace();
  workspace.teams.push(team);
  saveWorkspace(workspace);
}

export function addDeveloper(developer: DeveloperResponse): void {
  const workspace = loadWorkspace();
  workspace.developers.push(developer);
  saveWorkspace(workspace);
}

export function addSprint(sprint: SprintResponse): void {
  const workspace = loadWorkspace();
  workspace.sprints.push(sprint);
  saveWorkspace(workspace);
}

export function addTask(task: TaskResponse): void {
  const workspace = loadWorkspace();
  workspace.tasks.push(task);
  saveWorkspace(workspace);
}

export function addAssignment(assignment: AssignmentResponse): void {
  const workspace = loadWorkspace();
  workspace.assignments.push(assignment);
  saveWorkspace(workspace);
}

export function addPrediction(prediction: PredictionResponse): void {
  const workspace = loadWorkspace();
  // Replace existing prediction with same sprintId and type, or add new
  const existingIndex = workspace.predictions.findIndex(
    (p) => p.sprintId === prediction.sprintId && p.predictionType === prediction.predictionType
  );
  
  if (existingIndex >= 0) {
    workspace.predictions[existingIndex] = prediction;
  } else {
    workspace.predictions.push(prediction);
  }
  
  saveWorkspace(workspace);
}

// ============================================================================
// Query Helpers
// ============================================================================

export function getSkills(): SkillResponse[] {
  return loadWorkspace().skills;
}

export function getTeams(): TeamResponse[] {
  return loadWorkspace().teams;
}

export function getDevelopers(): DeveloperResponse[] {
  return loadWorkspace().developers;
}

export function getSprints(): SprintResponse[] {
  return loadWorkspace().sprints;
}

export function getTasks(): TaskResponse[] {
  return loadWorkspace().tasks;
}

export function getAssignments(): AssignmentResponse[] {
  return loadWorkspace().assignments;
}

export function getPredictions(): PredictionResponse[] {
  return loadWorkspace().predictions;
}

export function getPredictionsBySprint(sprintId: number): PredictionResponse[] {
  return loadWorkspace().predictions.filter((p) => p.sprintId === sprintId);
}
