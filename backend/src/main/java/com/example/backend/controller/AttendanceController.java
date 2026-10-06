package com.example.backend.controller;

import com.example.backend.entity.Attendance;
import com.example.backend.service.AttendanceService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {

        this.attendanceService = attendanceService;
    }

    // =========================================================
    // GET ATTENDANCE
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getAttendance(
            Authentication authentication) {

        try {

            String email = authentication.getName();

            String role = getRole(authentication);

            List<Attendance> attendance =
                    attendanceService.getAttendance(
                            email,
                            role
                    );

            return ResponseEntity.ok(attendance);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getAttendanceById(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            String email =
                    authentication.getName();

            String role =
                    getRole(authentication);

            Attendance attendance =
                    attendanceService.getAttendanceById(
                            id,
                            email,
                            role
                    );

            return ResponseEntity.ok(attendance);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // EMPLOYEE CHECK-IN
    // =========================================================

    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(
            Authentication authentication) {

        try {

            String email =
                    authentication.getName();

            String role =
                    getRole(authentication);

            Attendance attendance =
                    attendanceService.checkIn(
                            email,
                            role
                    );

            return ResponseEntity.ok(attendance);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // EMPLOYEE CHECK-OUT
    // =========================================================

    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(
            Authentication authentication) {

        try {

            String email =
                    authentication.getName();

            String role =
                    getRole(authentication);

            Attendance attendance =
                    attendanceService.checkOut(
                            email,
                            role
                    );

            return ResponseEntity.ok(attendance);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // ADMIN / HR MANUAL RECORD
    // =========================================================

    @PostMapping
    public ResponseEntity<?> addAttendance(
            @RequestBody Attendance attendance,
            Authentication authentication) {

        try {

            String role =
                    getRole(authentication);

            Attendance savedAttendance =
                    attendanceService.addAttendance(
                            attendance,
                            role
                    );

            return ResponseEntity.ok(
                    savedAttendance
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // ADMIN / HR UPDATE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttendance(
            @PathVariable Long id,
            @RequestBody Attendance attendanceDetails,
            Authentication authentication) {

        try {

            String role =
                    getRole(authentication);

            Attendance updatedAttendance =
                    attendanceService.updateAttendance(
                            id,
                            attendanceDetails,
                            role
                    );

            return ResponseEntity.ok(
                    updatedAttendance
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // ADMIN / HR DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendance(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            String role =
                    getRole(authentication);

            attendanceService.deleteAttendance(
                    id,
                    role
            );

            return ResponseEntity
                    .noContent()
                    .build();

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