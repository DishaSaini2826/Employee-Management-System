package com.example.backend.controller;

import com.example.backend.entity.Employee;
import com.example.backend.service.EmployeeService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(
            EmployeeService employeeService) {

        this.employeeService = employeeService;
    }

    // ====================================================
    // GET ALL / OWN EMPLOYEE
    // ====================================================

    @GetMapping
    public ResponseEntity<?> getAllEmployees(
            Authentication authentication) {

        try {

            String email =
                    authentication.getName();

            String role =
                    getRole(authentication);

            List<Employee> employees =
                    employeeService.getAllEmployees(
                            email,
                            role
                    );

            return ResponseEntity.ok(employees);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ====================================================
    // GET EMPLOYEE BY ID
    // ====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            String email =
                    authentication.getName();

            String role =
                    getRole(authentication);

            return employeeService
                    .getEmployeeById(
                            id,
                            email,
                            role
                    )
                    .map(ResponseEntity::ok)
                    .orElse(
                        ResponseEntity.notFound().build()
                    );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ====================================================
    // ADD EMPLOYEE
    // ====================================================

    @PostMapping
    public ResponseEntity<?> addEmployee(
            @RequestBody Employee employee,
            Authentication authentication) {

        try {

            String role =
                    getRole(authentication);

            Employee savedEmployee =
                    employeeService.addEmployee(
                            employee,
                            role
                    );

            return ResponseEntity.ok(savedEmployee);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ====================================================
    // UPDATE EMPLOYEE
    // ====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employeeDetails,
            Authentication authentication) {

        try {

            String role =
                    getRole(authentication);

            Employee updatedEmployee =
                    employeeService.updateEmployee(
                            id,
                            employeeDetails,
                            role
                    );

            return ResponseEntity.ok(
                    updatedEmployee
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ====================================================
    // DELETE EMPLOYEE
    // ====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            String role =
                    getRole(authentication);

            employeeService.deleteEmployee(
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

    // ====================================================
    // GET ROLE FROM JWT
    // ====================================================

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