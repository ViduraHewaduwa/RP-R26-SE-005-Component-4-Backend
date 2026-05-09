package com.yourapp.sprintcost.exception;

public class PredictionIntegrationException extends RuntimeException {

    public PredictionIntegrationException(String message) {
        super(message);
    }

    public PredictionIntegrationException(String message, Throwable cause) {
        super(message, cause);
    }
}
