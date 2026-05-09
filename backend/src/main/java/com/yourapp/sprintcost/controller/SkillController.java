package com.yourapp.sprintcost.controller;

import com.yourapp.sprintcost.dto.request.SkillCreateRequest;
import com.yourapp.sprintcost.dto.response.SkillResponse;
import com.yourapp.sprintcost.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SkillResponse createSkill(@Valid @RequestBody SkillCreateRequest request) {
        return skillService.createSkill(request);
    }
}
