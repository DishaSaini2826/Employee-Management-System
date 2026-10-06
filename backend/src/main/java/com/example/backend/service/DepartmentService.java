package com.example.backend.service;

import com.example.backend.entity.Department;
import com.example.backend.repository.DepartmentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(
            DepartmentRepository departmentRepository) {

        this.departmentRepository = departmentRepository;
    }

    // =========================
    // GET ALL DEPARTMENTS
    // =========================
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // =========================
    // ADD DEPARTMENT
    // ADMIN + HR ONLY
    // =========================
    public Department addDepartment(
            Department department,
            String role) {

        checkManagementAccess(role);

        validateDepartment(department);

        return departmentRepository.save(department);
    }

    // =========================
    // UPDATE DEPARTMENT
    // ADMIN + HR ONLY
    // =========================
    public Department updateDepartment(
            Long id,
            Department departmentDetails,
            String role) {

        checkManagementAccess(role);

        Department department = departmentRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found."
                        ));

        validateDepartment(departmentDetails);

        department.setName(
                departmentDetails.getName().trim()
        );

        department.setDescription(
                departmentDetails.getDescription() == null
                        ? ""
                        : departmentDetails.getDescription().trim()
        );

        return departmentRepository.save(department);
    }

    // =========================
    // DELETE DEPARTMENT
    // ADMIN + HR ONLY
    // =========================
    public void deleteDepartment(
            Long id,
            String role) {

        checkManagementAccess(role);

        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException(
                    "Department not found."
            );
        }

        departmentRepository.deleteById(id);
    }

    // =========================
    // ROLE CHECK
    // =========================
    private void checkManagementAccess(String role) {

        if (!"ADMIN".equals(role) &&
                !"HR".equals(role)) {

            throw new IllegalArgumentException(
                    "You are not authorized to manage departments."
            );
        }
    }

    // =========================
    // VALIDATION
    // =========================
    private void validateDepartment(
            Department department) {

        if (department == null) {
            throw new IllegalArgumentException(
                    "Department data is required."
            );
        }

        if (department.getName() == null ||
                department.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Department name is required."
            );
        }

        if (department.getName().trim().length() < 2) {

            throw new IllegalArgumentException(
                    "Department name must contain at least 2 characters."
            );
        }
    }
}