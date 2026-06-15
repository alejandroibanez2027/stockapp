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

import com.stockflow.stockflow.dtos.ProductRequest;
import com.stockflow.stockflow.responses.ProductResponse;
import com.stockflow.stockflow.services.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Page<ProductResponse> findAllFiltered(
        @RequestParam(required = false) String category,
        @PageableDefault() Pageable pageable
    ) {
        return productService.findAllFiltered(category, pageable);
    }

    @GetMapping("/{productId}")
    public ProductResponse findById(@PathVariable Long productId) {
        return productService.findById(productId);
    }

    @PostMapping
    public ProductResponse save(@RequestBody @Valid ProductRequest productRequest) {
        return productService.save(productRequest);
    }
}
