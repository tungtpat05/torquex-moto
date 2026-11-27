package com.company.torquexmoto.dto.user.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminResetPasswordRequest {

    @NotBlank(message = "New password must not be blank")
    @Size(min = 6, max = 255, message = "New password must be between 6 and 255 characters")
    private String newPassword;
}
