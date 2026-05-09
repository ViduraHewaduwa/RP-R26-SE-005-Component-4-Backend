package com.yourapp.sprintcost.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "prediction.model")
public class PredictionModelProperties {

    private String pythonExecutable;
    private String predictorScript;
    private String artifactsRoot;
    private String trainingModuleRoot;

    public String getPythonExecutable() {
        return pythonExecutable;
    }

    public void setPythonExecutable(String pythonExecutable) {
        this.pythonExecutable = pythonExecutable;
    }

    public String getPredictorScript() {
        return predictorScript;
    }

    public void setPredictorScript(String predictorScript) {
        this.predictorScript = predictorScript;
    }

    public String getArtifactsRoot() {
        return artifactsRoot;
    }

    public void setArtifactsRoot(String artifactsRoot) {
        this.artifactsRoot = artifactsRoot;
    }

    public String getTrainingModuleRoot() {
        return trainingModuleRoot;
    }

    public void setTrainingModuleRoot(String trainingModuleRoot) {
        this.trainingModuleRoot = trainingModuleRoot;
    }
}
