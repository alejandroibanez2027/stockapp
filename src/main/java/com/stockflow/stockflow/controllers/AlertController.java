package com.stockflow.stockflow.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockflow.stockflow.responses.StockAlertResponse;
import com.stockflow.stockflow.services.AlertService;

@RestController
@RequestMapping("/api/v1/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<StockAlertResponse> getAlerts() {
        return alertService.getAlerts();
    }
}
