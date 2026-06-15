package com.stockflow.stockflow.responses;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MovementResponse {
    private Long movementId;
    private String type;    
    private Long quantity;
    private String reason;
    private LocalDateTime createdAt;
    private ProductResponse product;
}