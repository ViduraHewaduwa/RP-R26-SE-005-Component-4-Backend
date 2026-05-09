package com.yourapp.sprintcost.dto.response;

import java.util.List;

public record VelocityResponse(
    Long teamId,
    String teamCode,
    Double historicalVelocityAvg,
    List<Double> completedStoryPointHistory
) {
}
