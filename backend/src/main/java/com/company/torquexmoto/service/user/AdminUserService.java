package com.company.torquexmoto.service.user;

import com.company.torquexmoto.dto.user.request.AdminCreateStaffRequest;
import com.company.torquexmoto.dto.user.request.AdminResetPasswordRequest;
import com.company.torquexmoto.dto.user.request.AdminUpdateStaffRequest;
import com.company.torquexmoto.dto.user.request.AdminUserStatusRequest;
import com.company.torquexmoto.dto.user.response.AdminUserResponse;
import com.company.torquexmoto.dto.user.response.AdminUserSummaryResponse;
import com.company.torquexmoto.entity.common.enums.Role;
import com.company.torquexmoto.entity.user.User;
import com.company.torquexmoto.entity.user.UserSocialAccount;
import com.company.torquexmoto.exception.DuplicateResourceException;
import com.company.torquexmoto.exception.ResourceNotFoundException;
import com.company.torquexmoto.mapper.user.UserMapper;
import com.company.torquexmoto.repository.user.UserRepository;
import com.company.torquexmoto.repository.user.UserSocialAccountRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private static final int MAX_PAGE_SIZE = 100;

    private final UserRepository userRepository;
    private final UserSocialAccountRepository userSocialAccountRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public AdminUserSummaryResponse getSummary() {
        long totalUsers = userRepository.count();
        long adminCount = userRepository.countByRole(Role.ADMIN);
        long staffCount = userRepository.countByRole(Role.STAFF);
        long customerCount = userRepository.countByRole(Role.CUSTOMER);
        long activeCount = userRepository.countByIsActiveTrue();
        long lockedCount = userRepository.countByIsActiveFalse();
        long googleCustomerCount = userRepository.countDistinctByRoleAndSocialProvider(Role.CUSTOMER, "google");

        return AdminUserSummaryResponse.builder()
                .totalUsers(totalUsers)
                .internalCount(adminCount + staffCount)
                .staffCount(staffCount)
                .adminCount(adminCount)
                .customerCount(customerCount)
                .activeCount(activeCount)
                .lockedCount(lockedCount)
                .googleCustomerCount(googleCustomerCount)
                .build();
    }

    public Page<AdminUserResponse> getUsers(
            String group,
            Role role,
            Boolean isActive,
            String search,
            int page,
            int size
    ) {
        String normalizedGroup = normalizeGroup(group);
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), MAX_PAGE_SIZE);

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by(Sort.Direction.DESC, "id"))
        );

        Specification<User> spec = buildUserSpecification(normalizedGroup, role, isActive, search);
        Page<User> usersPage = userRepository.findAll(spec, pageable);

        List<Integer> userIds = usersPage.getContent().stream()
                .map(User::getId)
                .toList();
        Map<Integer, List<String>> providersByUserId = loadAuthProvidersByUserIds(userIds);

        return usersPage.map(user ->
                userMapper.toAdminResponse(user, providersByUserId.getOrDefault(user.getId(), List.of()))
        );
    }

    public AdminUserResponse getUserById(Integer id) {
        User user = findUserOrThrow(id);
        Map<Integer, List<String>> providersByUserId = loadAuthProvidersByUserIds(List.of(id));
        return userMapper.toAdminResponse(user, providersByUserId.getOrDefault(id, List.of()));
    }

    @Transactional
    public AdminUserResponse createStaff(AdminCreateStaffRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateResourceException("User", "email", normalizedEmail);
        }

        User newStaff = User.builder()
                .fullName(request.getFullName().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.STAFF)
                .isActive(request.getIsActive() != null ? request.getIsActive() : Boolean.TRUE)
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(newStaff);
        return userMapper.toAdminResponse(saved, List.of());
    }

    @Transactional
    public AdminUserResponse updateStaff(Integer id, AdminUpdateStaffRequest request) {
        User target = findUserOrThrow(id);
        if (target.getRole() != Role.STAFF) {
            throw new IllegalArgumentException("Only STAFF internal accounts can be edited");
        }

        target.setFullName(request.getFullName().trim());
        target.setIsActive(request.getIsActive());

        User saved = userRepository.save(target);
        Map<Integer, List<String>> providersByUserId = loadAuthProvidersByUserIds(List.of(id));
        return userMapper.toAdminResponse(saved, providersByUserId.getOrDefault(id, List.of()));
    }

    @Transactional
    public AdminUserResponse updateUserStatus(
            Integer id,
            AdminUserStatusRequest request,
            String currentAdminEmail
    ) {
        User target = findUserOrThrow(id);

        if (currentAdminEmail != null
                && target.getEmail() != null
                && currentAdminEmail.trim().equalsIgnoreCase(target.getEmail().trim())) {
            throw new IllegalArgumentException("Cannot change status of your own admin account");
        }

        if (target.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot lock or unlock ADMIN accounts");
        }

        target.setIsActive(request.getIsActive());
        User saved = userRepository.save(target);
        Map<Integer, List<String>> providersByUserId = loadAuthProvidersByUserIds(List.of(id));
        return userMapper.toAdminResponse(saved, providersByUserId.getOrDefault(id, List.of()));
    }

    @Transactional
    public void resetStaffPassword(Integer id, AdminResetPasswordRequest request) {
        User target = findUserOrThrow(id);
        if (target.getRole() != Role.STAFF) {
            throw new IllegalArgumentException("Only STAFF internal accounts can have their password reset");
        }

        target.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(target);
    }

    private User findUserOrThrow(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    private String normalizeGroup(String group) {
        if (group == null || group.isBlank()) {
            return "ALL";
        }
        String normalized = group.trim().toUpperCase(Locale.ROOT);
        if (!Set.of("ALL", "INTERNAL", "CUSTOMER").contains(normalized)) {
            throw new IllegalArgumentException("Invalid user group filter: " + group);
        }
        return normalized;
    }

    private Specification<User> buildUserSpecification(
            String group,
            Role role,
            Boolean isActive,
            String search
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if ("INTERNAL".equals(group)) {
                predicates.add(root.get("role").in(Role.ADMIN, Role.STAFF));
            } else if ("CUSTOMER".equals(group)) {
                predicates.add(cb.equal(root.get("role"), Role.CUSTOMER));
            }

            if (role != null) {
                predicates.add(cb.equal(root.get("role"), role));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("fullName")), pattern),
                        cb.like(cb.lower(root.get("email")), pattern)
                ));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private Map<Integer, List<String>> loadAuthProvidersByUserIds(List<Integer> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Map.of();
        }
        List<UserSocialAccount> socialAccounts = userSocialAccountRepository.findByUserIdIn(userIds);
        Map<Integer, Set<String>> grouped = new LinkedHashMap<>();
        for (UserSocialAccount account : socialAccounts) {
            if (account.getUser() == null || account.getUser().getId() == null || account.getProvider() == null) {
                continue;
            }
            String provider = account.getProvider().trim().toUpperCase(Locale.ROOT);
            if (!provider.isEmpty()) {
                grouped.computeIfAbsent(account.getUser().getId(), ignored -> new LinkedHashSet<>())
                        .add(provider);
            }
        }
        Map<Integer, List<String>> result = new LinkedHashMap<>();
        grouped.forEach((userId, providers) -> result.put(userId, List.copyOf(providers)));
        return result;
    }
}
