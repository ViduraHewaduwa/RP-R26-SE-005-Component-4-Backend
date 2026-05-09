package com.yourapp.sprintcost.entity;

import com.yourapp.sprintcost.entity.enums.AssignmentStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "sprint_assignments")
public class SprintAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private SprintTask task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "developer_id")
    private Developer developer;

    private Double allocatedHours;

    private Double overtimeHours;

    private Integer actualEffortMinutes;

    @Enumerated(EnumType.STRING)
    private AssignmentStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SprintTask getTask() {
        return task;
    }

    public void setTask(SprintTask task) {
        this.task = task;
    }

    public Developer getDeveloper() {
        return developer;
    }

    public void setDeveloper(Developer developer) {
        this.developer = developer;
    }

    public Double getAllocatedHours() {
        return allocatedHours;
    }

    public void setAllocatedHours(Double allocatedHours) {
        this.allocatedHours = allocatedHours;
    }

    public Double getOvertimeHours() {
        return overtimeHours;
    }

    public void setOvertimeHours(Double overtimeHours) {
        this.overtimeHours = overtimeHours;
    }

    public Integer getActualEffortMinutes() {
        return actualEffortMinutes;
    }

    public void setActualEffortMinutes(Integer actualEffortMinutes) {
        this.actualEffortMinutes = actualEffortMinutes;
    }

    public AssignmentStatus getStatus() {
        return status;
    }

    public void setStatus(AssignmentStatus status) {
        this.status = status;
    }
}
