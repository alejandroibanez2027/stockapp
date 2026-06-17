package com.stockflow.stockflow.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductRequest {
    @NotNull @NotBlank
    private String sku;

    @NotNull @NotBlank
    private String name;

    @NotNull @NotBlank
    private String category;

    @NotNull
    private Long currentStock;

    @NotNull
    private Long minStock;

    @NotNull
    private Double unitPrice;
}
