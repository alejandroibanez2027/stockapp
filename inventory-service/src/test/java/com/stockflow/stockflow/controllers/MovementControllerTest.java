package com.stockflow.stockflow.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class MovementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldRegisterInMovement() throws Exception {
        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "productId": 1,
                                    "type": "IN",
                                    "quantity": 5,
                                    "reason": "Restock"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.movementId").isNumber())
                .andExpect(jsonPath("$.productId").value(1));
    }

    @Test
    void shouldReturnMovementHistory() throws Exception {
        mockMvc.perform(get("/api/v1/movements/1/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void shouldRejectOutMovementWhenStockInsufficient() throws Exception {
        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "productId": 1,
                                    "type": "OUT",
                                    "quantity": 99999,
                                    "reason": "Massive sale"
                                }
                                """))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void shouldReturn404WhenProductNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/movements/99999/history"))
                .andExpect(status().isNotFound());
    }
}
