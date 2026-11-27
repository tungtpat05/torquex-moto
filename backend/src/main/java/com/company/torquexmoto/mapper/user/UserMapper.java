package com.company.torquexmoto.mapper.user;

import com.company.torquexmoto.dto.user.response.AdminUserResponse;
import com.company.torquexmoto.dto.user.response.UserResponse;
import com.company.torquexmoto.entity.user.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserMapper {

    public UserResponse toResponse(User entity) {
        UserResponse dto = new UserResponse();
        
        dto.setId(entity.getId());
        dto.setEmail(entity.getEmail());
        dto.setFullName(entity.getFullName());
        dto.setRole(entity.getRole());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());

        return dto;
    }

    public AdminUserResponse toAdminResponse(User entity, List<String> authProviders) {
        return AdminUserResponse.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .fullName(entity.getFullName())
                .role(entity.getRole())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .authProviders(authProviders == null ? List.of() : authProviders)
                .build();
    }
}
