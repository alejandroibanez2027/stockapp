package com.stockflow.stockflow.dtos;

import com.stockflow.stockflow.enums.MovementType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MovementRequest {
    @NotNull @NotBlank
    private MovementType type;

    @NotNull @NotBlank
    private Long productId;

    @NotNull @NotBlank
    private Long quantity;

    @NotNull @NotBlank
    private String reason;
}
