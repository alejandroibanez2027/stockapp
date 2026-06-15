package com.stockflow.stockflow.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockflow.stockflow.dtos.MovementRequest;
import com.stockflow.stockflow.responses.MovementResponse;
import com.stockflow.stockflow.services.MovementService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/movements")
public class MovementController {

    public final MovementService movementService;
    
    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @PostMapping
    public MovementResponse save(@RequestBody MovementRequest movementRequest) {
        return movementService.save(movementRequest);
    }

    @GetMapping("/{productId}")
    public List<MovementResponse> getMovementHistory(@PathVariable Long productId) {
        return movementService.findByProductId(productId);
    }    
}
