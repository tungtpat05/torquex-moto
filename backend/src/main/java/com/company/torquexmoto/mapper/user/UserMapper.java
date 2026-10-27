package com.company.torquexmoto.mapper.user;

import com.company.torquexmoto.dto.user.response.UserResponse;
import com.company.torquexmoto.entity.user.User;
import org.springframework.stereotype.Component;

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
}
