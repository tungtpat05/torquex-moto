package com.company.torquexmoto.dto.product.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProductSpecificationResponse {
    private Integer id;
    private Integer productId;
    private Integer specDefinitionId;
    private String displayName;
    private String keyCode;
    private String dataType;
    private String unit;
    private String value;
    private BigDecimal valueNumber;
    private Integer optionId;
    private String optionValue;
}
