package com.example.backend.controller;

import com.example.backend.dto.UserResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ----------------------------------------------------
    // GET ALL USERS
    // ----------------------------------------------------

    @GetMapping
    public ResponseEntity<?> getAllUsers() {

        try {

            List<UserResponseDTO> users =
                    userService.getAllUsers();

            return ResponseEntity.ok(users);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ----------------------------------------------------
    // CREATE USER
    // ----------------------------------------------------

    @PostMapping
    public ResponseEntity<?> createUser(
            @RequestBody User user,
            Authentication authentication) {

        try {

            String currentRole =
                    getRole(authentication);

            UserResponseDTO savedUser =
                    userService.createUser(
                            user,
                            currentRole
                    );

            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ----------------------------------------------------
    // UPDATE USER
    // ----------------------------------------------------

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User user,
            Authentication authentication) {

        try {

            String currentRole =
                    getRole(authentication);

            UserResponseDTO updatedUser =
                    userService.updateUser(
                            id,
                            user,
                            currentRole
                    );

            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ----------------------------------------------------
    // DELETE USER
    // ----------------------------------------------------

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            String currentRole =
                    getRole(authentication);

            userService.deleteUser(
                    id,
                    currentRole
            );

            return ResponseEntity.noContent().build();

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ----------------------------------------------------
    // GET ROLE
    // ----------------------------------------------------

    private String getRole(
            Authentication authentication) {

        return authentication
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");
    }
}