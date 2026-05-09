package com.yourapp.sprintcost.service;

import com.yourapp.sprintcost.dto.request.TaskCreateRequest;
import com.yourapp.sprintcost.dto.response.TaskResponse;
import com.yourapp.sprintcost.entity.Skill;
import com.yourapp.sprintcost.entity.Sprint;
import com.yourapp.sprintcost.entity.SprintTask;
import com.yourapp.sprintcost.repository.SkillRepository;
import com.yourapp.sprintcost.repository.SprintTaskRepository;
import java.util.LinkedHashSet;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    private final SprintService sprintService;
    private final SkillRepository skillRepository;
    private final SprintTaskRepository sprintTaskRepository;

    public TaskService(
        SprintService sprintService,
        SkillRepository skillRepository,
        SprintTaskRepository sprintTaskRepository
    ) {
        this.sprintService = sprintService;
        this.skillRepository = skillRepository;
        this.sprintTaskRepository = sprintTaskRepository;
    }

    @Transactional
    public TaskResponse createTask(TaskCreateRequest request) {
        Sprint sprint = sprintService.getSprintEntity(request.sprintId());
        SprintTask task = new SprintTask();
        task.setSprint(sprint);
        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setStoryPoints(request.storyPoints());
        task.setCompletedStoryPoints(request.completedStoryPoints() == null ? 0.0d : request.completedStoryPoints());
        task.setActualEffortMinutes(request.actualEffortMinutes() == null ? 0 : request.actualEffortMinutes());
        task.setStatus(request.status());
        if (request.requiredSkillIds() != null && !request.requiredSkillIds().isEmpty()) {
            List<Skill> skills = skillRepository.findAllById(request.requiredSkillIds());
            task.setRequiredSkills(new LinkedHashSet<>(skills));
        }
        return toResponse(sprintTaskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public SprintTask getTaskEntity(Long taskId) {
        return sprintTaskRepository.findById(taskId)
            .orElseThrow(() -> new com.yourapp.sprintcost.exception.ResourceNotFoundException("Task not found: " + taskId));
    }

    TaskResponse toResponse(SprintTask task) {
        return new TaskResponse(
            task.getId(),
            task.getSprint().getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStoryPoints(),
            task.getCompletedStoryPoints(),
            task.getActualEffortMinutes(),
            task.getStatus(),
            task.getRequiredSkills().stream().map(Skill::getName).toList()
        );
    }
}
