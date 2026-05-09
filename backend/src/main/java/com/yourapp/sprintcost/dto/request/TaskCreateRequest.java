package com.yourapp.sprintcost.dto.request;

import com.yourapp.sprintcost.entity.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record TaskCreateRequest(
    @NotNull Long sprintId,
    @NotBlank String title,
    String description,
    @NotNull Double storyPoints,
    Double completedStoryPoints,
    Integer actualEffortMinutes,
    @NotNull TaskStatus status,
    List<Long> requiredSkillIds
) {
}
