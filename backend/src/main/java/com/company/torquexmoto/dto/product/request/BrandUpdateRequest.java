package com.company.torquexmoto.dto.product.request;

import lombok.*;
import jakarta.validation.constraints.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BrandUpdateRequest {
    @NotBlank(message = "Brand name must not be blank")
    @Size(min = 2, max = 100, message = "Brand name must be between 2 and 100 characters")
    private String brandName;

    @NotBlank(message = "Logo URL must not be blank")
    @Pattern(regexp = MediaValidation.MEDIA_PATH_REGEX, message = MediaValidation.MEDIA_PATH_MESSAGE)
    private String logoUrl;

    private String logoPublicId;

    @Size(max = 500, message = "Description must not exceed 500 characters")

    private String description;

    private Boolean isActive;
}
