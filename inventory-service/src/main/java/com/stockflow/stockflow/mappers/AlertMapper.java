package com.stockflow.stockflow.mappers;

import org.springframework.stereotype.Component;

import com.stockflow.stockflow.entities.Product;
import com.stockflow.stockflow.enums.AlertSeverity;
import com.stockflow.stockflow.responses.StockAlertResponse;

@Component
public class AlertMapper {

    public StockAlertResponse toResponse(Product product) {
        return StockAlertResponse.builder()
                .productId(product.getProductId())
                .sku(product.getSku())
                .productName(product.getName())
                .currentStock(product.getCurrentStock())
                .minStock(product.getMinStock())
                .severity(resolveSeverity(product.getCurrentStock(), product.getMinStock()))
                .build();
    }

    private AlertSeverity resolveSeverity(Long currentStock, Long minStock) {
        return currentStock < minStock ? AlertSeverity.CRITICAL : AlertSeverity.LOW;
    }
}
