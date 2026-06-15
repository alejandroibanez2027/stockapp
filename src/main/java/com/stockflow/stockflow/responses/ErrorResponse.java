package com.stockflow.stockflow.responses;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorResponse {
    private String error;
    private String message;
    private String path;
    private Boolean status;
    private LocalDateTime timestamp;
}