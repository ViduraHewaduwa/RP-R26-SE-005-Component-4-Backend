package com.yourapp.sprintcost.dto.response;

import java.util.List;

public record TeamResponse(
    Long id,
    String code,
    String name,
    String description,
    List<Long> developerIds
) {
}
