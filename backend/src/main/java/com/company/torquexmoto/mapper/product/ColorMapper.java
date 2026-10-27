package com.company.torquexmoto.mapper.product;

import com.company.torquexmoto.dto.product.request.ColorCreateRequest;
import com.company.torquexmoto.dto.product.request.ColorUpdateRequest;
import com.company.torquexmoto.dto.product.response.ColorResponse;
import com.company.torquexmoto.entity.product.Color;
import org.springframework.stereotype.Component;

@Component
public class ColorMapper {
    public ColorResponse toResponse(Color entity) {
        ColorResponse dto = new ColorResponse();

        dto.setId(entity.getId());
        dto.setColorName(entity.getColorName());
        dto.setColorCode(entity.getColorCode());

        return dto;
    }

    public Color toEntity(ColorCreateRequest request) {
        Color dto = new Color();

        dto.setColorName(request.getColorName());
        dto.setColorCode(request.getColorCode());

        return dto;
    }

    public void updateEntityFromRequest(ColorUpdateRequest request, Color color) {
        color.setColorName(request.getColorName());
        color.setColorCode(request.getColorCode());
    }
}
