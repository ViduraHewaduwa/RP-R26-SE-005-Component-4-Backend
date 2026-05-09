package com.yourapp.sprintcost.ml;

import com.yourapp.sprintcost.service.CalculatedFeatureBundle;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class PredictionInputBuilder {

    public Map<String, Object> buildInitialInput(CalculatedFeatureBundle bundle) {
        return new LinkedHashMap<>(bundle.initialModelFeatures());
    }

    public Map<String, Object> buildMidInput(CalculatedFeatureBundle bundle) {
        return new LinkedHashMap<>(bundle.midModelFeatures());
    }
}
