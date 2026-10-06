
package com.example.backend.controller;

import com.example.backend.service.PasswordResetService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(
            PasswordResetService passwordResetService) {

        this.passwordResetService =
                passwordResetService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> request) {

        try {

            String email = request.get("email");

            if (email == null ||
                    email.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email is required.");
            }

            passwordResetService.sendOtp(email);

            return ResponseEntity.ok(
                    "OTP sent successfully to your email."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> request) {

        try {

            String email = request.get("email");
            String otp = request.get("otp");
            String newPassword =
                    request.get("newPassword");

            if (email == null ||
                    email.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email is required.");
            }

            if (otp == null ||
                    otp.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("OTP is required.");
            }

            if (newPassword == null ||
                    newPassword.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("New password is required.");
            }

            passwordResetService.resetPassword(
                    email,
                    otp,
                    newPassword
            );

            return ResponseEntity.ok(
                    "Password reset successfully."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}