package com.yourapp.sprintcost.dto.request;

import jakarta.validation.constraints.NotBlank;

public record SkillCreateRequest(
    @NotBlank String name,
    String description
) {
}
