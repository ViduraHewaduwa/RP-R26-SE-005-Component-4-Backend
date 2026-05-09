package com.yourapp.sprintcost.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yourapp.sprintcost.dto.request.InitialPredictionRequest;
import com.yourapp.sprintcost.dto.request.MidSprintPredictionRequest;
import com.yourapp.sprintcost.dto.response.PredictionResponse;
import com.yourapp.sprintcost.entity.PredictionRecord;
import com.yourapp.sprintcost.entity.Sprint;
import com.yourapp.sprintcost.entity.enums.PredictionType;
import com.yourapp.sprintcost.exception.PredictionIntegrationException;
import com.yourapp.sprintcost.ml.ModelClient;
import com.yourapp.sprintcost.ml.ModelPredictionResult;
import com.yourapp.sprintcost.ml.PredictionInputBuilder;
import com.yourapp.sprintcost.repository.PredictionRecordRepository;
import java.io.IOException;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PredictionService {

    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<>() {
    };

    private final PredictionRecordRepository predictionRecordRepository;
    private final SprintService sprintService;
    private final FeatureEngineeringService featureEngineeringService;
    private final PredictionInputBuilder predictionInputBuilder;
    private final ModelClient modelClient;
    private final ObjectMapper objectMapper;

    public PredictionService(
        PredictionRecordRepository predictionRecordRepository,
        SprintService sprintService,
        FeatureEngineeringService featureEngineeringService,
        PredictionInputBuilder predictionInputBuilder,
        ModelClient modelClient,
        ObjectMapper objectMapper
    ) {
        this.predictionRecordRepository = predictionRecordRepository;
        this.sprintService = sprintService;
        this.featureEngineeringService = featureEngineeringService;
        this.predictionInputBuilder = predictionInputBuilder;
        this.modelClient = modelClient;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public PredictionResponse createInitialPrediction(InitialPredictionRequest request) {
        Sprint sprint = sprintService.getSprintEntity(request.sprintId());
        CalculatedFeatureBundle features = featureEngineeringService.calculateSprintFeatures(sprint, sprint.getStartDate());
        Map<String, Object> modelInput = predictionInputBuilder.buildInitialInput(features);
        ModelPredictionResult result = modelClient.predict("initial", modelInput);
        PredictionRecord savedRecord = savePredictionRecord(
            sprint,
            PredictionType.INITIAL,
            result,
            features,
            modelInput
        );
        return toResponse(savedRecord);
    }

    @Transactional
    public PredictionResponse updatePrediction(MidSprintPredictionRequest request) {
        Sprint sprint = sprintService.getSprintEntity(request.sprintId());
        LocalDate snapshotDate = request.snapshotDate() == null ? LocalDate.now() : request.snapshotDate();
        CalculatedFeatureBundle features = featureEngineeringService.calculateSprintFeatures(sprint, snapshotDate);
        Map<String, Object> modelInput = predictionInputBuilder.buildMidInput(features);
        ModelPredictionResult result = modelClient.predict("mid", modelInput);
        PredictionRecord savedRecord = savePredictionRecord(
            sprint,
            PredictionType.MID_SPRINT,
            result,
            features,
            modelInput
        );
        return toResponse(savedRecord);
    }

    @Transactional(readOnly = true)
    public List<PredictionResponse> getPredictions(Long sprintId) {
        sprintService.getSprintEntity(sprintId);
        return predictionRecordRepository.findBySprintIdOrderByCreatedAtDesc(sprintId).stream()
            .map(this::toResponse)
            .toList();
    }

    private PredictionRecord savePredictionRecord(
        Sprint sprint,
        PredictionType predictionType,
        ModelPredictionResult result,
        CalculatedFeatureBundle features,
        Map<String, Object> modelInput
    ) {
        try {
            PredictionRecord record = new PredictionRecord();
            record.setSprint(sprint);
            record.setPredictionType(predictionType);
            record.setPredictedCost(result.predictedCost());
            record.setModelVersion(result.modelPath());
            record.setSnapshotDate(features.snapshotDate());
            record.setFeatureSnapshotJson(objectMapper.writeValueAsString(bundleSnapshot(features)));
            record.setInputSnapshotJson(objectMapper.writeValueAsString(modelInput));
            return predictionRecordRepository.save(record);
        } catch (IOException exception) {
            throw new PredictionIntegrationException("Failed to serialize prediction snapshots", exception);
        }
    }

    private Map<String, Object> bundleSnapshot(CalculatedFeatureBundle features) {
        Map<String, Object> snapshot = new LinkedHashMap<>();
        snapshot.put("sprintId", features.sprintId());
        snapshot.put("snapshotDate", features.snapshotDate() == null ? null : features.snapshotDate().toString());
        snapshot.put("supportMetrics", features.supportMetrics());
        snapshot.put("initialModelFeatures", features.initialModelFeatures());
        snapshot.put("midModelFeatures", features.midModelFeatures());
        return snapshot;
    }

    private PredictionResponse toResponse(PredictionRecord record) {
        try {
            Map<String, Object> featureSnapshot = objectMapper.readValue(record.getFeatureSnapshotJson(), MAP_TYPE);
            return new PredictionResponse(
                record.getId(),
                record.getSprint().getId(),
                record.getPredictionType(),
                record.getPredictedCost(),
                record.getModelVersion(),
                record.getSnapshotDate(),
                record.getCreatedAt(),
                featureSnapshot
            );
        } catch (IOException exception) {
            throw new PredictionIntegrationException("Failed to deserialize stored prediction snapshot", exception);
        }
    }
}
