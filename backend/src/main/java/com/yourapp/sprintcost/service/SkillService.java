package com.yourapp.sprintcost.service;

import com.yourapp.sprintcost.dto.request.SkillCreateRequest;
import com.yourapp.sprintcost.dto.response.SkillResponse;
import com.yourapp.sprintcost.entity.Skill;
import com.yourapp.sprintcost.exception.InvalidRequestException;
import com.yourapp.sprintcost.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Transactional
    public SkillResponse createSkill(SkillCreateRequest request) {
        skillRepository.findByNameIgnoreCase(request.name())
            .ifPresent(existing -> {
                throw new InvalidRequestException("Skill already exists with name: " + request.name());
            });

        Skill skill = new Skill();
        skill.setName(request.name().trim());
        skill.setDescription(request.description());
        return toResponse(skillRepository.save(skill));
    }

    SkillResponse toResponse(Skill skill) {
        return new SkillResponse(skill.getId(), skill.getName(), skill.getDescription());
    }
}
