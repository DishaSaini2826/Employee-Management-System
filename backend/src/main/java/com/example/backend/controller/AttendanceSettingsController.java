package com.example.backend.controller;

import com.example.backend.entity.AttendanceSettings;
import com.example.backend.service.AttendanceSettingsService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/attendance-settings")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceSettingsController {

    private final AttendanceSettingsService service;

    public AttendanceSettingsController(
            AttendanceSettingsService service) {
        this.service = service;
    }

    // =========================================================
    // GET SETTINGS
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getSettings() {

        try {

            return ResponseEntity.ok(
                    service.getSettings()
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // GET CURRENT WINDOW STATUS
    // =========================================================

    @GetMapping("/status")
    public ResponseEntity<?> getCurrentStatus() {

        try {

            Map<String, Object> status =
                    service.getCurrentStatus();

            return ResponseEntity.ok(status);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // SAVE / UPDATE SETTINGS
    // ADMIN / HR ONLY
    // =========================================================

    @PutMapping
    public ResponseEntity<?> saveSettings(
            @RequestBody AttendanceSettings settings,
            Authentication authentication) {

        try {

            String role = getRole(authentication);

            AttendanceSettings saved =
                    service.saveSettings(
                            settings,
                            role
                    );

            return ResponseEntity.ok(saved);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // MARK TODAY AS HOLIDAY
    // ADMIN / HR ONLY
    // =========================================================

    @PostMapping("/holiday")
    public ResponseEntity<?> markTodayAsHoliday(
            Authentication authentication) {

        try {

            String role = getRole(authentication);

            AttendanceSettings updated =
                    service.markTodayAsHoliday(role);

            return ResponseEntity.ok(updated);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // CANCEL TODAY'S HOLIDAY
    // ADMIN / HR ONLY
    // =========================================================

    @DeleteMapping("/holiday")
    public ResponseEntity<?> cancelTodayHoliday(
            Authentication authentication) {

        try {

            String role = getRole(authentication);

            AttendanceSettings updated =
                    service.cancelTodayHoliday(role);

            return ResponseEntity.ok(updated);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // ROLE HELPER
    // =========================================================

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