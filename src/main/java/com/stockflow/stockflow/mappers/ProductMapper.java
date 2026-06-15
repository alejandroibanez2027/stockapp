package com.stockflow.stockflow.mappers;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.stockflow.stockflow.dtos.ProductRequest;
import com.stockflow.stockflow.entities.Product;
import com.stockflow.stockflow.responses.ProductResponse;

@Component
public class ProductMapper {

    private final MovementMapper movementMapper;

    ProductMapper(@Lazy MovementMapper movementMapper) {
        this.movementMapper = movementMapper;
    }

    public Product toEntity(ProductRequest productRequest) {
        return Product.builder()
                .sku(productRequest.getSku())
                .name(productRequest.getName())
                .category(productRequest.getCategory())
                .currentStock(productRequest.getCurrentStock())
                .minStock(productRequest.getMinStock())
                .unitPrice(productRequest.getUnitPrice())
                .build();
    }

    public ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .sku(product.getSku())
                .name(product.getName())
                .category(product.getCategory())
                .currentStock(product.getCurrentStock())
                .minStock(product.getMinStock())
                .unitPrice(product.getUnitPrice())
                .movements(product.getMovements().stream().map(movementMapper::toResponse).toList())
                .build();
    }
}
