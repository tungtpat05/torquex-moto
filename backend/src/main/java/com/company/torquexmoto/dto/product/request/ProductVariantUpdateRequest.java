package com.company.torquexmoto.dto.product.request;

import jakarta.validation.constraints.Pattern;
import lombok.*;
import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductVariantUpdateRequest {
    private Integer colorId;
    private String sku;
    private BigDecimal additionalPrice;
    private Integer stockQuantity;
    @Pattern(regexp = MediaValidation.MEDIA_PATH_REGEX, message = MediaValidation.MEDIA_PATH_MESSAGE)
    private String variantImage;
    private String variantImagePublicId;
    private Boolean isActive;
}

