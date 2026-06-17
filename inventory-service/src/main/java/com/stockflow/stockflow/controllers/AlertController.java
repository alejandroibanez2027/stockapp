package com.stockflow.stockflow.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockflow.stockflow.docs.AlertEndpoint;
import com.stockflow.stockflow.responses.StockAlertResponse;
import com.stockflow.stockflow.services.AlertService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/v1/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    @Operation(summary = AlertEndpoint.FIND_ALL.SUMMARY, description = AlertEndpoint.FIND_ALL.DESCRIPTION)
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de alertas", content = @Content(array = @ArraySchema(schema = @Schema(implementation = StockAlertResponse.class))))
    })
    public List<StockAlertResponse> getAlerts() {
        return alertService.getAlerts();
    }
}
