package com.example.backend.service;

import com.example.backend.dto.UserResponseDTO;
import com.example.backend.entity.Employee;
import com.example.backend.entity.User;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ====================================================
    // GET ALL USERS
    // ====================================================

    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // ====================================================
    // CREATE USER
    // ====================================================

    public UserResponseDTO createUser(
            User user,
            String currentRole) {

        validateRolePermissionForCreate(
                currentRole,
                user.getRole()
        );

        validateUserData(user, true);

        String role = user.getRole().trim().toUpperCase();

        user.setRole(role);

        // -----------------------------------------------
        // ADMIN CANNOT BE CREATED
        // -----------------------------------------------

        if ("ADMIN".equals(role)) {

            throw new IllegalArgumentException(
                    "ADMIN account cannot be created."
            );
        }

        // -----------------------------------------------
        // EMAIL DUPLICATE CHECK
        // -----------------------------------------------

        if (userRepository.existsByEmail(
                user.getEmail())) {

            throw new IllegalArgumentException(
                    "Email is already registered."
            );
        }

        // -----------------------------------------------
        // EMPLOYEE LOGIN
        // -----------------------------------------------

        if ("EMPLOYEE".equals(role)) {

            if (user.getEmployeeId() == null) {

                throw new IllegalArgumentException(
                        "Employee must be selected."
                );
            }

            Employee employee = employeeRepository
                    .findById(user.getEmployeeId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Selected employee does not exist."
                            ));

            if (userRepository.existsByEmployeeId(
                    employee.getId())) {

                throw new IllegalArgumentException(
                        "This employee already has a login account."
                );
            }

            user.setEmployeeId(employee.getId());
            user.setName(employee.getName());
            user.setEmail(employee.getEmail());
        }

        // -----------------------------------------------
        // HR DOES NOT LINK TO EMPLOYEE
        // -----------------------------------------------

        else if ("HR".equals(role)) {

            user.setEmployeeId(null);
        }

        // -----------------------------------------------
        // PASSWORD ENCRYPTION
        // -----------------------------------------------

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        User savedUser =
                userRepository.save(user);

        return convertToDTO(savedUser);
    }

    // ====================================================
    // UPDATE USER
    // ====================================================

    public UserResponseDTO updateUser(
            Long id,
            User updatedUser,
            String currentRole) {

        User existingUser = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found."
                        ));

        // -----------------------------------------------
        // ADMIN ACCOUNT PROTECTED
        // -----------------------------------------------

        if ("ADMIN".equals(existingUser.getRole())) {

            throw new IllegalArgumentException(
                    "ADMIN account cannot be modified."
            );
        }

        // -----------------------------------------------
        // HR CAN MODIFY ONLY EMPLOYEE ACCOUNTS
        // -----------------------------------------------

        if ("HR".equals(currentRole)
                && !"EMPLOYEE".equals(
                        existingUser.getRole())) {

            throw new IllegalArgumentException(
                    "HR can modify only Employee accounts."
            );
        }

        // -----------------------------------------------
        // VALIDATE ROLE
        // -----------------------------------------------

        if (updatedUser.getRole() == null
                || updatedUser.getRole().isBlank()) {

            throw new IllegalArgumentException(
                    "Role is required."
            );
        }

        String newRole =
                updatedUser.getRole()
                        .trim()
                        .toUpperCase();

        // -----------------------------------------------
        // ADMIN CANNOT BE ASSIGNED
        // -----------------------------------------------

        if ("ADMIN".equals(newRole)) {

            throw new IllegalArgumentException(
                    "ADMIN role cannot be assigned."
            );
        }

        // -----------------------------------------------
        // HR CANNOT CREATE/ASSIGN HR
        // -----------------------------------------------

        if ("HR".equals(currentRole)
                && !"EMPLOYEE".equals(newRole)) {

            throw new IllegalArgumentException(
                    "HR cannot assign the HR role."
            );
        }

        // -----------------------------------------------
        // EMAIL DUPLICATE CHECK
        // -----------------------------------------------

        if (!existingUser.getEmail()
                .equalsIgnoreCase(
                        updatedUser.getEmail())) {

            if (userRepository.existsByEmail(
                    updatedUser.getEmail())) {

                throw new IllegalArgumentException(
                        "Email is already registered."
                );
            }
        }

        existingUser.setName(
                updatedUser.getName()
        );

        existingUser.setEmail(
                updatedUser.getEmail()
        );

        // ---------------------------------------------------
        // SYNC EMPLOYEE DATA
        // ---------------------------------------------------

        if (existingUser.getEmployeeId() != null) {

            Employee employee = employeeRepository
                    .findById(existingUser.getEmployeeId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Linked employee does not exist."
                            ));

            employee.setName(updatedUser.getName());
            employee.setEmail(updatedUser.getEmail());

            employeeRepository.save(employee);
        }

        existingUser.setRole(newRole);

        // -----------------------------------------------
        // EMPLOYEE LINK
        // -----------------------------------------------

        if ("EMPLOYEE".equals(newRole)) {

            if (updatedUser.getEmployeeId() == null) {

                throw new IllegalArgumentException(
                        "Employee must be selected."
                );
            }

            Employee employee =
                    employeeRepository
                            .findById(
                                    updatedUser.getEmployeeId()
                            )
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Selected employee does not exist."
                                    ));

            // Check duplicate employee login
            userRepository.findAll()
                    .stream()
                    .filter(u ->
                            u.getEmployeeId() != null)
                    .filter(u ->
                            u.getEmployeeId()
                                    .equals(employee.getId()))
                    .filter(u ->
                            !u.getId().equals(id))
                    .findFirst()
                    .ifPresent(u -> {

                        throw new IllegalArgumentException(
                                "This employee already has a login account."
                        );
                    });

            existingUser.setEmployeeId(
                    employee.getId()
            );
        }

        // -----------------------------------------------
        // HR DOES NOT HAVE EMPLOYEE LINK
        // -----------------------------------------------

        else if ("HR".equals(newRole)) {

            existingUser.setEmployeeId(null);
        }

        // -----------------------------------------------
        // OPTIONAL PASSWORD CHANGE
        // -----------------------------------------------

        if (updatedUser.getPassword() != null
                && !updatedUser.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            updatedUser.getPassword()
                    )
            );
        }

        User savedUser =
                userRepository.save(existingUser);

        return convertToDTO(savedUser);
    }

    // ====================================================
    // DELETE USER
    // ====================================================

    public void deleteUser(
            Long id,
            String currentRole) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found."
                        ));

        // -----------------------------------------------
        // ADMIN PROTECTED
        // -----------------------------------------------

        if ("ADMIN".equals(user.getRole())) {

            throw new IllegalArgumentException(
                    "ADMIN account cannot be deleted."
            );
        }

        // -----------------------------------------------
        // HR CAN DELETE ONLY EMPLOYEE USERS
        // -----------------------------------------------

        if ("HR".equals(currentRole)
                && !"EMPLOYEE".equals(
                        user.getRole())) {

            throw new IllegalArgumentException(
                    "HR can delete only Employee accounts."
            );
        }

        userRepository.deleteById(id);
    }

    // ====================================================
    // VALIDATE USER
    // ====================================================

    private void validateUserData(
            User user,
            boolean creating) {

        if (user.getName() == null
                || user.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Name is required."
            );
        }

        if (user.getEmail() == null
                || user.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }

        if (creating
                && (user.getPassword() == null
                || user.getPassword().isBlank())) {

            throw new IllegalArgumentException(
                    "Password is required."
            );
        }

        if (user.getRole() == null
                || user.getRole().isBlank()) {

            throw new IllegalArgumentException(
                    "Role is required."
            );
        }
    }

    // ====================================================
    // CREATE ROLE PERMISSION
    // ====================================================

    private void validateRolePermissionForCreate(
            String currentRole,
            String requestedRole) {

        if (requestedRole == null
                || requestedRole.isBlank()) {

            throw new IllegalArgumentException(
                    "Role is required."
            );
        }

        String role =
                requestedRole.trim().toUpperCase();

        // Nobody can create ADMIN
        if ("ADMIN".equals(role)) {

            throw new IllegalArgumentException(
                    "ADMIN account cannot be created."
            );
        }

        // HR can create only Employee
        if ("HR".equals(currentRole)
                && !"EMPLOYEE".equals(role)) {

            throw new IllegalArgumentException(
                    "HR can create only Employee accounts."
            );
        }

        // Only ADMIN and HR can create users
        if (!"ADMIN".equals(currentRole)
                && !"HR".equals(currentRole)) {

            throw new IllegalArgumentException(
                    "You are not authorized to create users."
            );
        }
    }

    // ====================================================
    // DTO CONVERSION
    // ====================================================

    private UserResponseDTO convertToDTO(
            User user) {

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getEmployeeId()
        );
    }
}