package com.yourapp.sprintcost.controller;

import com.yourapp.sprintcost.dto.request.AssignmentCreateRequest;
import com.yourapp.sprintcost.dto.response.AssignmentResponse;
import com.yourapp.sprintcost.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssignmentResponse createAssignment(@Valid @RequestBody AssignmentCreateRequest request) {
        return assignmentService.createAssignment(request);
    }
}
