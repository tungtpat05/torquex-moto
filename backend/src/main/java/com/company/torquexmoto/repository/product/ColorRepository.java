package com.company.torquexmoto.repository.product;

import com.company.torquexmoto.entity.product.Color;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColorRepository extends JpaRepository<Color,Integer> {
    boolean existsByColorName(String colorName);
}
