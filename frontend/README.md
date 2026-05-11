# AI Driven Human Aware Sprint Cost Forecasting - Frontend

This is a Next.js frontend for the Spring Boot sprint-cost backend in this repo.

## What it does

- AI-powered sprint cost forecasting with human factors awareness
- Mirrors the backend workflow in the same order as the Postman collection:
  1. Create skills
  2. Create a team
  3. Create developers with skills and calendar entries
  4. Create a sprint
  5. Create tasks
  6. Create assignments
  7. Fetch velocity, developer availability, and engineered sprint features
  8. Run initial and mid-sprint predictions and inspect prediction history
- Uses a Next.js rewrite proxy to the backend so the browser does not need Spring CORS configuration.
- Stores successful responses in browser local storage because the backend currently exposes creation endpoints and targeted analytics reads, but not general list endpoints.

## Backend flow this UI is based on

- `POST /api/predictions/initial`
  Uses `FeatureEngineeringService.calculateSprintFeatures(..., sprint.getStartDate())`, then sends `initialModelFeatures` to the Python predictor.
- `POST /api/predictions/update`
  Uses a bounded snapshot date, then sends `midModelFeatures` to the Python predictor.
- `GET /api/sprints/{id}/features`
  Returns `supportMetrics`, `initialModelFeatures`, and `midModelFeatures`.
- `GET /api/predictions/{sprintId}`
  Returns stored prediction records with the serialized feature snapshot.

## Run it

1. Start the backend from [backend](../backend):

```bash
cd backend
./mvnw spring-boot:run
```

2. Copy the environment template:

```bash
cd ../frontend
cp .env.example .env.local
```

3. Install dependencies and run Next.js:

```bash
npm install
npm run dev
```

4. Open `http://localhost:3000`.

## Notes

- Default backend URL: `http://localhost:8080`
- The Spring backend uses an in-memory H2 database, so backend records reset when the server restarts.
- The ML endpoints still depend on the configured Python runtime and model artifacts already referenced by the backend.
