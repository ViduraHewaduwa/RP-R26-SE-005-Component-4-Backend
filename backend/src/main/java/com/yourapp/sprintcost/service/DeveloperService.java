package com.yourapp.sprintcost.service;

import com.yourapp.sprintcost.dto.request.CalendarEntryRequest;
import com.yourapp.sprintcost.dto.request.DeveloperCreateRequest;
import com.yourapp.sprintcost.dto.request.SkillLevelRequest;
import com.yourapp.sprintcost.dto.response.AvailabilityResponse;
import com.yourapp.sprintcost.dto.response.CalendarEntryResponse;
import com.yourapp.sprintcost.dto.response.DeveloperResponse;
import com.yourapp.sprintcost.dto.response.SkillLevelResponse;
import com.yourapp.sprintcost.entity.Developer;
import com.yourapp.sprintcost.entity.DeveloperCalendar;
import com.yourapp.sprintcost.entity.DeveloperSkill;
import com.yourapp.sprintcost.entity.Skill;
import com.yourapp.sprintcost.entity.Team;
import com.yourapp.sprintcost.exception.ResourceNotFoundException;
import com.yourapp.sprintcost.repository.DeveloperRepository;
import com.yourapp.sprintcost.repository.SkillRepository;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeveloperService {

    private final DeveloperRepository developerRepository;
    private final SkillRepository skillRepository;
    private final TeamService teamService;
    private final SprintService sprintService;
    private final FeatureEngineeringService featureEngineeringService;

    public DeveloperService(
        DeveloperRepository developerRepository,
        SkillRepository skillRepository,
        TeamService teamService,
        SprintService sprintService,
        FeatureEngineeringService featureEngineeringService
    ) {
        this.developerRepository = developerRepository;
        this.skillRepository = skillRepository;
        this.teamService = teamService;
        this.sprintService = sprintService;
        this.featureEngineeringService = featureEngineeringService;
    }

    @Transactional
    public DeveloperResponse createDeveloper(DeveloperCreateRequest request) {
        Developer developer = new Developer();
        developer.setName(request.name().trim());
        developer.setSeniority(request.seniority());
        developer.setHourlyRate(request.hourlyRate());
        developer.setAllocationPercent(request.allocationPercent());
        developer.setRole(request.role());

        if (request.teamId() != null) {
            Team team = teamService.getTeamEntity(request.teamId());
            developer.setTeam(team);
        }

        Map<Long, Skill> skillsById = skillRepository.findAllById(
            request.skills() == null ? List.of() : request.skills().stream().map(SkillLevelRequest::skillId).toList()
        ).stream().collect(Collectors.toMap(Skill::getId, Function.identity()));

        if (request.skills() != null) {
            developer.setDeveloperSkills(
                request.skills().stream()
                    .map(skillRequest -> toDeveloperSkill(developer, skillRequest, skillsById.get(skillRequest.skillId())))
                    .collect(Collectors.toCollection(LinkedHashSet::new))
            );
        }

        if (request.calendarEntries() != null) {
            developer.setCalendarEntries(
                request.calendarEntries().stream()
                    .map(entryRequest -> toCalendarEntry(developer, entryRequest))
                    .collect(Collectors.toCollection(LinkedHashSet::new))
            );
        }

        return toResponse(developerRepository.save(developer));
    }

    @Transactional(readOnly = true)
    public AvailabilityResponse getAvailability(Long developerId, Long sprintId) {
        Developer developer = developerRepository.findById(developerId)
            .orElseThrow(() -> new ResourceNotFoundException("Developer not found: " + developerId));
        var sprint = sprintService.getSprintEntity(sprintId);
        DeveloperAvailabilityMetrics metrics = featureEngineeringService.calculateDeveloperAvailability(
            developer,
            sprint.getStartDate(),
            sprint.getEndDate()
        );
        return new AvailabilityResponse(
            developerId,
            sprintId,
            sprint.getStartDate(),
            sprint.getEndDate(),
            metrics.availabilityRate(),
            metrics.plannedAbsenceDays(),
            metrics.availableCapacityDays()
        );
    }

    private DeveloperSkill toDeveloperSkill(Developer developer, SkillLevelRequest request, Skill skill) {
        if (skill == null) {
            throw new ResourceNotFoundException("Skill not found: " + request.skillId());
        }
        DeveloperSkill developerSkill = new DeveloperSkill();
        developerSkill.setDeveloper(developer);
        developerSkill.setSkill(skill);
        developerSkill.setProficiencyLevel(request.proficiencyLevel());
        return developerSkill;
    }

    private DeveloperCalendar toCalendarEntry(Developer developer, CalendarEntryRequest request) {
        DeveloperCalendar calendarEntry = new DeveloperCalendar();
        calendarEntry.setDeveloper(developer);
        calendarEntry.setEntryDate(request.entryDate());
        calendarEntry.setEntryType(request.entryType());
        calendarEntry.setAvailabilityFactor(request.availabilityFactor());
        calendarEntry.setNote(request.note());
        return calendarEntry;
    }

    DeveloperResponse toResponse(Developer developer) {
        return new DeveloperResponse(
            developer.getId(),
            developer.getName(),
            developer.getSeniority(),
            developer.getHourlyRate(),
            developer.getAllocationPercent(),
            developer.getRole(),
            developer.getTeam() == null ? null : developer.getTeam().getId(),
            developer.getDeveloperSkills().stream()
                .map(skill -> new SkillLevelResponse(skill.getSkill().getId(), skill.getSkill().getName(), skill.getProficiencyLevel()))
                .toList(),
            developer.getCalendarEntries().stream()
                .map(entry -> new CalendarEntryResponse(entry.getId(), entry.getEntryDate(), entry.getEntryType(), entry.getAvailabilityFactor(), entry.getNote()))
                .toList()
        );
    }
}
