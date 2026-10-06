package com.example.backend.controller;

import com.example.backend.entity.Leave;
import com.example.backend.service.LeaveService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    /*
     * ADMIN / HR -> all leaves
     * EMPLOYEE -> own leaves
     */
    @GetMapping
    public ResponseEntity<?> getLeaves(
            Authentication authentication) {

        try {

            String email = authentication.getName();

            String role = authentication
                    .getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority()
                    .replace("ROLE_", "");

            List<Leave> leaves =
                    leaveService.getLeaves(
                            email,
                            role
                    );

            return ResponseEntity.ok(leaves);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    /*
     * EMPLOYEE applies leave.
     */
    @PostMapping
    public ResponseEntity<?> applyLeave(
            @RequestBody Leave leave,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            Leave savedLeave =
                    leaveService.applyLeave(
                            leave,
                            email
                    );

            return ResponseEntity.ok(savedLeave);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    /*
     * ADMIN / HR approve or reject.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateLeaveStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        try {
            String role = getRole(authentication);

            String status = request.get("status");

            Leave updatedLeave =
                    leaveService.updateLeaveStatus(
                            id,
                            status,
                            role
                    );

            return ResponseEntity.ok(updatedLeave);

        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    /*
     * ADMIN / HR can delete any leave.
     * EMPLOYEE can delete own Pending leave.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLeave(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            String role = authentication
                    .getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority()
                    .replace("ROLE_", "");

            leaveService.deleteLeave(
                    id,
                    email,
                    role
            );

            return ResponseEntity.noContent().build();

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    private String getRole(Authentication authentication) {
        return authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");
    }
}