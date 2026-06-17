package com.stockflow.stockflow.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.stockflow.stockflow.dtos.MovementRequest;
import com.stockflow.stockflow.entities.Movement;
import com.stockflow.stockflow.entities.Product;
import com.stockflow.stockflow.enums.MovementType;
import com.stockflow.stockflow.exceptions.custom.InsufficientStockException;
import com.stockflow.stockflow.mappers.MovementMapper;
import com.stockflow.stockflow.repository.MovementRepository;
import com.stockflow.stockflow.repository.ProductRepository;
import com.stockflow.stockflow.responses.MovementResponse;

@ExtendWith(MockitoExtension.class)
class MovementServiceTest {

    @Mock
    private MovementRepository movementRepository;

    @Mock
    private ProductRepository productRepository;

    private MovementService movementService;

    @BeforeEach
    void setUp() {
        movementService = new MovementService(movementRepository, new MovementMapper(), productRepository);
    }

    @Test
    void shouldIncreaseStockWhenMovementIsIn() {
        Product product = product(1L, 10L);
        MovementRequest request = movementRequest(1L, MovementType.IN, 5L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> {
            Movement movement = invocation.getArgument(0);
            movement.setMovementId(99L);
            movement.setCreatedAt(LocalDateTime.now());
            return movement;
        });

        MovementResponse response = movementService.save(request);

        assertThat(product.getCurrentStock()).isEqualTo(15L);
        assertThat(response.getMovementId()).isEqualTo(99L);
        assertThat(response.getProductId()).isEqualTo(1L);
        verify(productRepository).save(product);
    }

    @Test
    void shouldDecreaseStockWhenMovementIsOut() {
        Product product = product(1L, 10L);
        MovementRequest request = movementRequest(1L, MovementType.OUT, 4L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> {
            Movement movement = invocation.getArgument(0);
            movement.setMovementId(100L);
            movement.setCreatedAt(LocalDateTime.now());
            return movement;
        });

        MovementResponse response = movementService.save(request);

        assertThat(product.getCurrentStock()).isEqualTo(6L);
        assertThat(response.getProductId()).isEqualTo(1L);
        verify(productRepository).save(product);
    }

    @Test
    void shouldRejectOutMovementWhenStockIsInsufficient() {
        Product product = product(1L, 3L);
        MovementRequest request = movementRequest(1L, MovementType.OUT, 5L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> movementService.save(request))
                .isInstanceOf(InsufficientStockException.class);

        verify(movementRepository, never()).save(any(Movement.class));
        verify(productRepository, never()).save(product);
    }

    @Test
    void shouldReturnMovementHistoryByProduct() {
        Product product = product(1L, 8L);
        Movement movement = Movement.builder()
                .movementId(7L)
                .product(product)
                .type(MovementType.IN.name())
                .quantity(2L)
                .reason("Restock")
                .createdAt(LocalDateTime.now())
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.findByProduct(product)).thenReturn(List.of(movement));

        List<MovementResponse> history = movementService.findByProductId(1L);

        assertThat(history).hasSize(1);
        assertThat(history.getFirst().getMovementId()).isEqualTo(7L);
        assertThat(history.getFirst().getProductId()).isEqualTo(1L);
    }

    private Product product(Long productId, Long currentStock) {
        return Product.builder()
                .productId(productId)
                .sku("SKU-1")
                .name("Laptop")
                .category("Electronics")
                .currentStock(currentStock)
                .minStock(2L)
                .unitPrice(1000.0)
                .build();
    }

    private MovementRequest movementRequest(Long productId, MovementType type, Long quantity) {
        MovementRequest request = new MovementRequest();
        request.setProductId(productId);
        request.setType(type);
        request.setQuantity(quantity);
        request.setReason("Test reason");
        return request;
    }
}
