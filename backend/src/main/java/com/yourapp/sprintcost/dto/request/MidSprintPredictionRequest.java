package com.yourapp.sprintcost.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record MidSprintPredictionRequest(
    @NotNull Long sprintId,
    LocalDate snapshotDate
) {
}
