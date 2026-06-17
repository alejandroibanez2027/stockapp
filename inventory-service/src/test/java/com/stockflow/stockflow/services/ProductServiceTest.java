package com.stockflow.stockflow.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import com.stockflow.stockflow.entities.Product;
import com.stockflow.stockflow.mappers.ProductMapper;
import com.stockflow.stockflow.repository.ProductRepository;
import com.stockflow.stockflow.responses.ProductResponse;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(productRepository, new ProductMapper());
    }

    @Test
    void shouldPreserveRealPaginationTotalsWhenCategoryIsNotProvided() {
        PageRequest pageable = PageRequest.of(0, 2);
        Page<Product> productPage = new PageImpl<>(
                List.of(product(1L, "Laptop"), product(2L, "Monitor")),
                pageable,
                5);

        when(productRepository.findAll(pageable)).thenReturn(productPage);

        Page<ProductResponse> response = productService.findAllFiltered(null, pageable);

        assertThat(response.getTotalElements()).isEqualTo(5);
        assertThat(response.getContent()).hasSize(2);
        assertThat(response.getContent().getFirst().getName()).isEqualTo("Laptop");
    }

    private Product product(Long productId, String name) {
        return Product.builder()
                .productId(productId)
                .sku("SKU-" + productId)
                .name(name)
                .category("Electronics")
                .currentStock(10L)
                .minStock(2L)
                .unitPrice(100.0)
                .build();
    }
}
