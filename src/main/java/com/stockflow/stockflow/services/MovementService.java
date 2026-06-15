package com.stockflow.stockflow.services;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;

import com.stockflow.stockflow.dtos.MovementRequest;
import com.stockflow.stockflow.entities.Movement;
import com.stockflow.stockflow.entities.Product;
import com.stockflow.stockflow.enums.MovementType;
import com.stockflow.stockflow.exceptions.custom.InsufficientStockException;
import com.stockflow.stockflow.exceptions.custom.ProductNotFoundException;
import com.stockflow.stockflow.mappers.MovementMapper;
import com.stockflow.stockflow.repository.MovementRepository;
import com.stockflow.stockflow.repository.ProductRepository;
import com.stockflow.stockflow.responses.MovementResponse;

@Service
@Transactional
public class MovementService {

    private static final Logger log = LoggerFactory.getLogger(MovementService.class);

    private final MovementRepository movementRepository;
    private final ProductRepository productRepository;
    private final MovementMapper movementMapper;

    public MovementService(MovementRepository movementRepository, MovementMapper movementMapper, ProductRepository productRepository) {
        this.movementRepository = movementRepository;
        this.productRepository = productRepository;
        this.movementMapper = movementMapper;
    }

    @Transactional(readOnly = true)
    @RateLimiter(name = "movementHistory")
    public List<MovementResponse> findByProductId(Long productId) {

        Product product = findProduct(productId);

        return movementRepository.findByProduct(product).stream()
            .map(movementMapper::toResponse)
            .collect(Collectors.toList());            
    }
    
    @Retry(name = "movementService", fallbackMethod = "saveFallback")
    public MovementResponse save(MovementRequest movementRequest) {

        Product product = findProduct(movementRequest.getProductId());
        Movement movementEntity = movementMapper.toEntity(movementRequest);

        if (movementRequest.getType() == MovementType.OUT
                && product.getCurrentStock() < movementRequest.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock for product " + product.getName() + " with sku " + product.getSku());
        }

        updateProductStock(product, movementRequest.getType(), movementRequest.getQuantity());
        movementEntity.setProduct(product);

        return movementMapper.toResponse(movementRepository.save(movementEntity));
    }

    @Transactional(readOnly = true)
    private Product findProduct(Long productId) {
        return productRepository.findById(productId).orElseThrow(
            () -> new ProductNotFoundException(productId));
    }

    public MovementResponse saveFallback(MovementRequest movementRequest, Throwable t) {
        log.error("Error al registrar movimiento después de reintentos: {}", t.getMessage());
        throw new RuntimeException("No se pudo registrar el movimiento después de múltiples intentos", t);
    }

    private void updateProductStock(Product product, MovementType type, Long quantity) {
        long updatedStock = type == MovementType.OUT
                ? product.getCurrentStock() - quantity
                : product.getCurrentStock() + quantity;

        product.setCurrentStock(updatedStock);
        productRepository.save(product);
    }
}
