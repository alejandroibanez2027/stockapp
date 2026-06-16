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

        if (products.isEmpty()) {
            return Health.up()
                    .withDetail("criticalPercentage", 0)
                    .withDetail("message", "No hay productos registrados")
                    .build();
        }

        long criticalCount = products.stream()
                .filter(p -> p.getCurrentStock() == 0)
                .count();

        double percentage = (criticalCount * 100.0) / products.size();
        boolean isDown = percentage > 20;

        if (isDown) {
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
