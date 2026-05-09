package com.yourapp.sprintcost.dto.request;

import com.yourapp.sprintcost.entity.enums.DeveloperRole;
import com.yourapp.sprintcost.entity.enums.SeniorityLevel;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record DeveloperCreateRequest(
    @NotBlank String name,
    @NotNull SeniorityLevel seniority,
    @NotNull BigDecimal hourlyRate,
    @NotNull @DecimalMin("0.0") @DecimalMax("100.0") BigDecimal allocationPercent,
    @NotNull DeveloperRole role,
    Long teamId,
    @Valid List<SkillLevelRequest> skills,
    @Valid List<CalendarEntryRequest> calendarEntries
) {
}
