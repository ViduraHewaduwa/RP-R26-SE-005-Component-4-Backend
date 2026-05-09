package com.yourapp.sprintcost.service;

import com.yourapp.sprintcost.dto.response.VelocityResponse;
import com.yourapp.sprintcost.entity.Sprint;
import com.yourapp.sprintcost.entity.Team;
import com.yourapp.sprintcost.entity.enums.SprintStatus;
import com.yourapp.sprintcost.exception.ResourceNotFoundException;
import com.yourapp.sprintcost.repository.SprintRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VelocityService {

    private final SprintRepository sprintRepository;
    private final TeamService teamService;

    public VelocityService(SprintRepository sprintRepository, TeamService teamService) {
        this.sprintRepository = sprintRepository;
        this.teamService = teamService;
    }

    @Transactional(readOnly = true)
    public VelocityResponse getTeamVelocity(Long teamId) {
        Team team = teamService.getTeamEntity(teamId);
        List<Double> history = sprintRepository.findByTeamIdOrderBySprintNumberAsc(teamId).stream()
            .filter(sprint -> sprint.getStatus() == SprintStatus.COMPLETED)
            .map(this::completedStoryPoints)
            .toList();

        double average = history.stream().mapToDouble(Double::doubleValue).average().orElse(0.0d);
        return new VelocityResponse(team.getId(), team.getCode(), average, history);
    }

    @Transactional(readOnly = true)
    public double calculateHistoricalVelocityAverage(Sprint sprint) {
        if (sprint.getTeam() == null || sprint.getTeam().getId() == null) {
            throw new ResourceNotFoundException("Sprint team is missing for sprint " + sprint.getId());
        }
        return sprintRepository.findByTeamIdOrderBySprintNumberAsc(sprint.getTeam().getId()).stream()
            .filter(candidate -> !candidate.getId().equals(sprint.getId()))
            .filter(candidate -> candidate.getStatus() == SprintStatus.COMPLETED)
            .mapToDouble(this::completedStoryPoints)
            .average()
            .orElse(0.0d);
    }

    private double completedStoryPoints(Sprint sprint) {
        return sprint.getTasks().stream()
            .mapToDouble(task -> task.getCompletedStoryPoints() == null ? 0.0d : task.getCompletedStoryPoints())
            .sum();
    }
}
