
package com.stockflow.stockflow.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockflow.stockflow.entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    public Page<Product> findByCategory(String category, Pageable pageable);
}
