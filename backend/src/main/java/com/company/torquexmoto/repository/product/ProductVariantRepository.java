package com.company.torquexmoto.repository.product;

import com.company.torquexmoto.entity.product.ProductVariant;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
    @EntityGraph(attributePaths = {"color", "product"})
    List<ProductVariant> findByProductId(Integer productId);

    @EntityGraph(attributePaths = {"color", "product"})
    List<ProductVariant> findByProductIdIn(List<Integer> productIds);

    Optional<ProductVariant> findBySku(String sku);
    List<ProductVariant> findByProductIdAndIsActive(Integer productId, Boolean isActive);

    boolean existsBySku(String sku);
}

