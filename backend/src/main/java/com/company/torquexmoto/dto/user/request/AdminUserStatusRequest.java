package com.company.torquexmoto.dto.user.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserStatusRequest {

    @NotNull(message = "Active status must be provided")
    private Boolean isActive;
}
