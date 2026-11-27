package com.company.torquexmoto.dto.product.request;

import lombok.*;
import jakarta.validation.constraints.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductImageUpdateRequest {
    @NotBlank(message = "Image URL must not be blank")
    @Pattern(regexp = MediaValidation.MEDIA_PATH_REGEX, message = MediaValidation.MEDIA_PATH_MESSAGE)
    private String imageUrl;

    private String imagePublicId;

    private Integer displayOrder;
}

