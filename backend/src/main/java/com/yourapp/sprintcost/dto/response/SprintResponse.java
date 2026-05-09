package com.yourapp.sprintcost.dto.response;

import com.yourapp.sprintcost.entity.enums.SprintStatus;
import java.time.LocalDate;

public record SprintResponse(
    Long id,
    Long teamId,
    String teamCode,
    String name,
    Integer sprintNumber,
    LocalDate startDate,
    LocalDate endDate,
    SprintStatus status
) {
}
