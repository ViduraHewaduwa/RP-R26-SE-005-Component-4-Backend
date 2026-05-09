package com.yourapp.sprintcost.ml;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yourapp.sprintcost.config.PredictionModelProperties;
import com.yourapp.sprintcost.exception.PredictionIntegrationException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class ModelClient {

    private final PredictionModelProperties properties;
    private final ObjectMapper objectMapper;
    private final PredictionResultMapper predictionResultMapper;

    public ModelClient(
        PredictionModelProperties properties,
        ObjectMapper objectMapper,
        PredictionResultMapper predictionResultMapper
    ) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.predictionResultMapper = predictionResultMapper;
    }

    public ModelPredictionResult predict(String stage, Map<String, Object> input) {
        Path inputFile = null;
        try {
            inputFile = Files.createTempFile("sprintcost-input-", ".json");
            Files.writeString(inputFile, objectMapper.writeValueAsString(input));

            ProcessBuilder processBuilder = new ProcessBuilder(
                List.of(
                    properties.getPythonExecutable(),
                    resolvePath(properties.getPredictorScript()).toString(),
                    "--stage", stage,
                    "--input-json", inputFile.toString(),
                    "--artifacts-root", resolvePath(properties.getArtifactsRoot()).toString(),
                    "--training-module-root", resolvePath(properties.getTrainingModuleRoot()).toString()
                )
            );
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            String output = new String(process.getInputStream().readAllBytes());
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new PredictionIntegrationException("Prediction process failed: " + output);
            }
            return predictionResultMapper.fromJson(output);
        } catch (IOException exception) {
            throw new PredictionIntegrationException("Failed to execute prediction process", exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new PredictionIntegrationException("Prediction process was interrupted", exception);
        } finally {
            if (inputFile != null) {
                try {
                    Files.deleteIfExists(inputFile);
                } catch (IOException ignored) {
                }
            }
        }
    }

    private Path resolvePath(String configuredPath) {
        return Path.of(configuredPath).toAbsolutePath().normalize();
    }
}
