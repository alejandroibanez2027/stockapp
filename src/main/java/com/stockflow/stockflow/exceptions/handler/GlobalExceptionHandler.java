package com.stockflow.stockflow.exceptions.handler;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.stockflow.stockflow.exceptions.custom.InsufficientStockException;
import com.stockflow.stockflow.exceptions.custom.ProductNotFoundException;
import com.stockflow.stockflow.responses.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProductNotFoundException(ProductNotFoundException ex, WebRequest request) {
        ErrorResponse body = ErrorResponse.builder()
                .error(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .path(request.getDescription(false))
                .status(false)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientStockException(InsufficientStockException ex, WebRequest request) {
        ErrorResponse body = ErrorResponse.builder()
                .error(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .path(request.getDescription(false))
                .status(false)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining("; "));
                
        ErrorResponse body = ErrorResponse.builder()
                .error(ex.getClass().getSimpleName())
                .message(message)
                .path(request.getDescription(false))
                .status(false)
                .timestamp(LocalDateTime.now())
                .build();
                
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex, WebRequest request) {
        ErrorResponse body = ErrorResponse.builder()
                .error(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .path(request.getDescription(false))
                .status(false)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
