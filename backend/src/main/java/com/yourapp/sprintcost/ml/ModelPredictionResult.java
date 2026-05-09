package com.yourapp.sprintcost.ml;

import java.math.BigDecimal;

public record ModelPredictionResult(
    String stage,
    BigDecimal predictedCost,
    String modelPath
) {
}
