package com.yourapp.sprintcost.service;

import com.yourapp.sprintcost.dto.request.TeamCreateRequest;
import com.yourapp.sprintcost.dto.response.TeamResponse;
import com.yourapp.sprintcost.entity.Developer;
import com.yourapp.sprintcost.entity.Team;
import com.yourapp.sprintcost.exception.InvalidRequestException;
import com.yourapp.sprintcost.exception.ResourceNotFoundException;
import com.yourapp.sprintcost.repository.DeveloperRepository;
import com.yourapp.sprintcost.repository.TeamRepository;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final DeveloperRepository developerRepository;

    public TeamService(TeamRepository teamRepository, DeveloperRepository developerRepository) {
        this.teamRepository = teamRepository;
        this.developerRepository = developerRepository;
    }

    @Transactional
    public TeamResponse createTeam(TeamCreateRequest request) {
        teamRepository.findByCode(request.code())
            .ifPresent(existing -> {
                throw new InvalidRequestException("Team code already exists: " + request.code());
            });

        Team team = new Team();
        team.setCode(request.code().trim());
        team.setName(request.name().trim());
        team.setDescription(request.description());
        Team savedTeam = teamRepository.save(team);

        List<Developer> developers = new ArrayList<>();
        if (request.developerIds() != null && !request.developerIds().isEmpty()) {
            developers = developerRepository.findAllById(request.developerIds());
            if (developers.size() != request.developerIds().size()) {
                throw new ResourceNotFoundException("One or more developers were not found for team assignment");
            }
            developers.forEach(developer -> developer.setTeam(savedTeam));
            developerRepository.saveAll(developers);
            savedTeam.setDevelopers(new LinkedHashSet<>(developers));
        }

        return toResponse(savedTeam);
    }

    @Transactional(readOnly = true)
    public Team getTeamEntity(Long teamId) {
        return teamRepository.findById(teamId)
            .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + teamId));
    }

    TeamResponse toResponse(Team team) {
        return new TeamResponse(
            team.getId(),
            team.getCode(),
            team.getName(),
            team.getDescription(),
            team.getDevelopers().stream().map(Developer::getId).toList()
        );
    }
}
