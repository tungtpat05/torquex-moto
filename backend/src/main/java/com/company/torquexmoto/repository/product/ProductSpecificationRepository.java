package com.company.torquexmoto.repository.product;

import com.company.torquexmoto.entity.product.ProductSpecification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, Integer> {
    @EntityGraph(attributePaths = {"specDefinition", "option", "product"})
    List<ProductSpecification> findByProductId(Integer productId);

    @EntityGraph(attributePaths = {"specDefinition", "option", "product"})
    List<ProductSpecification> findByProductIdInOrderBySpecDefinitionDisplayOrderAsc(List<Integer> productIds);

    boolean existsByProductIdAndSpecDefinitionId(Integer productId, Integer specDefinitionId);
}
