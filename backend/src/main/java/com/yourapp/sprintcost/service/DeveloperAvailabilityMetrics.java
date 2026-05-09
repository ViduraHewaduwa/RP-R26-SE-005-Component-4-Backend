package com.yourapp.sprintcost.service;

public record DeveloperAvailabilityMetrics(
    double availabilityRate,
    double plannedAbsenceDays,
    double availableCapacityDays
) {
}
