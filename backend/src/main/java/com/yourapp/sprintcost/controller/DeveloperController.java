package com.yourapp.sprintcost.controller;

import com.yourapp.sprintcost.dto.request.DeveloperCreateRequest;
import com.yourapp.sprintcost.dto.response.AvailabilityResponse;
import com.yourapp.sprintcost.dto.response.DeveloperResponse;
import com.yourapp.sprintcost.service.DeveloperService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/developers")
public class DeveloperController {

    private final DeveloperService developerService;

    public DeveloperController(DeveloperService developerService) {
        this.developerService = developerService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DeveloperResponse createDeveloper(@Valid @RequestBody DeveloperCreateRequest request) {
        return developerService.createDeveloper(request);
    }

    @GetMapping("/{id}/availability")
    public AvailabilityResponse getAvailability(@PathVariable Long id, @RequestParam Long sprintId) {
        return developerService.getAvailability(id, sprintId);
    }
}
