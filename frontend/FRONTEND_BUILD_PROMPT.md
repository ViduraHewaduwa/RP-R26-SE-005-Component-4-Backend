Create a production-quality frontend for the Spring Boot backend in this repository.

Project context:
- Frontend location: `frontend/`
- Stack: Next.js 14 App Router + TypeScript + React 18
- Existing frontend config already includes a rewrite proxy from `/api/:path*` to `BACKEND_BASE_URL`, so browser requests should call relative paths like `/api/skills` instead of hardcoding `http://localhost:8080`.
- Backend is stateful only through creation endpoints and a few targeted read endpoints. There are no general list endpoints for teams, developers, sprints, tasks, assignments, or skills.
- Because of that, persist successful create responses in `localStorage` and use them to drive dropdowns and summaries in the UI.
- The backend uses an in-memory H2 database, so if the backend restarts, the frontend should make it easy to clear local state and re-seed data.

What this product does:
- It is a "Sprint Cost Studio" UI for building sprint planning data and running cost predictions.
- The UX should follow the same happy-path workflow as the backend Postman collection:
  1. Create skills
  2. Create a team
  3. Create developers with skills and calendar entries
  4. Create a sprint
  5. Create tasks
  6. Create assignments
  7. Fetch team velocity, developer availability, and sprint engineered features
  8. Run initial prediction
  9. Run mid-sprint prediction
  10. View prediction history for a sprint

Build requirements:
- Use the existing Next.js app in `frontend/`.
- Create the missing App Router structure if needed, including `app/layout.tsx`, `app/page.tsx`, and any supporting components/utilities.
- Keep the code organized and readable. Suggested structure:
  - `app/`
  - `components/`
  - `lib/api.ts`
  - `lib/types.ts`
  - `lib/storage.ts`
  - optional small helpers for formatting and validation
- Do not assume any extra backend endpoints exist.
- Show loading, success, and error states for every API action.
- Parse backend error responses in this shape:
  - `timestamp: string`
  - `status: number`
  - `error: string`
  - `details: string[]`
- Display validation errors cleanly to the user.
- Use responsive layout and make it work well on desktop and mobile.
- Use a polished but practical design, with a clear workflow, not a generic blank CRUD page.

Primary UI shape:
- A single-page workflow dashboard is preferred.
- Use sections/cards for each step in the workflow.
- Include a progress rail or top navigation showing setup, planning, analytics, and predictions.
- Include a local data summary panel that shows the currently stored skills, team, developers, sprint, tasks, assignments, and prediction records.
- Include a "Reset local workspace" action that clears localStorage.

Backend API contract to support:

1. Create skill
- `POST /api/skills`
- Request:
```json
{
  "name": "Spring Boot",
  "description": "Backend API development"
}
```
- Response:
```ts
type SkillResponse = {
  id: number;
  name: string;
  description: string | null;
};
```

2. Create team
- `POST /api/teams`
- Request:
```json
{
  "code": "ALPHA",
  "name": "Alpha Squad",
  "description": "Pilot sprint-cost team",
  "developerIds": []
}
```
- Response:
```ts
type TeamResponse = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  developerIds: number[];
};
```

3. Create developer
- `POST /api/developers`
- Request:
```ts
type DeveloperCreateRequest = {
  name: string;
  seniority: "JUNIOR" | "MID" | "SENIOR" | "LEAD";
  hourlyRate: number;
  allocationPercent: number;
  role: "BACKEND" | "FRONTEND" | "FULL_STACK" | "QA" | "DEVOPS" | "ARCHITECT";
  teamId?: number;
  skills?: {
    skillId: number;
    proficiencyLevel: 1 | 2 | 3 | 4 | 5;
  }[];
  calendarEntries?: {
    entryDate: string;
    entryType: "LEAVE" | "HOLIDAY" | "TRAINING" | "PARTIAL_DAY" | "AVAILABLE";
    availabilityFactor?: number;
    note?: string;
  }[];
};
```
- Response:
```ts
type DeveloperResponse = {
  id: number;
  name: string;
  seniority: "JUNIOR" | "MID" | "SENIOR" | "LEAD";
  hourlyRate: number;
  allocationPercent: number;
  role: "BACKEND" | "FRONTEND" | "FULL_STACK" | "QA" | "DEVOPS" | "ARCHITECT";
  teamId: number | null;
  skills: {
    skillId: number;
    skillName: string;
    proficiencyLevel: number;
  }[];
  calendarEntries: {
    id: number;
    entryDate: string;
    entryType: "LEAVE" | "HOLIDAY" | "TRAINING" | "PARTIAL_DAY" | "AVAILABLE";
    availabilityFactor: number | null;
    note: string | null;
  }[];
};
```

