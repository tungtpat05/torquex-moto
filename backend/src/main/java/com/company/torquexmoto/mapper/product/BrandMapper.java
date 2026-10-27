package com.company.torquexmoto.mapper.product;

import com.company.torquexmoto.dto.product.request.BrandCreateRequest;
import com.company.torquexmoto.dto.product.request.BrandUpdateRequest;
import com.company.torquexmoto.dto.product.response.BrandResponse;
import com.company.torquexmoto.entity.product.Brand;
import org.springframework.stereotype.Component;

@Component
public class BrandMapper {
    public BrandResponse toResponse(Brand entity) {
        BrandResponse dto = new BrandResponse();

        dto.setId(entity.getId());
        dto.setBrandName(entity.getBrandName());
        dto.setLogoUrl(entity.getLogoUrl());
        dto.setLogoPublicId(entity.getLogoPublicId());
        dto.setDescription(entity.getDescription());
        dto.setIsActive(entity.getIsActive());

        return dto;
    }

    public Brand toEntity(BrandCreateRequest request) {
        Brand dto = new Brand();

        dto.setBrandName(request.getBrandName());
        dto.setLogoUrl(request.getLogoUrl());
        dto.setLogoPublicId(request.getLogoPublicId());
        dto.setDescription(request.getDescription());

        return dto;
    }

    public void updateEntiryFromRequest(BrandUpdateRequest request, Brand brand) {
        brand.setBrandName(request.getBrandName());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setLogoPublicId(request.getLogoPublicId());
        brand.setDescription(request.getDescription());
        brand.setIsActive(request.getIsActive());
    }

}
