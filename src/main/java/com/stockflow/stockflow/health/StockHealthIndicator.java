package com.stockflow.stockflow.health;

import java.util.List;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import com.stockflow.stockflow.entities.Product;
import com.stockflow.stockflow.repository.ProductRepository;

@Component
public class StockHealthIndicator implements HealthIndicator {

    private final ProductRepository productRepository;

    public StockHealthIndicator(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Health health() {
        List<Product> products = productRepository.findAll();

        // Si no hay productos, se reporta UP con 0% crítico
        if (products.isEmpty()) {
            return Health.up()
                    .withDetail("criticalPercentage", 0)
                    .withDetail("message", "No hay productos registrados")
                    .build();
        }

        // Cuenta productos con stock por debajo del mínimo (currentStock < minStock → severidad CRITICAL)
        long criticalCount = products.stream()
                .filter(p -> p.getCurrentStock() < p.getMinStock())
                .count();

        // Calcula porcentaje de productos en estado crítico sobre el total
        double percentage = (criticalCount * 100.0) / products.size();

        // Si más del 20% supera el umbral, el health check reporta DOWN
        if (percentage > 20) {
            return Health.down()
                    .withDetail("criticalPercentage", Math.round(percentage * 100.0) / 100.0)
                    .withDetail("message", "Más del 20% de los productos están en estado crítico")
                    .build();
        }

        return Health.up()
                .withDetail("criticalPercentage", Math.round(percentage * 100.0) / 100.0)
                .withDetail("message", "Porcentaje de productos críticos dentro del límite")
                .build();
    }
}
