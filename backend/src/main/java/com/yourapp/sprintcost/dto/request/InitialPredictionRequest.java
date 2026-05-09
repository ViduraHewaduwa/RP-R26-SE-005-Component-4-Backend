package com.yourapp.sprintcost.dto.request;

import jakarta.validation.constraints.NotNull;

public record InitialPredictionRequest(@NotNull Long sprintId) {
}
