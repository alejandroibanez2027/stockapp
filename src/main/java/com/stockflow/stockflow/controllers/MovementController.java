package com.stockflow.stockflow.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockflow.stockflow.docs.MovementEndpoint;
import com.stockflow.stockflow.dtos.MovementRequest;
import com.stockflow.stockflow.responses.ErrorResponse;
import com.stockflow.stockflow.responses.MovementResponse;
import com.stockflow.stockflow.services.MovementService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/movements")
public class MovementController {

    public final MovementService movementService;
    
    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @PostMapping
    @Operation(summary = MovementEndpoint.SAVE.SUMMARY, description = MovementEndpoint.SAVE.DESCRIPTION)
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Movimiento registrado y stock actualizado", content = @Content(schema = @Schema(implementation = MovementResponse.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "422", description = "Stock insuficiente para movimiento de salida", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public MovementResponse save(@RequestBody @Valid MovementRequest movementRequest) {
        return movementService.save(movementRequest);
    }

    @GetMapping("/{productId}/history")
    @Operation(summary = MovementEndpoint.FIND_BY_PRODUCT.SUMMARY, description = MovementEndpoint.FIND_BY_PRODUCT.DESCRIPTION)
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Historial de movimientos", content = @Content(schema = @Schema(implementation = MovementResponse.class))),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public List<MovementResponse> getMovementHistory(@PathVariable Long productId) {
        return movementService.findByProductId(productId);
    }    
}
