package com.example.backend.service;

import com.example.backend.entity.Employee;
import com.example.backend.entity.User;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            UserRepository userRepository) {

        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    // ====================================================
    // GET ALL EMPLOYEES
    // ====================================================

    public List<Employee> getAllEmployees(
            String email,
            String role) {

        // ADMIN and HR can view all employees
        if ("ADMIN".equals(role)
                || "HR".equals(role)) {

            return employeeRepository.findAll();
        }

        // EMPLOYEE can view only own employee record
        User user = getUserByEmail(email);

        if (user.getEmployeeId() == null) {

            throw new IllegalArgumentException(
                    "Your account is not linked to an employee."
            );
        }

        return employeeRepository
                .findById(user.getEmployeeId())
                .map(List::of)
                .orElse(List.of());
    }

    // ====================================================
    // GET EMPLOYEE BY ID
    // ====================================================

    public Optional<Employee> getEmployeeById(
            Long id,
            String email,
            String role) {

        // ADMIN and HR can view any employee
        if ("ADMIN".equals(role)
                || "HR".equals(role)) {

            return employeeRepository.findById(id);
        }

        // EMPLOYEE can view only own profile
        User user = getUserByEmail(email);

        if (user.getEmployeeId() == null) {

            throw new IllegalArgumentException(
                    "Your account is not linked to an employee."
            );
        }

        if (!user.getEmployeeId().equals(id)) {

            throw new IllegalArgumentException(
                    "You can view only your own employee profile."
            );
        }

        return employeeRepository.findById(id);
    }

    // ====================================================
    // ADD EMPLOYEE
    // ====================================================

    public Employee addEmployee(
            Employee employee,
            String role) {

        if (!"ADMIN".equals(role)
                && !"HR".equals(role)) {

            throw new IllegalArgumentException(
                    "You are not authorized to add employees."
            );
        }

        validateEmployee(employee);

        if (employeeRepository.existsByEmployeeCode(
                employee.getEmployeeCode())) {

            throw new IllegalArgumentException(
                    "Employee code already exists."
            );
        }

        if (employeeRepository.existsByEmail(
                employee.getEmail())) {

            throw new IllegalArgumentException(
                    "Email already exists."
            );
        }

        if (employee.getStatus() == null
                || employee.getStatus().isBlank()) {

            employee.setStatus("Active");
        }

        return employeeRepository.save(employee);
    }

    // ====================================================
    // UPDATE EMPLOYEE
    // ====================================================

    public Employee updateEmployee(
            Long id,
            Employee employeeDetails,
            String role) {

        if (!"ADMIN".equals(role)
                && !"HR".equals(role)) {

            throw new IllegalArgumentException(
                    "You are not authorized to update employees."
            );
        }

        Employee employee = employeeRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found."
                        ));

        validateEmployee(employeeDetails);

        if (employeeRepository
                .existsByEmployeeCodeAndIdNot(
                        employeeDetails.getEmployeeCode(),
                        id)) {

            throw new IllegalArgumentException(
                    "Employee code already exists."
            );
        }

        if (employeeRepository
                .existsByEmailAndIdNot(
                        employeeDetails.getEmail(),
                        id)) {

            throw new IllegalArgumentException(
                    "Email already exists."
            );
        }

        employee.setEmployeeCode(
                employeeDetails.getEmployeeCode()
        );

        employee.setName(
                employeeDetails.getName()
        );

        employee.setEmail(
                employeeDetails.getEmail()
        );

        employee.setPhone(
                employeeDetails.getPhone()
        );

        employee.setDepartment(
                employeeDetails.getDepartment()
        );

        employee.setDesignation(
                employeeDetails.getDesignation()
        );

        employee.setSalary(
                employeeDetails.getSalary()
        );

        employee.setJoiningDate(
                employeeDetails.getJoiningDate()
        );

        employee.setStatus(
                employeeDetails.getStatus()
        );
        
     // Update linked user account details
        Optional<User> userOptional =
                userRepository.findByEmployeeId(id);

        if (userOptional.isPresent()) {

            User user = userOptional.get();

            user.setName(employeeDetails.getName());
            user.setEmail(employeeDetails.getEmail());

            userRepository.save(user);
        }
        return employeeRepository.save(employee);
    }

    // ====================================================
    // DELETE EMPLOYEE
    // ====================================================

    public void deleteEmployee(
            Long id,
            String role) {

        // Only ADMIN and HR
        if (!"ADMIN".equals(role)
                && !"HR".equals(role)) {

            throw new IllegalArgumentException(
                    "You are not authorized to delete employees."
            );
        }

        // Check employee exists
        if (!employeeRepository.existsById(id)) {

            throw new RuntimeException(
                    "Employee not found."
            );
        }

        // ------------------------------------------------
        // IMPORTANT:
        // Do not delete an employee who has a login account.
        // ------------------------------------------------

        if (userRepository.existsByEmployeeId(id)) {

            throw new IllegalArgumentException(
                    "This employee has a login account. " +
                    "Delete the employee's login account first."
            );
        }

        employeeRepository.deleteById(id);
    }

    // ====================================================
    // GET USER BY EMAIL
    // ====================================================

    private User getUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User account not found."
                        ));
    }

    // ====================================================
    // EMPLOYEE VALIDATION
    // ====================================================

    private void validateEmployee(
            Employee employee) {

        if (employee.getEmployeeCode() == null
                || employee.getEmployeeCode().isBlank()) {

            throw new IllegalArgumentException(
                    "Employee code is required."
            );
        }

        if (employee.getName() == null
                || employee.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Employee name is required."
            );
        }

        if (employee.getEmail() == null
                || employee.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }

        if (!employee.getEmail().matches(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {

            throw new IllegalArgumentException(
                    "Please enter a valid email address."
            );
        }

        if (employee.getSalary() != null
                && employee.getSalary() < 0) {

            throw new IllegalArgumentException(
                    "Salary cannot be negative."
            );
        }

        if (employee.getJoiningDate() == null) {

            throw new IllegalArgumentException(
                    "Joining date is required."
            );
        }

        if (employee.getStatus() != null
                && !employee.getStatus().equals("Active")
                && !employee.getStatus().equals("Inactive")) {

            throw new IllegalArgumentException(
                    "Status must be Active or Inactive."
            );
        }
    }
}