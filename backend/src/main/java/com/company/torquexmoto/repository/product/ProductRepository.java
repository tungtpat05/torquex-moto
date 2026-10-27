package com.company.torquexmoto.repository.product;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.torquexmoto.entity.product.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{
    List<Product> findByCategoryId(Integer categoryId);
}
