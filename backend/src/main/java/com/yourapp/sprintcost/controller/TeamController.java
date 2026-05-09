package com.yourapp.sprintcost.controller;

import com.yourapp.sprintcost.dto.request.TeamCreateRequest;
import com.yourapp.sprintcost.dto.response.TeamResponse;
import com.yourapp.sprintcost.dto.response.VelocityResponse;
import com.yourapp.sprintcost.service.TeamService;
import com.yourapp.sprintcost.service.VelocityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;
    private final VelocityService velocityService;

    public TeamController(TeamService teamService, VelocityService velocityService) {
        this.teamService = teamService;
        this.velocityService = velocityService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeamResponse createTeam(@Valid @RequestBody TeamCreateRequest request) {
        return teamService.createTeam(request);
    }

    @GetMapping("/{id}/velocity")
    public VelocityResponse getVelocity(@PathVariable Long id) {
        return velocityService.getTeamVelocity(id);
    }
}
