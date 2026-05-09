package com.yourapp.sprintcost.dto.request;

import com.yourapp.sprintcost.entity.enums.AssignmentStatus;
import jakarta.validation.constraints.NotNull;

public record AssignmentCreateRequest(
    @NotNull Long taskId,
    @NotNull Long developerId,
    @NotNull Double allocatedHours,
    Double overtimeHours,
    Integer actualEffortMinutes,
    @NotNull AssignmentStatus status
) {
}
