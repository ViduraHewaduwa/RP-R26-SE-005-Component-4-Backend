package com.yourapp.sprintcost.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @OneToMany(mappedBy = "skill")
    private Set<DeveloperSkill> developerSkills = new LinkedHashSet<>();

    @ManyToMany(mappedBy = "requiredSkills")
    private Set<SprintTask> sprintTasks = new LinkedHashSet<>();

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<DeveloperSkill> getDeveloperSkills() {
        return developerSkills;
    }

    public void setDeveloperSkills(Set<DeveloperSkill> developerSkills) {
        this.developerSkills = developerSkills;
    }

    public Set<SprintTask> getSprintTasks() {
        return sprintTasks;
    }

    public void setSprintTasks(Set<SprintTask> sprintTasks) {
        this.sprintTasks = sprintTasks;
    }
}
