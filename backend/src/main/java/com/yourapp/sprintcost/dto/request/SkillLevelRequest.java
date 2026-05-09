package com.yourapp.sprintcost.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SkillLevelRequest(
    @NotNull Long skillId,
    @NotNull @Min(1) @Max(5) Integer proficiencyLevel
) {
}
