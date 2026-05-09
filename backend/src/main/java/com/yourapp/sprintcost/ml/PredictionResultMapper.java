package com.yourapp.sprintcost.ml;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yourapp.sprintcost.exception.PredictionIntegrationException;
import java.io.IOException;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class PredictionResultMapper {

    private final ObjectMapper objectMapper;

    public PredictionResultMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public ModelPredictionResult fromJson(String payload) {
        try {
            JsonNode root = objectMapper.readTree(payload);
            return new ModelPredictionResult(
                root.path("stage").asText(),
                BigDecimal.valueOf(root.path("predictedCost").asDouble()),
                root.path("modelPath").asText()
            );
        } catch (IOException exception) {
            throw new PredictionIntegrationException("Failed to parse prediction output", exception);
        }
    }
}
