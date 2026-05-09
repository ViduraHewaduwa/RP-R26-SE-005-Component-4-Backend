package com.yourapp.sprintcost.dto.response;

import com.yourapp.sprintcost.entity.enums.AssignmentStatus;

public record AssignmentResponse(
    Long id,
    Long taskId,
    Long developerId,
    String developerName,
    Double allocatedHours,
    Double overtimeHours,
    Integer actualEffortMinutes,
    AssignmentStatus status
) {
}
