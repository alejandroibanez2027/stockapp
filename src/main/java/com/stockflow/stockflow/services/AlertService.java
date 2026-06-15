package com.stockflow.stockflow.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.stockflow.stockflow.mappers.AlertMapper;
import com.stockflow.stockflow.repository.ProductRepository;
import com.stockflow.stockflow.responses.StockAlertResponse;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);

    private final ProductRepository productRepository;
    private final AlertMapper alertMapper;

    public AlertService(ProductRepository productRepository, AlertMapper alertMapper) {
        this.productRepository = productRepository;
        this.alertMapper = alertMapper;
    }

    @CircuitBreaker(name = "alertService", fallbackMethod = "getAlertsFallback")
    public List<StockAlertResponse> getAlerts() {
        return productRepository.findAll().stream()
                .filter(product -> product.getCurrentStock() <= product.getMinStock())
                .map(alertMapper::toResponse)
                .toList();
    }

    public List<StockAlertResponse> getAlertsFallback(Throwable t) {
        log.warn("Circuit abierto para getAlerts, retornando lista vacía. Causa: {}", t.getMessage());
        return List.of();
    }
}
