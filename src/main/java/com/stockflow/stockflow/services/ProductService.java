package com.stockflow.stockflow.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stockflow.stockflow.dtos.ProductRequest;
import com.stockflow.stockflow.exceptions.custom.ProductNotFoundException;
import com.stockflow.stockflow.mappers.ProductMapper;
import com.stockflow.stockflow.repository.ProductRepository;
import com.stockflow.stockflow.responses.ProductResponse;


@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;        
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> findAllFiltered(String category, Pageable pageable) {

        if (category != null) {
            return productRepository.findByCategory(category, pageable)
                .map(productMapper::toResponse);
        }

        List<ProductResponse> products = productRepository.findAll(pageable).stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());

            return new PageImpl<>(products, pageable, products.size());
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long productId) {
        return productRepository.findById(productId)
                .map(productMapper::toResponse)
                .orElseThrow(() -> new ProductNotFoundException(productId));
    }

    public ProductResponse save(ProductRequest productRequest) {
        return productMapper.toResponse(
            productRepository.save(productMapper.toEntity(productRequest)));
    }
}
