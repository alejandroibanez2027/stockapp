package com.stockflow.stockflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockflow.stockflow.entities.Movement;
import com.stockflow.stockflow.entities.Product;

@Repository
public interface MovementRepository extends JpaRepository<Movement, Long> {

    public List<Movement> findByProduct(Product product);
    
}
