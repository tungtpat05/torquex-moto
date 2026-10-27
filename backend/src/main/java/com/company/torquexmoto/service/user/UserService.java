package com.company.torquexmoto.service.user;

import com.company.torquexmoto.dto.user.response.UserResponse;
import com.company.torquexmoto.entity.user.User;
import com.company.torquexmoto.exception.ResourceNotFoundException;
import com.company.torquexmoto.mapper.user.UserMapper;
import com.company.torquexmoto.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserResponse getByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return userMapper.toResponse(user);
    }
}

