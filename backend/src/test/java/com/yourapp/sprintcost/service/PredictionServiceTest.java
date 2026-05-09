package com.yourapp.sprintcost.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yourapp.sprintcost.dto.request.InitialPredictionRequest;
import com.yourapp.sprintcost.dto.response.PredictionResponse;
import com.yourapp.sprintcost.entity.PredictionRecord;
import com.yourapp.sprintcost.entity.Sprint;
import com.yourapp.sprintcost.entity.Team;
import com.yourapp.sprintcost.ml.ModelClient;
import com.yourapp.sprintcost.ml.ModelPredictionResult;
import com.yourapp.sprintcost.ml.PredictionInputBuilder;
import com.yourapp.sprintcost.repository.PredictionRecordRepository;
import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class PredictionServiceTest {

    @Test
    void createInitialPredictionSerializesSnapshotsWithoutJavaTimeModules() {
        LocalDate snapshotDate = LocalDate.of(2026, 5, 8);
        Sprint sprint = buildSprint(1L, "ALPjHA", snapshotDate, 12);
        CalculatedFeatureBundle features = buildBundle(snapshotDate);
        Map<String, Object> expectedModelInput = new LinkedHashMap<>(features.initialModelFeatures());
        SavedPredictionRecordCapture savedRecordCapture = new SavedPredictionRecordCapture();

        PredictionService predictionService = new PredictionService(
            createRepositoryStub(savedRecordCapture),
            new StubSprintService(sprint),
            new StubFeatureEngineeringService(features),
            new PredictionInputBuilder(),
            new StubModelClient(expectedModelInput, new ModelPredictionResult(
                "initial",
                BigDecimal.valueOf(1234.56),
                "artifacts/model.pkl"
            )),
            new ObjectMapper()
        );

        PredictionResponse response = predictionService.createInitialPrediction(new InitialPredictionRequest(1L));

        PredictionRecord savedRecord = savedRecordCapture.record();
        assertNotNull(savedRecord);
        assertNotNull(savedRecord.getFeatureSnapshotJson());
        assertNotNull(savedRecord.getInputSnapshotJson());
        assertTrue(savedRecord.getFeatureSnapshotJson().contains("\"snapshotDate\":\"2026-05-08\""));
        assertTrue(savedRecord.getInputSnapshotJson().contains("\"team_id\":\"ALPjHA\""));

        assertEquals(99L, response.id());
        assertEquals(1L, response.sprintId());
        assertEquals("2026-05-08", response.featureSnapshot().get("snapshotDate"));
        assertEquals(features.supportMetrics(), response.featureSnapshot().get("supportMetrics"));
    }

    private PredictionRecordRepository createRepositoryStub(SavedPredictionRecordCapture savedRecordCapture) {
        return (PredictionRecordRepository) Proxy.newProxyInstance(
            PredictionRecordRepository.class.getClassLoader(),
            new Class<?>[] {PredictionRecordRepository.class},
            (proxy, method, args) -> switch (method.getName()) {
                case "save" -> {
                    PredictionRecord record = (PredictionRecord) args[0];
                    record.setId(99L);
                    record.setCreatedAt(Instant.parse("2026-05-08T23:13:45.061767Z"));
                    savedRecordCapture.setRecord(record);
                    yield record;
                }
                case "findBySprintIdOrderByCreatedAtDesc" -> List.of();
                case "findTopBySprintIdAndPredictionTypeOrderByCreatedAtDesc" -> Optional.empty();
                case "toString" -> "PredictionRecordRepositoryStub";
                case "hashCode" -> System.identityHashCode(proxy);
                case "equals" -> proxy == args[0];
                default -> throw new UnsupportedOperationException(method.getName());
            }
        );
    }

    private Sprint buildSprint(Long sprintId, String teamCode, LocalDate startDate, Integer sprintNumber) {
        Team team = new Team();
        team.setId(10L);
        team.setCode(teamCode);

        Sprint sprint = new Sprint();
        sprint.setId(sprintId);
        sprint.setTeam(team);
        sprint.setStartDate(startDate);
        sprint.setEndDate(startDate.plusDays(13));
        sprint.setSprintNumber(sprintNumber);
        return sprint;
    }

    private CalculatedFeatureBundle buildBundle(LocalDate snapshotDate) {
        Map<String, Double> supportMetrics = new LinkedHashMap<>();
        supportMetrics.put("teamSize", 1.0);
        supportMetrics.put("plannedStoryPoints", 8.0);
        supportMetrics.put("totalTasks", 1.0);
        supportMetrics.put("historicalVelocityAvg", 0.0);
        supportMetrics.put("plannedAbsenceDays", 0.5);
        supportMetrics.put("availabilityRate", 0.95);
        supportMetrics.put("skillMatchRatio", 1.0);
        supportMetrics.put("avgSeniorityLevel", 1.791759469228055);
        supportMetrics.put("concurrentAssignments", 1.0);
        supportMetrics.put("teamHourlyCost", 45.0);

        Map<String, Object> initialModelFeatures = new LinkedHashMap<>();
        initialModelFeatures.put("team_id", "ALPjHA");
        initialModelFeatures.put("total_tasks", 1.0);
        initialModelFeatures.put("team_size", 1.0);
        initialModelFeatures.put("planned_story_points", 8.0);
        initialModelFeatures.put("sprint_number", 12);
        initialModelFeatures.put("historical_velocity_avg", 0.0);
        initialModelFeatures.put("developer_availability_rate", 0.95);
        initialModelFeatures.put("concurrent_assignments", 1.0);
        initialModelFeatures.put("skill_match_ratio", 1.0);
        initialModelFeatures.put("avg_seniority_level", 1.791759469228055);

        Map<String, Object> midModelFeatures = new LinkedHashMap<>(initialModelFeatures);
        midModelFeatures.put("completed_story_points", 3.0);
        midModelFeatures.put("total_effort_minutes", 240.0);
        midModelFeatures.put("absence_days_total", 0.5);
        midModelFeatures.put("overtime_hours_total", 1.5);

        return new CalculatedFeatureBundle(
            1L,
            snapshotDate,
            supportMetrics,
            initialModelFeatures,
            midModelFeatures
        );
    }

    private static final class SavedPredictionRecordCapture {

        private PredictionRecord record;

        private PredictionRecord record() {
            return record;
        }

        private void setRecord(PredictionRecord record) {
            this.record = record;
        }
    }

    private static final class StubSprintService extends SprintService {

        private final Sprint sprint;

        private StubSprintService(Sprint sprint) {
            super(null, null, null);
            this.sprint = sprint;
        }

        @Override
        public Sprint getSprintEntity(Long sprintId) {
            return sprint;
        }
    }

    private static final class StubFeatureEngineeringService extends FeatureEngineeringService {

        private final CalculatedFeatureBundle bundle;

        private StubFeatureEngineeringService(CalculatedFeatureBundle bundle) {
            super(null, null, null);
            this.bundle = bundle;
        }

        @Override
        public CalculatedFeatureBundle calculateSprintFeatures(Sprint sprint, LocalDate snapshotDate) {
            return bundle;
        }
    }

    private static final class StubModelClient extends ModelClient {

        private final Map<String, Object> expectedInput;
        private final ModelPredictionResult result;

        private StubModelClient(Map<String, Object> expectedInput, ModelPredictionResult result) {
            super(null, null, null);
            this.expectedInput = expectedInput;
            this.result = result;
        }

        @Override
        public ModelPredictionResult predict(String stage, Map<String, Object> input) {
            assertEquals("initial", stage);
            assertEquals(expectedInput, input);
            return result;
        }
    }
}
