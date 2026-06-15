package com.stockflow.stockflow.mappers;

import org.springframework.stereotype.Component;

import com.stockflow.stockflow.dtos.MovementRequest;
import com.stockflow.stockflow.entities.Movement;
import com.stockflow.stockflow.responses.MovementResponse;

@Component
public class MovementMapper {

    private final ProductMapper productMapper;

    public MovementMapper(ProductMapper productMapper) {
        this.productMapper = productMapper;
    }

    public Movement toEntity(MovementRequest movementRequest) {
        return Movement.builder()
                .type(movementRequest.getType().toString())
                .quantity(movementRequest.getQuantity())
                .reason(movementRequest.getReason())
                .build();
    }

    public MovementResponse toResponse(Movement movement) {
        return MovementResponse.builder()
                .type(movement.getType())
                .quantity(movement.getQuantity())
                .createdAt(movement.getCreatedAt())
                .product(productMapper.toResponse(movement.getProduct()))
                .reason(movement.getReason())
                .build();
    }
}