4. Create sprint
- `POST /api/sprints`
- Request:
```json
{
  "teamId": 1,
  "name": "Sprint 12",
  "sprintNumber": 12,
  "startDate": "2026-05-04",
  "endDate": "2026-05-15",
  "status": "ACTIVE"
}
```
- Status enum:
  - `PLANNED`
  - `ACTIVE`
  - `COMPLETED`
  - `CANCELLED`
- Response:
```ts
type SprintResponse = {
  id: number;
  teamId: number;
  teamCode: string;
  name: string;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
};
```

5. Create task
- `POST /api/tasks`
- Request:
```json
{
  "sprintId": 1,
  "title": "Build sprint forecasting API",
  "description": "Implement the API and validation layer for sprint cost predictions",
  "storyPoints": 8,
  "completedStoryPoints": 3,
  "actualEffortMinutes": 300,
  "status": "IN_PROGRESS",
  "requiredSkillIds": [1]
}
```
- Task status enum:
  - `PLANNED`
  - `IN_PROGRESS`
  - `DONE`
  - `BLOCKED`
- Response:
```ts
type TaskResponse = {
  id: number;
  sprintId: number;
  title: string;
  description: string | null;
  storyPoints: number;
  completedStoryPoints: number | null;
  actualEffortMinutes: number | null;
  status: "PLANNED" | "IN_PROGRESS" | "DONE" | "BLOCKED";
  requiredSkills: string[];
};
```

6. Create assignment
- `POST /api/assignments`
- Request:
```json
{
  "taskId": 1,
  "developerId": 1,
  "allocatedHours": 16,
  "overtimeHours": 1.5,
  "actualEffortMinutes": 240,
  "status": "ACTIVE"
}
```
- Assignment status enum:
  - `PLANNED`
  - `ACTIVE`
  - `COMPLETED`
- Response:
```ts
type AssignmentResponse = {
  id: number;
  taskId: number;
  developerId: number;
  developerName: string;
  allocatedHours: number;
  overtimeHours: number | null;
  actualEffortMinutes: number | null;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
};
```

7. Get team velocity
- `GET /api/teams/{id}/velocity`
- Response:
```ts
type VelocityResponse = {
  teamId: number;
  teamCode: string;
  historicalVelocityAvg: number;
  completedStoryPointHistory: number[];
};
```

8. Get developer availability
- `GET /api/developers/{id}/availability?sprintId={sprintId}`
- Response:
```ts
type AvailabilityResponse = {
  developerId: number;
  sprintId: number;
  startDate: string;
  endDate: string;
  availabilityRate: number;
  plannedAbsenceDays: number;
  availableCapacityDays: number;
};
```

9. Get sprint engineered features
- `GET /api/sprints/{id}/features`
- Optional query param:
  - `snapshotDate=YYYY-MM-DD`
- Response:
```ts
type SprintFeatureResponse = {
  sprintId: number;
  snapshotDate: string;
  supportMetrics: Record<string, number>;
  initialModelFeatures: Record<string, string | number>;
  midModelFeatures: Record<string, string | number>;
};
```
- Important support metric keys currently produced by the backend:
  - `teamSize`
  - `plannedStoryPoints`
  - `totalTasks`
  - `historicalVelocityAvg`
  - `plannedAbsenceDays`
  - `availabilityRate`
  - `skillMatchRatio`
  - `avgSeniorityLevel`
  - `concurrentAssignments`
  - `teamHourlyCost`
