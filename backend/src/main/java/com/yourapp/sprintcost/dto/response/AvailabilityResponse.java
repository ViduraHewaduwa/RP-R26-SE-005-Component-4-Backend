package com.yourapp.sprintcost.dto.response;

import java.time.LocalDate;

public record AvailabilityResponse(
    Long developerId,
    Long sprintId,
    LocalDate startDate,
    LocalDate endDate,
    Double availabilityRate,
    Double plannedAbsenceDays,
    Double availableCapacityDays
) {
}
