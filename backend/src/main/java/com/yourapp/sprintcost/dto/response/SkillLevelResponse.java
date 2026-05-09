package com.yourapp.sprintcost.dto.response;

public record SkillLevelResponse(
    Long skillId,
    String skillName,
    Integer proficiencyLevel
) {
}
