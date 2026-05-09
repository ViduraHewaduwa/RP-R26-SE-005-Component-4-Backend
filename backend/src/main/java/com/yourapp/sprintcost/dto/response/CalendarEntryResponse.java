package com.yourapp.sprintcost.dto.response;

import com.yourapp.sprintcost.entity.enums.CalendarEntryType;
import java.time.LocalDate;

public record CalendarEntryResponse(
    Long id,
    LocalDate entryDate,
    CalendarEntryType entryType,
    Double availabilityFactor,
    String note
) {
}
