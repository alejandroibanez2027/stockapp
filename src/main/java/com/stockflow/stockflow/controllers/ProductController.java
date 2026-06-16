package com.stockflow.stockflow.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stockflow.stockflow.docs.ProductEndpoint;
import com.stockflow.stockflow.dtos.ProductRequest;
import com.stockflow.stockflow.responses.ErrorResponse;
import com.stockflow.stockflow.responses.ProductResponse;
import com.stockflow.stockflow.services.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = ProductEndpoint.FIND_ALL.SUMMARY, description = ProductEndpoint.FIND_ALL.DESCRIPTION)
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista paginada de productos", content = @Content(array = @ArraySchema(schema = @Schema(implementation = ProductResponse.class))))
    })
    public Page<ProductResponse> findAllFiltered(
        @RequestParam(required = false) String category,
        @PageableDefault() Pageable pageable
    ) {
        return productService.findAllFiltered(category, pageable);
    }

    @GetMapping("/{productId}")
    @Operation(summary = ProductEndpoint.FIND_BY_ID.SUMMARY, description = ProductEndpoint.FIND_BY_ID.DESCRIPTION)
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Producto encontrado", content = @Content(schema = @Schema(implementation = ProductResponse.class))),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ProductResponse findById(@PathVariable Long productId) {
        return productService.findById(productId);
    }

    @PostMapping
    @Operation(summary = ProductEndpoint.SAVE.SUMMARY, description = ProductEndpoint.SAVE.DESCRIPTION)
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Producto creado", content = @Content(schema = @Schema(implementation = ProductResponse.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ProductResponse save(@RequestBody @Valid ProductRequest productRequest) {
        return productService.save(productRequest);
    }
}
