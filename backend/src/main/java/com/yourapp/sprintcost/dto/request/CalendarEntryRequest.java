package com.yourapp.sprintcost.dto.request;

import com.yourapp.sprintcost.entity.enums.CalendarEntryType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CalendarEntryRequest(
    @NotNull LocalDate entryDate,
    @NotNull CalendarEntryType entryType,
    @DecimalMin("0.0") @DecimalMax("1.0") Double availabilityFactor,
    String note
) {
}
