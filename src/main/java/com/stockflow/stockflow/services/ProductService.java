package com.stockflow.stockflow.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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

        if (StringUtils.hasText(category)) {
            return productRepository.findByCategory(category, pageable)
                    .map(productMapper::toResponse);
        }

        return productRepository.findAll(pageable)
                .map(productMapper::toResponse);
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
