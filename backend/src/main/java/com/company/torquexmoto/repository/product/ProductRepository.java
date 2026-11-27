package com.company.torquexmoto.repository.product;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.torquexmoto.entity.product.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Override
    @EntityGraph(attributePaths = {"brand", "category"})
    List<Product> findAll();

    @Override
    @EntityGraph(attributePaths = {"brand", "category"})
    Optional<Product> findById(Integer id);

    @EntityGraph(attributePaths = {"brand", "category"})
    List<Product> findByCategoryId(Integer categoryId);
}
