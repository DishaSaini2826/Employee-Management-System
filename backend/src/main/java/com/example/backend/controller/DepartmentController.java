package com.example.backend.controller;

import com.example.backend.entity.Department;
import com.example.backend.service.DepartmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(
            DepartmentService departmentService) {

        this.departmentService = departmentService;
    }

    // =========================
    // GET ALL DEPARTMENTS
    // ADMIN + HR + EMPLOYEE
    // =========================
    @GetMapping
    public ResponseEntity<?> getAllDepartments() {

        try {

            List<Department> departments =
                    departmentService.getAllDepartments();

            return ResponseEntity.ok(departments);

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // ADD DEPARTMENT
    // ADMIN + HR
    // =========================
    @PostMapping
    public ResponseEntity<?> addDepartment(
            @RequestBody Department department,
            Authentication authentication) {

        try {

            String role = getRole(authentication);

            Department savedDepartment =
                    departmentService.addDepartment(
                            department,
                            role
                    );

            return ResponseEntity.ok(savedDepartment);

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // UPDATE DEPARTMENT
    // ADMIN + HR
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(
            @PathVariable Long id,
            @RequestBody Department departmentDetails,
            Authentication authentication) {

        try {

            String role = getRole(authentication);

            Department updatedDepartment =
                    departmentService.updateDepartment(
                            id,
                            departmentDetails,
                            role
                    );

            return ResponseEntity.ok(updatedDepartment);

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // DELETE DEPARTMENT
    // ADMIN + HR
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            String role = getRole(authentication);

            departmentService.deleteDepartment(
                    id,
                    role
            );

            return ResponseEntity.noContent().build();

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // GET ROLE FROM JWT
    // =========================
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