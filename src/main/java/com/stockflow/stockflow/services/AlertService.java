package com.stockflow.stockflow.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.stockflow.stockflow.entities.Product;
import com.stockflow.stockflow.enums.AlertSeverity;
import com.stockflow.stockflow.repository.ProductRepository;
import com.stockflow.stockflow.responses.StockAlertResponse;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@Service
public class AlertService {

    private final ProductRepository productRepository;

    public AlertService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @CircuitBreaker(name = "alertService", fallbackMethod = "getAlertsFallback")
    public List<StockAlertResponse> getAlerts() {
        return productRepository.findAll().stream()
                .filter(product -> product.getCurrentStock() <= product.getMinStock())
                .map(this::toAlertResponse)
                .toList();
    }

    public List<StockAlertResponse> getAlertsFallback(Throwable t) {
        return List.of();
    }

    private StockAlertResponse toAlertResponse(Product product) {
        return StockAlertResponse.builder()
                .productId(product.getProductId())
                .productName(product.getName())
                .currentStock(product.getCurrentStock())
                .minStock(product.getMinStock())
                .severity(resolveSeverity(product.getCurrentStock()))
                .build();
    }

    private AlertSeverity resolveSeverity(Long currentStock) {
        return currentStock == 0 ? AlertSeverity.CRITICAL : AlertSeverity.LOW;
    }
}
