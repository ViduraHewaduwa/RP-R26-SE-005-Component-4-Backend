package com.yourapp.sprintcost.service;

import com.yourapp.sprintcost.dto.request.SprintCreateRequest;
import com.yourapp.sprintcost.dto.response.SprintFeatureResponse;
import com.yourapp.sprintcost.dto.response.SprintResponse;
import com.yourapp.sprintcost.entity.Sprint;
import com.yourapp.sprintcost.entity.Team;
import com.yourapp.sprintcost.exception.InvalidRequestException;
import com.yourapp.sprintcost.exception.ResourceNotFoundException;
import com.yourapp.sprintcost.repository.SprintRepository;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;
    private final TeamService teamService;
    private final FeatureEngineeringService featureEngineeringService;

    public SprintService(
        SprintRepository sprintRepository,
        TeamService teamService,
        FeatureEngineeringService featureEngineeringService
    ) {
        this.sprintRepository = sprintRepository;
        this.teamService = teamService;
        this.featureEngineeringService = featureEngineeringService;
    }

    @Transactional
    public SprintResponse createSprint(SprintCreateRequest request) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new InvalidRequestException("Sprint endDate must be on or after startDate");
        }

        Team team = teamService.getTeamEntity(request.teamId());
        Sprint sprint = new Sprint();
        sprint.setTeam(team);
        sprint.setName(request.name().trim());
        sprint.setSprintNumber(request.sprintNumber());
        sprint.setStartDate(request.startDate());
        sprint.setEndDate(request.endDate());
        sprint.setStatus(request.status());
        return toResponse(sprintRepository.save(sprint));
    }

    @Transactional(readOnly = true)
    public Sprint getSprintEntity(Long sprintId) {
        return sprintRepository.findById(sprintId)
            .orElseThrow(() -> new ResourceNotFoundException("Sprint not found: " + sprintId));
    }

    @Transactional(readOnly = true)
    public SprintFeatureResponse getSprintFeatures(Long sprintId, LocalDate snapshotDate) {
        CalculatedFeatureBundle bundle = featureEngineeringService.calculateSprintFeatures(sprintId, snapshotDate);
        return new SprintFeatureResponse(
            bundle.sprintId(),
            bundle.snapshotDate(),
            bundle.supportMetrics(),
            bundle.initialModelFeatures(),
            bundle.midModelFeatures()
        );
    }

    SprintResponse toResponse(Sprint sprint) {
        return new SprintResponse(
            sprint.getId(),
            sprint.getTeam().getId(),
            sprint.getTeam().getCode(),
            sprint.getName(),
            sprint.getSprintNumber(),
            sprint.getStartDate(),
            sprint.getEndDate(),
            sprint.getStatus()
        );
    }
}
