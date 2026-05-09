package com.yourapp.sprintcost.exception;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.fasterxml.jackson.databind.exc.PropertyBindingException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException exception) {
        return build(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler({InvalidRequestException.class, PredictionIntegrationException.class})
    public ResponseEntity<ApiErrorResponse> handleBadRequest(RuntimeException exception) {
        return build(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        List<String> details = exception.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .toList();
        return ResponseEntity.badRequest().body(
            new ApiErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                details
            )
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleUnreadableMessage(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest().body(
            new ApiErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Malformed request body",
                List.of(resolveMessage(exception))
            )
        );
    }

    private ResponseEntity<ApiErrorResponse> build(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(
            new ApiErrorResponse(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                List.of(message)
            )
        );
    }

    private String resolveMessage(HttpMessageNotReadableException exception) {
        Throwable cause = findCause(exception, InvalidFormatException.class);
        if (cause instanceof InvalidFormatException invalidFormatException) {
            return formatInvalidValueMessage(invalidFormatException);
        }

        cause = findCause(exception, PropertyBindingException.class);
        if (cause instanceof PropertyBindingException propertyBindingException) {
            return "Unknown field '%s' in request body".formatted(propertyBindingException.getPropertyName());
        }

        cause = exception.getMostSpecificCause();
        if (cause instanceof InvalidFormatException invalidFormatException) {
            return formatInvalidValueMessage(invalidFormatException);
        }
        if (cause instanceof PropertyBindingException propertyBindingException) {
            return "Unknown field '%s' in request body".formatted(propertyBindingException.getPropertyName());
        }
        return "Malformed JSON request body. Check that Postman variables are resolved and the JSON syntax is valid.";
    }

    private String formatInvalidValueMessage(InvalidFormatException exception) {
        String fieldName = formatPath(exception.getPath());
        Object rejectedValue = exception.getValue();
        Class<?> targetType = exception.getTargetType();

        if (targetType != null && targetType.isEnum()) {
            String allowedValues = Arrays.stream(targetType.getEnumConstants())
                .map(Objects::toString)
                .collect(Collectors.joining(", "));
            return "Invalid value '%s' for field '%s'. Supported values: %s"
                .formatted(rejectedValue, fieldName, allowedValues);
        }

        if (isNumericTarget(targetType)) {
            return "Invalid numeric value '%s' for field '%s'. This often means a Postman variable like {{teamId}} was not resolved."
                .formatted(rejectedValue, fieldName);
        }

        if (targetType != null && LocalDate.class.isAssignableFrom(targetType)) {
            return "Invalid date value '%s' for field '%s'. Expected ISO-8601 format such as 2026-05-07."
                .formatted(rejectedValue, fieldName);
        }

        return "Invalid value '%s' for field '%s'".formatted(rejectedValue, fieldName);
    }

    private Throwable findCause(Throwable throwable, Class<? extends Throwable> targetType) {
        Throwable current = throwable;
        while (current != null) {
            if (targetType.isInstance(current)) {
                return current;
            }
            current = current.getCause();
        }
        return null;
    }

    private String formatPath(List<JsonMappingException.Reference> path) {
        if (path == null || path.isEmpty()) {
            return "request body";
        }
        return path.stream()
            .map(reference -> reference.getFieldName() != null ? reference.getFieldName() : "[" + reference.getIndex() + "]")
            .collect(Collectors.joining("."));
    }

    private boolean isNumericTarget(Class<?> targetType) {
        if (targetType == null) {
            return false;
        }
        return Number.class.isAssignableFrom(targetType)
            || targetType == long.class
            || targetType == int.class
            || targetType == double.class
            || targetType == float.class
            || targetType == short.class
            || targetType == byte.class;
    }
}
