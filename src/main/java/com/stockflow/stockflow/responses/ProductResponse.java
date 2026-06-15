package com.stockflow.stockflow.responses;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponse {
    private Long productId;
    private String sku;
    private String name;
    private String category;
    private Long currentStock;
    private Long minStock;
    private Double unitPrice;
    private List<MovementResponse> movements;
}
