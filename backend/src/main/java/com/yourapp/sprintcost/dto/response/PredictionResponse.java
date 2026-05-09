package com.yourapp.sprintcost.dto.response;

import com.yourapp.sprintcost.entity.enums.PredictionType;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;

public record PredictionResponse(
    Long id,
    Long sprintId,
    PredictionType predictionType,
    BigDecimal predictedCost,
    String modelVersion,
    LocalDate snapshotDate,
    Instant createdAt,
    Map<String, Object> featureSnapshot
) {
}