- Important model feature keys:
  - Initial model:
    - `team_id`
    - `total_tasks`
    - `team_size`
    - `planned_story_points`
    - `sprint_number`
    - `historical_velocity_avg`
    - `developer_availability_rate`
    - `concurrent_assignments`
    - `skill_match_ratio`
    - `avg_seniority_level`
  - Mid-sprint model adds:
    - `completed_story_points`
    - `total_effort_minutes`
    - `absence_days_total`
    - `overtime_hours_total`

10. Create initial prediction
- `POST /api/predictions/initial`
- Request:
```json
{
  "sprintId": 1
}
```

11. Update mid-sprint prediction
- `POST /api/predictions/update`
- Request:
```json
{
  "sprintId": 1,
  "snapshotDate": "2026-05-08"
}
```

12. Get predictions by sprint
- `GET /api/predictions/{sprintId}`
- Response:
```ts
type PredictionResponse = {
  id: number;
  sprintId: number;
  predictionType: "INITIAL" | "MID_SPRINT";
  predictedCost: number;
  modelVersion: string;
  snapshotDate: string;
  createdAt: string;
  featureSnapshot: Record<string, unknown>;
};
```

UX requirements for each workflow step:
- Skills:
  - Simple form to create skills.
  - List created skills from localStorage.
- Team:
  - Create a team with code, name, description.
  - Show the active team summary after creation.
- Developers:
  - Support selecting team, multiple skill entries, and multiple calendar entries.
  - Make adding/removing nested skill rows and calendar rows easy.
- Sprint:
  - Allow choosing the stored team.
  - Validate that end date is not before start date in the UI before submit.
- Tasks:
  - Allow selecting sprint and multiple required skills.
  - Show created tasks in a table.
- Assignments:
  - Allow selecting task and developer from stored data.
  - Show allocation and overtime clearly.
- Analytics:
  - Velocity section for selected team.
  - Availability section for selected developer + sprint.
  - Sprint features section showing:
    - support metrics as stat cards
    - initial model features as a key-value table
    - mid model features as a key-value table
- Predictions:
  - Initial prediction form by sprint
  - Mid-sprint prediction form by sprint + snapshot date
  - Prediction history table by sprint
  - Highlight predicted cost prominently
  - Expandable JSON viewer or prettified details for `featureSnapshot`

Implementation details:
- Create a typed API client in `lib/api.ts`.
- Centralize TypeScript types in `lib/types.ts`.
- Create a small `localStorage` persistence layer in `lib/storage.ts`.
- Prefer server-safe code patterns for Next.js App Router. Anything using `window` or `localStorage` must be in client components.
- Use client components for interactive forms and local state.
- Use a small number of reusable UI primitives like:
  - `SectionCard`
  - `Field`
  - `StatusBanner`
  - `DataTable`
  - `JsonBlock`
- Avoid adding a heavy UI framework unless truly necessary.
- Plain CSS, CSS modules, or a lightweight styling approach is fine.
- Include sensible default values or "load sample data" buttons based on these examples:
  - Skill 1: `Spring Boot`
  - Skill 2: `QA Automation`
  - Team: `ALPHA / Alpha Squad`
  - Developer: `Nimal Perera`, `SENIOR`, `BACKEND`, hourly rate `45`, allocation `100`
  - Sprint: `Sprint 12`, number `12`, `2026-05-04` to `2026-05-15`
  - Task: `Build sprint forecasting API`, story points `8`, completed `3`
  - Assignment: allocated `16`, overtime `1.5`, actual effort `240`
- If a sample loader is implemented, it should fill forms but still let the user submit manually.

Important behavior constraints:
- The backend may return `400` with validation errors if enums, dates, or numeric fields are malformed.
- Dates must be ISO `YYYY-MM-DD`.
- Numeric IDs must be sent as numbers, not unresolved template strings.
- `GET /api/sprints/{id}/features` accepts an optional `snapshotDate`; if omitted, backend uses current date and bounds it to the sprint end date.
- Prediction endpoints depend on backend Python/model setup. If prediction calls fail, surface the backend error clearly instead of masking it.

Expected output:
- Implement the frontend code directly in the `frontend/` directory.
- Create all missing app files needed to run.
- Make sure `npm run typecheck` passes.
- Keep the UI cohesive and usable even without list endpoints by relying on localStorage-backed created records.

Before coding, summarize the implementation plan briefly. Then implement the app.
