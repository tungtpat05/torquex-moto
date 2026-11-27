package com.company.torquexmoto.controller.user;

import com.company.torquexmoto.dto.user.request.AdminCreateStaffRequest;
import com.company.torquexmoto.dto.user.request.AdminResetPasswordRequest;
import com.company.torquexmoto.dto.user.request.AdminUpdateStaffRequest;
import com.company.torquexmoto.dto.user.request.AdminUserStatusRequest;
import com.company.torquexmoto.dto.user.response.AdminUserResponse;
import com.company.torquexmoto.dto.user.response.AdminUserSummaryResponse;
import com.company.torquexmoto.entity.common.enums.Role;
import com.company.torquexmoto.service.user.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Locale;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping("/summary")
    public ResponseEntity<AdminUserSummaryResponse> getSummary() {
        return ResponseEntity.ok(adminUserService.getSummary());
    }

    @GetMapping
    public ResponseEntity<Page<AdminUserResponse>> getUsers(
            @RequestParam(defaultValue = "ALL") String group,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Role parsedRole = parseRole(role);
        return ResponseEntity.ok(adminUserService.getUsers(group, parsedRole, isActive, search, page, size));
    }

    private Role parseRole(String role) {
        if (role == null || role.isBlank()) {
            return null;
        }
        try {
            return Role.valueOf(role.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid role filter: " + role);
        }
    }

    @PostMapping
    public ResponseEntity<AdminUserResponse> createStaff(@Valid @RequestBody AdminCreateStaffRequest request) {
        AdminUserResponse created = adminUserService.createStaff(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserResponse> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(adminUserService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminUserResponse> updateStaff(
            @PathVariable Integer id,
            @Valid @RequestBody AdminUpdateStaffRequest request
    ) {
        return ResponseEntity.ok(adminUserService.updateStaff(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminUserResponse> updateUserStatus(
            @PathVariable Integer id,
            @Valid @RequestBody AdminUserStatusRequest request,
            Principal principal
    ) {
        String currentAdminEmail = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(adminUserService.updateUserStatus(id, request, currentAdminEmail));
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetStaffPassword(
            @PathVariable Integer id,
            @Valid @RequestBody AdminResetPasswordRequest request
    ) {
        adminUserService.resetStaffPassword(id, request);
        return ResponseEntity.noContent().build();
    }
}
