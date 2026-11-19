package com.company.torquexmoto.controller.auth;

import com.company.torquexmoto.dto.auth.request.AuthenticationRequest;
import com.company.torquexmoto.dto.auth.request.RegisterRequest;
import com.company.torquexmoto.dto.auth.response.AuthenticationResponse;
import com.company.torquexmoto.dto.user.response.UserResponse;
import com.company.torquexmoto.service.auth.AuthenticationService;
import com.company.torquexmoto.service.user.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    private void attachAuthCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("authToken", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearAuthCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("authToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @Valid @RequestBody RegisterRequest registerRequest,
            HttpServletResponse response) {
        AuthenticationResponse authResponse = authenticationService.register(registerRequest);
        if (authResponse != null && authResponse.getToken() != null) {
            attachAuthCookie(response, authResponse.getToken());
        }
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping({ "/login", "/authenticate" })
    public ResponseEntity<AuthenticationResponse> authenticate(
            @Valid @RequestBody AuthenticationRequest authenticationRequest,
            HttpServletResponse response) {
        AuthenticationResponse authResponse = authenticationService.authenticate(authenticationRequest);
        if (authResponse != null && authResponse.getToken() != null) {
            attachAuthCookie(response, authResponse.getToken());
        }
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
        clearAuthCookie(response);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Unauthorized: No user is currently authenticated");
        }

        String email = principal.getName();
        UserResponse response = userService.getByEmail(email);

        return ResponseEntity.ok(response);
    }
}
