package com.yourapp.sprintcost.dto.response;

import com.yourapp.sprintcost.entity.enums.TaskStatus;
import java.util.List;

public record TaskResponse(
    Long id,
    Long sprintId,
    String title,
    String description,
    Double storyPoints,
    Double completedStoryPoints,
    Integer actualEffortMinutes,
    TaskStatus status,
    List<String> requiredSkills
) {
}
