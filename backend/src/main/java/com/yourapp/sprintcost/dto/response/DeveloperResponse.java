package com.yourapp.sprintcost.dto.response;

import com.yourapp.sprintcost.entity.enums.DeveloperRole;
import com.yourapp.sprintcost.entity.enums.SeniorityLevel;
import java.math.BigDecimal;
import java.util.List;

public record DeveloperResponse(
    Long id,
    String name,
    SeniorityLevel seniority,
    BigDecimal hourlyRate,
    BigDecimal allocationPercent,
    DeveloperRole role,
    Long teamId,
    List<SkillLevelResponse> skills,
    List<CalendarEntryResponse> calendarEntries
) {
}
