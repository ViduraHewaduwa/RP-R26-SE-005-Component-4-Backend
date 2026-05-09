package com.yourapp.sprintcost.controller;

import com.yourapp.sprintcost.dto.request.InitialPredictionRequest;
import com.yourapp.sprintcost.dto.request.MidSprintPredictionRequest;
import com.yourapp.sprintcost.dto.response.PredictionResponse;
import com.yourapp.sprintcost.service.PredictionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping("/initial")
    @ResponseStatus(HttpStatus.CREATED)
    public PredictionResponse createInitialPrediction(@Valid @RequestBody InitialPredictionRequest request) {
        return predictionService.createInitialPrediction(request);
    }

    @PostMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public PredictionResponse updatePrediction(@Valid @RequestBody MidSprintPredictionRequest request) {
        return predictionService.updatePrediction(request);
    }

    @GetMapping("/{sprintId}")
    public List<PredictionResponse> getPredictions(@PathVariable Long sprintId) {
        return predictionService.getPredictions(sprintId);
    }
}
