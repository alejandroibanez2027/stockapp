package com.stockflow.stockflow.responses;

import com.stockflow.stockflow.enums.AlertSeverity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StockAlertResponse {
    private Long productId;
    private String sku;
    private String productName;
    private Long currentStock;
    private Long minStock;
    private AlertSeverity severity;
}
