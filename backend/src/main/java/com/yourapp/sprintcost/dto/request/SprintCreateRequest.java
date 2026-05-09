package com.yourapp.sprintcost.dto.request;

import com.yourapp.sprintcost.entity.enums.SprintStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record SprintCreateRequest(
    @NotNull Long teamId,
    @NotBlank String name,
    @NotNull Integer sprintNumber,
    @NotNull LocalDate startDate,
    @NotNull LocalDate endDate,
    @NotNull SprintStatus status
) {
}
