package com.company.torquexmoto.dto.user.response;

import com.company.torquexmoto.entity.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private Integer id;
    private String email;
    private String fullName;
    private Role role;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<String> authProviders;
}
