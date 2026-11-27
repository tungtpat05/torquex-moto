/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.company.torquexmoto.repository.user;

import com.company.torquexmoto.entity.common.enums.Role;
import com.company.torquexmoto.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 *
 * @author nguye
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmailIgnoreCase(String email);
    long countByRole(Role role);
    long countByIsActiveTrue();
    long countByIsActiveFalse();

    @Query("SELECT COUNT(DISTINCT u.id) FROM User u JOIN u.socialAccounts s WHERE u.role = :role AND LOWER(s.provider) = LOWER(:provider)")
    long countDistinctByRoleAndSocialProvider(@Param("role") Role role, @Param("provider") String provider);
}
