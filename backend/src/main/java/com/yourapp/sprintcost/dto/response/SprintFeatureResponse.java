package com.yourapp.sprintcost.dto.response;

import java.time.LocalDate;
import java.util.Map;

public record SprintFeatureResponse(
    Long sprintId,
    LocalDate snapshotDate,
    Map<String, Double> supportMetrics,
    Map<String, Object> initialModelFeatures,
    Map<String, Object> midModelFeatures
) {
}
