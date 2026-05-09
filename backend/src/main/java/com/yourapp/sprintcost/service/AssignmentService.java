package com.yourapp.sprintcost.service;

import com.yourapp.sprintcost.dto.request.AssignmentCreateRequest;
import com.yourapp.sprintcost.dto.response.AssignmentResponse;
import com.yourapp.sprintcost.entity.Developer;
import com.yourapp.sprintcost.entity.SprintAssignment;
import com.yourapp.sprintcost.entity.SprintTask;
import com.yourapp.sprintcost.exception.InvalidRequestException;
import com.yourapp.sprintcost.exception.ResourceNotFoundException;
import com.yourapp.sprintcost.repository.DeveloperRepository;
import com.yourapp.sprintcost.repository.SprintAssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssignmentService {

    private final SprintAssignmentRepository sprintAssignmentRepository;
    private final DeveloperRepository developerRepository;
    private final TaskService taskService;

    public AssignmentService(
        SprintAssignmentRepository sprintAssignmentRepository,
        DeveloperRepository developerRepository,
        TaskService taskService
    ) {
        this.sprintAssignmentRepository = sprintAssignmentRepository;
        this.developerRepository = developerRepository;
        this.taskService = taskService;
    }

    @Transactional
    public AssignmentResponse createAssignment(AssignmentCreateRequest request) {
        SprintTask task = taskService.getTaskEntity(request.taskId());
        Developer developer = developerRepository.findById(request.developerId())
            .orElseThrow(() -> new ResourceNotFoundException("Developer not found: " + request.developerId()));

        if (developer.getTeam() == null || !developer.getTeam().getId().equals(task.getSprint().getTeam().getId())) {
            throw new InvalidRequestException("Assigned developer must belong to the sprint's team");
        }

        SprintAssignment assignment = new SprintAssignment();
        assignment.setTask(task);
        assignment.setDeveloper(developer);
        assignment.setAllocatedHours(request.allocatedHours());
        assignment.setOvertimeHours(request.overtimeHours() == null ? 0.0d : request.overtimeHours());
        assignment.setActualEffortMinutes(request.actualEffortMinutes() == null ? 0 : request.actualEffortMinutes());
        assignment.setStatus(request.status());
        return toResponse(sprintAssignmentRepository.save(assignment));
    }

    AssignmentResponse toResponse(SprintAssignment assignment) {
        return new AssignmentResponse(
            assignment.getId(),
            assignment.getTask().getId(),
            assignment.getDeveloper().getId(),
            assignment.getDeveloper().getName(),
            assignment.getAllocatedHours(),
            assignment.getOvertimeHours(),
            assignment.getActualEffortMinutes(),
            assignment.getStatus()
        );
    }
}
