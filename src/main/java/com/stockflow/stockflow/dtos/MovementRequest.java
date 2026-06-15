package com.stockflow.stockflow.dtos;

import com.stockflow.stockflow.enums.MovementType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MovementRequest {
    @NotNull
    private MovementType type;

    @NotNull
    private Long productId;

    @NotNull
    @Positive
    private Long quantity;

    @NotBlank
    private String reason;
}
