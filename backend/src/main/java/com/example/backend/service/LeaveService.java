package com.example.backend.service;

import com.example.backend.entity.Employee;
import com.example.backend.entity.Leave;
import com.example.backend.entity.User;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.repository.LeaveRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveService(
            LeaveRepository leaveRepository,
            UserRepository userRepository,
            EmployeeRepository employeeRepository) {

        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    /*
     * ADMIN / HR:
     * Get all leaves
     *
     * EMPLOYEE:
     * Get only their own leaves
     */
    public List<Leave> getLeaves(
            String email,
            String role) {

        if (role.equals("ADMIN") || role.equals("HR")) {
            return leaveRepository.findAll();
        }

        User user = getUserByEmail(email);

        if (user.getEmployeeId() == null) {
            throw new IllegalArgumentException(
                    "Your account is not linked to an employee."
            );
        }

        return leaveRepository.findAll()
                .stream()
                .filter(leave ->
                        leave.getEmployeeId() != null &&
                        leave.getEmployeeId()
                                .equals(user.getEmployeeId())
                )
                .toList();
    }

    /*
     * Employee applies for leave.
     * Employee ID and name are taken from
     * the logged-in user's account.
     */
    public Leave applyLeave(
            Leave leave,
            String email) {

        User user = getUserByEmail(email);

        if (user.getEmployeeId() == null) {
            throw new IllegalArgumentException(
                    "Your account is not linked to an employee."
            );
        }

        Employee employee = employeeRepository
                .findById(user.getEmployeeId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Employee record not found."
                        )
                );

        if (leave.getLeaveType() == null ||
                leave.getLeaveType().isBlank()) {

            throw new IllegalArgumentException(
                    "Leave type is required."
            );
        }

        if (leave.getStartDate() == null ||
                leave.getEndDate() == null) {

            throw new IllegalArgumentException(
                    "Start date and end date are required."
            );
        }

        if (leave.getEndDate()
                .isBefore(leave.getStartDate())) {

            throw new IllegalArgumentException(
                    "End date cannot be before start date."
            );
        }

        if (leave.getReason() == null ||
                leave.getReason().isBlank()) {

            throw new IllegalArgumentException(
                    "Reason is required."
            );
        }

        leave.setEmployeeId(employee.getId());
        leave.setEmployeeName(employee.getName());
        leave.setStatus("Pending");

        return leaveRepository.save(leave);
    }

    /*
     * Only ADMIN / HR can approve or reject.
     */
    public Leave updateLeaveStatus(
            Long id,
            String status,
            String role) {

        if (!"ADMIN".equals(role) && !"HR".equals(role)) {
            throw new IllegalArgumentException(
                    "You are not authorized to approve or reject leaves."
            );
        }

        if (!"Approved".equals(status)
                && !"Rejected".equals(status)) {

            throw new IllegalArgumentException(
                    "Status must be Approved or Rejected."
            );
        }

        Leave leave = leaveRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Leave not found."));

        if (!"Pending".equals(leave.getStatus())) {
            throw new IllegalArgumentException(
                    "Only pending leaves can be approved or rejected."
            );
        }

        leave.setStatus(status);

        return leaveRepository.save(leave);
    }

    /*
     * ADMIN / HR can delete any leave.
     *
     * EMPLOYEE can delete only their own
     * Pending leave.
     */
    public void deleteLeave(
            Long id,
            String email,
            String role) {

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Leave not found."
                        )
                );

        if (role.equals("ADMIN") ||
                role.equals("HR")) {

            leaveRepository.deleteById(id);
            return;
        }

        User user = getUserByEmail(email);

        if (user.getEmployeeId() == null ||
                leave.getEmployeeId() == null ||
                !leave.getEmployeeId()
                        .equals(user.getEmployeeId())) {

            throw new IllegalArgumentException(
                    "You can delete only your own leave."
            );
        }

        if (!"Pending".equals(leave.getStatus())) {

            throw new IllegalArgumentException(
                    "Only Pending leave can be deleted."
            );
        }

        leaveRepository.deleteById(id);
    }

    private User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User account not found."
                        )
                );
    }
}