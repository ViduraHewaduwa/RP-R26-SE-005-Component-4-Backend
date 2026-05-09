package com.yourapp.sprintcost.service;

import com.yourapp.sprintcost.entity.Developer;
import com.yourapp.sprintcost.entity.DeveloperCalendar;
import com.yourapp.sprintcost.entity.DeveloperSkill;
import com.yourapp.sprintcost.entity.Skill;
import com.yourapp.sprintcost.entity.Sprint;
import com.yourapp.sprintcost.entity.SprintAssignment;
import com.yourapp.sprintcost.entity.SprintTask;
import com.yourapp.sprintcost.entity.enums.CalendarEntryType;
import com.yourapp.sprintcost.exception.InvalidRequestException;
import com.yourapp.sprintcost.repository.DeveloperCalendarRepository;
import com.yourapp.sprintcost.repository.SprintRepository;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FeatureEngineeringService {

    private final SprintRepository sprintRepository;
    private final DeveloperCalendarRepository developerCalendarRepository;
    private final VelocityService velocityService;

    public FeatureEngineeringService(
        SprintRepository sprintRepository,
        DeveloperCalendarRepository developerCalendarRepository,
        VelocityService velocityService
    ) {
        this.sprintRepository = sprintRepository;
        this.developerCalendarRepository = developerCalendarRepository;
        this.velocityService = velocityService;
    }

    @Transactional(readOnly = true)
    public CalculatedFeatureBundle calculateSprintFeatures(Long sprintId, LocalDate snapshotDate) {
        Sprint sprint = sprintRepository.findById(sprintId)
            .orElseThrow(() -> new com.yourapp.sprintcost.exception.ResourceNotFoundException("Sprint not found: " + sprintId));
        return calculateSprintFeatures(sprint, snapshotDate == null ? LocalDate.now() : snapshotDate);
    }

    @Transactional(readOnly = true)
    public CalculatedFeatureBundle calculateSprintFeatures(Sprint sprint, LocalDate snapshotDate) {
        if (snapshotDate.isBefore(sprint.getStartDate())) {
            throw new InvalidRequestException("Snapshot date cannot be before the sprint start date");
        }

        LocalDate boundedSnapshotDate = snapshotDate.isAfter(sprint.getEndDate()) ? sprint.getEndDate() : snapshotDate;
        List<SprintTask> tasks = sprint.getTasks().stream()
            .sorted(Comparator.comparing(SprintTask::getId))
            .toList();
        List<SprintAssignment> assignments = tasks.stream()
            .flatMap(task -> task.getAssignments().stream())
            .toList();
        List<Developer> teamDevelopers = resolveTeamDevelopers(sprint, assignments);
        double teamSize = teamDevelopers.size();
        double totalTasks = tasks.size();
        double plannedStoryPoints = tasks.stream().mapToDouble(task -> safeDouble(task.getStoryPoints())).sum();
        double historicalVelocityAvg = velocityService.calculateHistoricalVelocityAverage(sprint);
        double plannedAbsenceDays = teamDevelopers.stream()
            .mapToDouble(developer -> calculateDeveloperAvailability(developer, sprint.getStartDate(), sprint.getEndDate()).plannedAbsenceDays())
            .sum();
        double availabilityRate = calculateTeamAvailabilityRate(teamDevelopers, sprint.getStartDate(), sprint.getEndDate());
        double skillMatchRatio = calculateSkillMatchRatio(tasks, teamDevelopers);
        double avgSeniorityLevel = teamDevelopers.stream()
            .map(Developer::getSeniority)
            .filter(Objects::nonNull)
            .mapToDouble(seniority -> seniority.toModelValue())
            .average()
            .orElse(0.0d);
        double concurrentAssignments = teamSize == 0.0d ? 0.0d : assignments.size() / teamSize;
        double teamHourlyCost = teamDevelopers.stream()
            .mapToDouble(developer -> safeBigDecimal(developer.getHourlyRate()) * allocationRatio(developer))
            .sum();
        double completedStoryPoints = tasks.stream()
            .mapToDouble(task -> task.getCompletedStoryPoints() != null ? task.getCompletedStoryPoints() : fallbackCompletedPoints(task))
            .sum();
        double totalEffortMinutes = tasks.stream().mapToDouble(this::totalEffortMinutesForTask).sum();
        double elapsedAbsenceDays = teamDevelopers.stream()
            .mapToDouble(developer -> calculateDeveloperAvailability(developer, sprint.getStartDate(), boundedSnapshotDate).plannedAbsenceDays())
            .sum();
        double overtimeHoursTotal = assignments.stream()
            .mapToDouble(assignment -> safeDouble(assignment.getOvertimeHours()))
            .sum();

        Map<String, Double> supportMetrics = new LinkedHashMap<>();
        supportMetrics.put("teamSize", teamSize);
        supportMetrics.put("plannedStoryPoints", plannedStoryPoints);
        supportMetrics.put("totalTasks", totalTasks);
        supportMetrics.put("historicalVelocityAvg", historicalVelocityAvg);
        supportMetrics.put("plannedAbsenceDays", plannedAbsenceDays);
        supportMetrics.put("availabilityRate", availabilityRate);
        supportMetrics.put("skillMatchRatio", skillMatchRatio);
        supportMetrics.put("avgSeniorityLevel", avgSeniorityLevel);
        supportMetrics.put("concurrentAssignments", concurrentAssignments);
        supportMetrics.put("teamHourlyCost", teamHourlyCost);

        Map<String, Object> initialModelFeatures = new LinkedHashMap<>();
        initialModelFeatures.put("team_id", sprint.getTeam().getCode());
        initialModelFeatures.put("total_tasks", totalTasks);
        initialModelFeatures.put("team_size", teamSize);
        initialModelFeatures.put("planned_story_points", plannedStoryPoints);
        initialModelFeatures.put("sprint_number", sprint.getSprintNumber());
        initialModelFeatures.put("historical_velocity_avg", historicalVelocityAvg);
        initialModelFeatures.put("developer_availability_rate", availabilityRate);
        initialModelFeatures.put("concurrent_assignments", concurrentAssignments);
        initialModelFeatures.put("skill_match_ratio", skillMatchRatio);
        initialModelFeatures.put("avg_seniority_level", avgSeniorityLevel);

        Map<String, Object> midModelFeatures = new LinkedHashMap<>(initialModelFeatures);
        midModelFeatures.put("completed_story_points", completedStoryPoints);
        midModelFeatures.put("total_effort_minutes", totalEffortMinutes);
        midModelFeatures.put("absence_days_total", elapsedAbsenceDays);
        midModelFeatures.put("overtime_hours_total", overtimeHoursTotal);

        return new CalculatedFeatureBundle(
            sprint.getId(),
            boundedSnapshotDate,
            supportMetrics,
            initialModelFeatures,
            midModelFeatures
        );
    }

    @Transactional(readOnly = true)
    public DeveloperAvailabilityMetrics calculateDeveloperAvailability(Developer developer, LocalDate startDate, LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            return new DeveloperAvailabilityMetrics(0.0d, 0.0d, 0.0d);
        }

        long workdays = countWorkdays(startDate, endDate);
        if (workdays == 0L) {
            return new DeveloperAvailabilityMetrics(0.0d, 0.0d, 0.0d);
        }

        double allocationRatio = allocationRatio(developer);
        double baselineCapacityDays = workdays * allocationRatio;
        Map<LocalDate, DeveloperCalendar> entriesByDate = developerCalendarRepository
            .findByDeveloperIdAndEntryDateBetween(developer.getId(), startDate, endDate)
            .stream()
            .collect(Collectors.toMap(
                DeveloperCalendar::getEntryDate,
                Function.identity(),
                (left, right) -> right,
                LinkedHashMap::new
            ));

        double availableCapacityDays = baselineCapacityDays;
        for (DeveloperCalendar entry : entriesByDate.values()) {
            if (entry.getEntryDate().getDayOfWeek() == DayOfWeek.SATURDAY
                || entry.getEntryDate().getDayOfWeek() == DayOfWeek.SUNDAY) {
                continue;
            }
            availableCapacityDays += allocationRatio * (entryAvailabilityFactor(entry) - 1.0d);
        }

        double plannedAbsenceDays = Math.max(0.0d, baselineCapacityDays - availableCapacityDays);
        double availabilityRate = availableCapacityDays / workdays;
        return new DeveloperAvailabilityMetrics(availabilityRate, plannedAbsenceDays, availableCapacityDays);
    }

    private List<Developer> resolveTeamDevelopers(Sprint sprint, List<SprintAssignment> assignments) {
        Set<Developer> developers = new LinkedHashSet<>();
        if (sprint.getTeam() != null && sprint.getTeam().getDevelopers() != null) {
            developers.addAll(sprint.getTeam().getDevelopers());
        }
        if (developers.isEmpty()) {
            developers.addAll(assignments.stream().map(SprintAssignment::getDeveloper).toList());
        }
        return new ArrayList<>(developers);
    }

    private double calculateTeamAvailabilityRate(List<Developer> developers, LocalDate startDate, LocalDate endDate) {
        long workdays = countWorkdays(startDate, endDate);
        if (developers.isEmpty() || workdays == 0L) {
            return 0.0d;
        }
        double totalCapacityDays = developers.stream()
            .mapToDouble(developer -> calculateDeveloperAvailability(developer, startDate, endDate).availableCapacityDays())
            .sum();
        return totalCapacityDays / (developers.size() * workdays);
    }

    private double calculateSkillMatchRatio(List<SprintTask> tasks, List<Developer> teamDevelopers) {
        int totalRequiredSkills = tasks.stream().mapToInt(task -> task.getRequiredSkills().size()).sum();
        if (totalRequiredSkills == 0) {
            return 1.0d;
        }

        int matchedSkills = 0;
        for (SprintTask task : tasks) {
            Set<Long> relevantSkillIds = task.getAssignments().isEmpty()
                ? skillIdsForDevelopers(teamDevelopers)
                : skillIdsForDevelopers(task.getAssignments().stream().map(SprintAssignment::getDeveloper).toList());
            for (Skill requiredSkill : task.getRequiredSkills()) {
                if (relevantSkillIds.contains(requiredSkill.getId())) {
                    matchedSkills++;
                }
            }
        }
        return matchedSkills / (double) totalRequiredSkills;
    }

    private Set<Long> skillIdsForDevelopers(List<Developer> developers) {
        return developers.stream()
            .flatMap(developer -> developer.getDeveloperSkills().stream())
            .map(DeveloperSkill::getSkill)
            .filter(Objects::nonNull)
            .map(Skill::getId)
            .collect(Collectors.toSet());
    }

    private double totalEffortMinutesForTask(SprintTask task) {
        double assignmentEffort = task.getAssignments().stream()
            .mapToDouble(assignment -> assignment.getActualEffortMinutes() == null ? 0 : assignment.getActualEffortMinutes())
            .sum();
        if (assignmentEffort > 0.0d) {
            return assignmentEffort;
        }
        return task.getActualEffortMinutes() == null ? 0.0d : task.getActualEffortMinutes();
    }

    private long countWorkdays(LocalDate startDate, LocalDate endDate) {
        long workdays = 0L;
        for (LocalDate day = startDate; !day.isAfter(endDate); day = day.plusDays(1)) {
            if (day.getDayOfWeek() != DayOfWeek.SATURDAY && day.getDayOfWeek() != DayOfWeek.SUNDAY) {
                workdays++;
            }
        }
        return workdays;
    }

    private double entryAvailabilityFactor(DeveloperCalendar entry) {
        if (entry.getAvailabilityFactor() != null) {
            return entry.getAvailabilityFactor();
        }
        return switch (entry.getEntryType()) {
            case AVAILABLE -> 1.0d;
            case PARTIAL_DAY, TRAINING -> 0.5d;
            case LEAVE, HOLIDAY -> 0.0d;
        };
    }

    private double allocationRatio(Developer developer) {
        return safeBigDecimal(developer.getAllocationPercent()) / 100.0d;
    }

    private double fallbackCompletedPoints(SprintTask task) {
        return task.getStatus() == com.yourapp.sprintcost.entity.enums.TaskStatus.DONE
            ? safeDouble(task.getStoryPoints())
            : 0.0d;
    }

    private double safeDouble(Double value) {
        return value == null ? 0.0d : value;
    }

    private double safeBigDecimal(BigDecimal value) {
        return value == null ? 0.0d : value.doubleValue();
    }
}
