package com.stockflow.stockflow.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.stockflow.stockflow.entities.Product;
import com.stockflow.stockflow.enums.AlertSeverity;
import com.stockflow.stockflow.mappers.AlertMapper;
import com.stockflow.stockflow.repository.ProductRepository;
import com.stockflow.stockflow.responses.StockAlertResponse;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private ProductRepository productRepository;

    private AlertService alertService;

    @BeforeEach
    void setUp() {
        alertService = new AlertService(productRepository, new AlertMapper());
    }

    @Test
    void shouldReturnOnlyProductsBelowMinStock() {
        when(productRepository.findAll()).thenReturn(List.of(
                product(1L, "Laptop", 10L, 5L),
                product(2L, "Monitor", 2L, 5L),
                product(3L, "Mouse", 0L, 10L)));

        List<StockAlertResponse> alerts = alertService.getAlerts();

        assertThat(alerts).hasSize(2);
        assertThat(alerts).extracting(StockAlertResponse::getProductId)
                .containsExactly(2L, 3L);
    }

    @Test
    void shouldReturnEmptyListWhenNoAlerts() {
        when(productRepository.findAll()).thenReturn(List.of(
                product(1L, "Laptop", 10L, 5L),
                product(2L, "Monitor", 8L, 5L)));

        List<StockAlertResponse> alerts = alertService.getAlerts();

        assertThat(alerts).isEmpty();
    }

    @Test
    void shouldSetCriticalSeverityWhenStockIsBelowMin() {
        when(productRepository.findAll()).thenReturn(List.of(
                product(1L, "Mouse", 3L, 5L)));

        List<StockAlertResponse> alerts = alertService.getAlerts();

        assertThat(alerts.getFirst().getSeverity()).isEqualTo(AlertSeverity.CRITICAL);
    }

    @Test
    void shouldSetLowSeverityWhenStockEqualsMin() {
        when(productRepository.findAll()).thenReturn(List.of(
                product(1L, "Monitor", 5L, 5L)));

        List<StockAlertResponse> alerts = alertService.getAlerts();

        assertThat(alerts.getFirst().getSeverity()).isEqualTo(AlertSeverity.LOW);
    }

    @Test
    void fallbackShouldReturnEmptyList() {
        List<StockAlertResponse> fallback = alertService.getAlertsFallback(new RuntimeException("test"));

        assertThat(fallback).isEmpty();
    }

    private Product product(Long productId, String name, Long currentStock, Long minStock) {
        return Product.builder()
                .productId(productId)
                .sku("SKU-" + productId)
                .name(name)
                .category("Electronics")
                .currentStock(currentStock)
                .minStock(minStock)
                .unitPrice(100.0)
                .build();
    }
}
