package com.stockflow.stockflow.exceptions.custom;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String message) {
        super(message);
    }
}
