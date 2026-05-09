package com.yourapp.sprintcost.entity;

import com.yourapp.sprintcost.entity.enums.DeveloperRole;
import com.yourapp.sprintcost.entity.enums.SeniorityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "developers")
public class Developer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private SeniorityLevel seniority;

    private BigDecimal hourlyRate;

    private BigDecimal allocationPercent;

    @Enumerated(EnumType.STRING)
    private DeveloperRole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @OneToMany(mappedBy = "developer", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DeveloperSkill> developerSkills = new LinkedHashSet<>();

    @OneToMany(mappedBy = "developer", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DeveloperCalendar> calendarEntries = new LinkedHashSet<>();

    @OneToMany(mappedBy = "developer", fetch = FetchType.LAZY)
    private Set<SprintAssignment> assignments = new LinkedHashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SeniorityLevel getSeniority() {
        return seniority;
    }

    public void setSeniority(SeniorityLevel seniority) {
        this.seniority = seniority;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public BigDecimal getAllocationPercent() {
        return allocationPercent;
    }

    public void setAllocationPercent(BigDecimal allocationPercent) {
        this.allocationPercent = allocationPercent;
    }

    public DeveloperRole getRole() {
        return role;
    }

    public void setRole(DeveloperRole role) {
        this.role = role;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Set<DeveloperSkill> getDeveloperSkills() {
        return developerSkills;
    }

    public void setDeveloperSkills(Set<DeveloperSkill> developerSkills) {
        this.developerSkills = developerSkills;
    }

    public Set<DeveloperCalendar> getCalendarEntries() {
        return calendarEntries;
    }

    public void setCalendarEntries(Set<DeveloperCalendar> calendarEntries) {
        this.calendarEntries = calendarEntries;
    }

    public Set<SprintAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(Set<SprintAssignment> assignments) {
        this.assignments = assignments;
    }
}
