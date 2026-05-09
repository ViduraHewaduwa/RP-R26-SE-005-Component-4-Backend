package com.yourapp.sprintcost.service;

import java.time.LocalDate;
import java.util.Map;

public record CalculatedFeatureBundle(
    Long sprintId,
    LocalDate snapshotDate,
    Map<String, Double> supportMetrics,
    Map<String, Object> initialModelFeatures,
    Map<String, Object> midModelFeatures
) {
}
