// ============================================================================
// API Client for Sprint Cost Backend
// ============================================================================

import type {
  SkillCreateRequest,
  SkillResponse,
  TeamCreateRequest,
  TeamResponse,
  DeveloperCreateRequest,
  DeveloperResponse,
  SprintCreateRequest,
  SprintResponse,
  TaskCreateRequest,
  TaskResponse,
  AssignmentCreateRequest,
  AssignmentResponse,
  VelocityResponse,
  AvailabilityResponse,
  SprintFeatureResponse,
  InitialPredictionRequest,
  MidSprintPredictionRequest,
  PredictionResponse,
  ApiErrorResponse,
} from "./types";

// ============================================================================
// Error Handling
// ============================================================================

export class ApiError extends Error {
  constructor(
    public status: number,
    public error: string,
    public details: string[]
  ) {
    super(`${error}: ${details.join(", ")}`);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      throw new ApiError(
        response.status,
        response.statusText,
        ["Failed to parse error response"]
      );
    }
    
    throw new ApiError(
      errorData.status,
      errorData.error,
      errorData.details || []
    );
  }
  
  return response.json();
}

// ============================================================================
// API Methods
// ============================================================================

export async function createSkill(
  request: SkillCreateRequest
): Promise<SkillResponse> {
  const response = await fetch("/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return handleResponse<SkillResponse>(response);
}

export async function createTeam(
  request: TeamCreateRequest
): Promise<TeamResponse> {
  const response = await fetch("/api/teams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return handleResponse<TeamResponse>(response);
}

export async function createDeveloper(
  request: DeveloperCreateRequest
): Promise<DeveloperResponse> {
  const response = await fetch("/api/developers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return handleResponse<DeveloperResponse>(response);
}

export async function createSprint(
  request: SprintCreateRequest
): Promise<SprintResponse> {
  const response = await fetch("/api/sprints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return handleResponse<SprintResponse>(response);
}

export async function createTask(
  request: TaskCreateRequest
): Promise<TaskResponse> {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return handleResponse<TaskResponse>(response);
}

export async function createAssignment(
  request: AssignmentCreateRequest
): Promise<AssignmentResponse> {
  const response = await fetch("/api/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return handleResponse<AssignmentResponse>(response);
}

export async function getTeamVelocity(teamId: number): Promise<VelocityResponse> {
  const response = await fetch(`/api/teams/${teamId}/velocity`);
  return handleResponse<VelocityResponse>(response);
}

export async function getDeveloperAvailability(
  developerId: number,
  sprintId: number
): Promise<AvailabilityResponse> {
  const response = await fetch(
    `/api/developers/${developerId}/availability?sprintId=${sprintId}`
  );
  return handleResponse<AvailabilityResponse>(response);
}

export async function getSprintFeatures(
  sprintId: number,
  snapshotDate?: string
): Promise<SprintFeatureResponse> {
  const url = snapshotDate
    ? `/api/sprints/${sprintId}/features?snapshotDate=${snapshotDate}`
    : `/api/sprints/${sprintId}/features`;
  
  const response = await fetch(url);
  return handleResponse<SprintFeatureResponse>(response);
}

export async function createInitialPrediction(
  request: InitialPredictionRequest
): Promise<PredictionResponse> {
  const response = await fetch("/api/predictions/initial", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return handleResponse<PredictionResponse>(response);
}

export async function createMidSprintPrediction(
  request: MidSprintPredictionRequest
): Promise<PredictionResponse> {
  const response = await fetch("/api/predictions/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return handleResponse<PredictionResponse>(response);
}

export async function getPredictionsBySprint(
  sprintId: number
): Promise<PredictionResponse[]> {
  const response = await fetch(`/api/predictions/${sprintId}`);
  return handleResponse<PredictionResponse[]>(response);
}
