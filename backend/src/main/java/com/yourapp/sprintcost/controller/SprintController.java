package com.yourapp.sprintcost.controller;

import com.yourapp.sprintcost.dto.request.SprintCreateRequest;
import com.yourapp.sprintcost.dto.response.SprintFeatureResponse;
import com.yourapp.sprintcost.dto.response.SprintResponse;
import com.yourapp.sprintcost.service.SprintService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sprints")
public class SprintController {

    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SprintResponse createSprint(@Valid @RequestBody SprintCreateRequest request) {
        return sprintService.createSprint(request);
    }

    @GetMapping("/{id}/features")
    public SprintFeatureResponse getFeatures(
        @PathVariable Long id,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate snapshotDate
    ) {
        return sprintService.getSprintFeatures(id, snapshotDate);
    }
}
