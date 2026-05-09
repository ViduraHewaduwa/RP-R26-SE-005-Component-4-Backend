package com.yourapp.sprintcost.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record TeamCreateRequest(
    @NotBlank String code,
    @NotBlank String name,
    String description,
    List<Long> developerIds
) {
}
