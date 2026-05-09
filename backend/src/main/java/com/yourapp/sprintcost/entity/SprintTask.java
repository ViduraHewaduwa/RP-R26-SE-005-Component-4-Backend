package com.yourapp.sprintcost.entity;

import com.yourapp.sprintcost.entity.enums.TaskStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "sprint_tasks")
public class SprintTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;

    private String title;

    private String description;

    private Double storyPoints;

    private Double completedStoryPoints;

    private Integer actualEffortMinutes;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @ManyToMany
    @JoinTable(
        name = "sprint_task_required_skills",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> requiredSkills = new LinkedHashSet<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SprintAssignment> assignments = new LinkedHashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Sprint getSprint() {
        return sprint;
    }

    public void setSprint(Sprint sprint) {
        this.sprint = sprint;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getStoryPoints() {
        return storyPoints;
    }

    public void setStoryPoints(Double storyPoints) {
        this.storyPoints = storyPoints;
    }

    public Double getCompletedStoryPoints() {
        return completedStoryPoints;
    }

    public void setCompletedStoryPoints(Double completedStoryPoints) {
        this.completedStoryPoints = completedStoryPoints;
    }

    public Integer getActualEffortMinutes() {
        return actualEffortMinutes;
    }

    public void setActualEffortMinutes(Integer actualEffortMinutes) {
        this.actualEffortMinutes = actualEffortMinutes;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Set<Skill> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(Set<Skill> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public Set<SprintAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(Set<SprintAssignment> assignments) {
        this.assignments = assignments;
    }
}
