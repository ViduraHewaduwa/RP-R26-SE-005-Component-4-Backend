// ============================================================================
// Type Definitions for Sprint Cost Studio
// ============================================================================

// Enums
export type Seniority = "JUNIOR" | "MID" | "SENIOR" | "LEAD";
export type Role = "BACKEND" | "FRONTEND" | "FULL_STACK" | "QA" | "DEVOPS" | "ARCHITECT";
export type EntryType = "LEAVE" | "HOLIDAY" | "TRAINING" | "PARTIAL_DAY" | "AVAILABLE";
export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type TaskStatus = "PLANNED" | "IN_PROGRESS" | "DONE" | "BLOCKED";
export type AssignmentStatus = "PLANNED" | "ACTIVE" | "COMPLETED";
export type PredictionType = "INITIAL" | "MID_SPRINT";

// ============================================================================
// API Request Types
// ============================================================================

export interface SkillCreateRequest {
  name: string;
  description?: string;
}

export interface TeamCreateRequest {
  code: string;
  name: string;
  description?: string;
  developerIds?: number[];
}

export interface DeveloperSkillRequest {
  skillId: number;
  proficiencyLevel: 1 | 2 | 3 | 4 | 5;
}

export interface CalendarEntryRequest {
  entryDate: string; // YYYY-MM-DD
  entryType: EntryType;
  availabilityFactor?: number;
  note?: string;
}

export interface DeveloperCreateRequest {
  name: string;
  seniority: Seniority;
  hourlyRate: number;
  allocationPercent: number;
  role: Role;
  teamId?: number;
  skills?: DeveloperSkillRequest[];
  calendarEntries?: CalendarEntryRequest[];
}

export interface SprintCreateRequest {
  teamId: number;
  name: string;
  sprintNumber: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: SprintStatus;
}

export interface TaskCreateRequest {
  sprintId: number;
  title: string;
  description?: string;
  storyPoints: number;
  completedStoryPoints?: number;
  actualEffortMinutes?: number;
  status: TaskStatus;
  requiredSkillIds?: number[];
}

export interface AssignmentCreateRequest {
  taskId: number;
  developerId: number;
  allocatedHours: number;
  overtimeHours?: number;
  actualEffortMinutes?: number;
  status: AssignmentStatus;
}

export interface InitialPredictionRequest {
  sprintId: number;
}

export interface MidSprintPredictionRequest {
  sprintId: number;
  snapshotDate: string; // YYYY-MM-DD
}

// ============================================================================
// API Response Types
// ============================================================================

export interface SkillResponse {
  id: number;
  name: string;
  description: string | null;
}

export interface TeamResponse {
  id: number;
  code: string;
  name: string;
  description: string | null;
  developerIds: number[];
}

export interface DeveloperSkillResponse {
  skillId: number;
  skillName: string;
  proficiencyLevel: number;
}

export interface CalendarEntryResponse {
  id: number;
  entryDate: string;
  entryType: EntryType;
  availabilityFactor: number | null;
  note: string | null;
}

export interface DeveloperResponse {
  id: number;
  name: string;
  seniority: Seniority;
  hourlyRate: number;
  allocationPercent: number;
  role: Role;
  teamId: number | null;
  skills: DeveloperSkillResponse[];
  calendarEntries: CalendarEntryResponse[];
}

export interface SprintResponse {
  id: number;
  teamId: number;
  teamCode: string;
  name: string;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  status: SprintStatus;
}

export interface TaskResponse {
  id: number;
  sprintId: number;
  title: string;
  description: string | null;
  storyPoints: number;
  completedStoryPoints: number | null;
  actualEffortMinutes: number | null;
  status: TaskStatus;
  requiredSkills: string[];
}

export interface AssignmentResponse {
  id: number;
  taskId: number;
  developerId: number;
  developerName: string;
  allocatedHours: number;
  overtimeHours: number | null;
  actualEffortMinutes: number | null;
  status: AssignmentStatus;
}

export interface VelocityResponse {
  teamId: number;
  teamCode: string;
  historicalVelocityAvg: number;
  completedStoryPointHistory: number[];
}

export interface AvailabilityResponse {
  developerId: number;
  sprintId: number;
  startDate: string;
  endDate: string;
  availabilityRate: number;
  plannedAbsenceDays: number;
  availableCapacityDays: number;
}

export interface SprintFeatureResponse {
  sprintId: number;
  snapshotDate: string;
  supportMetrics: Record<string, number>;
  initialModelFeatures: Record<string, string | number>;
  midModelFeatures: Record<string, string | number>;
}

export interface PredictionResponse {
  id: number;
  sprintId: number;
  predictionType: PredictionType;
  predictedCost: number;
  modelVersion: string;
  snapshotDate: string;
  createdAt: string;
  featureSnapshot: Record<string, unknown>;
}

// ============================================================================
// Error Response Type
// ============================================================================

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  details: string[];
}

// ============================================================================
// Local Storage Types
// ============================================================================

export interface LocalWorkspace {
  skills: SkillResponse[];
  teams: TeamResponse[];
  developers: DeveloperResponse[];
  sprints: SprintResponse[];
  tasks: TaskResponse[];
  assignments: AssignmentResponse[];
  predictions: PredictionResponse[];
}
