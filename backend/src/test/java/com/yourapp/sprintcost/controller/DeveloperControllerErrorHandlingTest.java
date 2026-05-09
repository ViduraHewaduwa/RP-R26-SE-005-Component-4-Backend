package com.yourapp.sprintcost.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.yourapp.sprintcost.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.MockMvc;

class DeveloperControllerErrorHandlingTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(new DeveloperController(null))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    }

    @Test
    void returnsUsefulMessageForInvalidEnumValue() throws Exception {
        String requestBody = """
            {
              "name": "Nimal Perera",
              "seniority": "SENIOR",
              "hourlyRate": 45.00,
              "allocationPercent": 100.0,
              "role": "ENGINEER",
              "teamId": 1,
              "skills": [],
              "calendarEntries": []
            }
            """;

        mockMvc.perform(
                post("/api/developers")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Malformed request body"))
            .andExpect(jsonPath("$.details[0]").value(
                "Malformed JSON request body. Check that Postman variables are resolved and the JSON syntax is valid."
            ));
    }

    @Test
    void returnsUsefulMessageForUnresolvedNumericVariable() throws Exception {
        String requestBody = """
            {
              "name": "Nimal Perera",
              "seniority": "SENIOR",
              "hourlyRate": 45.00,
              "allocationPercent": 100.0,
              "role": "BACKEND",
              "teamId": "{{teamId}}",
              "skills": [],
              "calendarEntries": []
            }
            """;

        mockMvc.perform(
                post("/api/developers")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Malformed request body"))
            .andExpect(jsonPath("$.details[0]").value(
                "Malformed JSON request body. Check that Postman variables are resolved and the JSON syntax is valid."
            ));
    }
}
