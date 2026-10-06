package com.example.backend.service;

import com.example.backend.entity.Attendance;
import com.example.backend.entity.AttendanceSettings;
import com.example.backend.entity.Employee;
import com.example.backend.entity.User;
import com.example.backend.repository.AttendanceRepository;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.example.backend.service.AttendanceSettingsService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import com.example.backend.service.AttendanceSettingsService;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceSettingsService settingsService,attendanceSettingsService;
    
    private final ZoneId INDIA_ZONE =
            ZoneId.of("Asia/Kolkata");

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            AttendanceSettingsService settingsService, AttendanceSettingsService attendanceSettingsService) {

        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.settingsService = settingsService;
        this.attendanceSettingsService = attendanceSettingsService;
   
    }

    // =========================================================
    // GET ATTENDANCE
    // ADMIN / HR -> ALL
    // EMPLOYEE   -> OWN
    // =========================================================

    public List<Attendance> getAttendance(
            String email,
            String role) {

        if (role.equals("ADMIN") ||
                role.equals("HR")) {

            return attendanceRepository.findAll();
        }

        User user =
                getUserByEmail(email);

        if (user.getEmployeeId() == null) {

            throw new IllegalArgumentException(
                    "Your account is not linked to an employee."
            );
        }

        return attendanceRepository.findAll()
                .stream()
                .filter(record ->
                        record.getEmployeeId() != null &&
                        record.getEmployeeId()
                                .equals(user.getEmployeeId()))
                .toList();
    }

    // =========================================================
    // GET ATTENDANCE BY ID
    // =========================================================

    public Attendance getAttendanceById(
            Long id,
            String email,
            String role) {

        Attendance attendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance record not found."
                                )
                        );

        if (role.equals("ADMIN") ||
                role.equals("HR")) {

            return attendance;
        }

        User user =
                getUserByEmail(email);

        if (user.getEmployeeId() == null ||
                attendance.getEmployeeId() == null ||
                !attendance.getEmployeeId()
                        .equals(user.getEmployeeId())) {

            throw new IllegalArgumentException(
                    "You are not authorized to view this attendance record."
            );
        }

        return attendance;
    }

    // =========================================================
    // EMPLOYEE CHECK-IN
    // SERVER TIME
    // =========================================================

    public Attendance checkIn(
            String email,
            String role) {

        if (!role.equals("EMPLOYEE")) {

            throw new IllegalArgumentException(
                    "Only employees can use Check In."
            );
        }

        if (attendanceSettingsService.isTodayHoliday()) {
            throw new RuntimeException(
                    "Today is a holiday. Attendance is not required."
            );
        }
        
        User user =
                getUserByEmail(email);

        if (user.getEmployeeId() == null) {

            throw new IllegalArgumentException(
                    "Your account is not linked to an employee."
            );
        }

        LocalDate today =
                LocalDate.now(INDIA_ZONE);

        LocalTime currentTime =
                LocalTime.now(INDIA_ZONE);

        AttendanceSettings settings =
                settingsService.getSettings();

        // -----------------------------------------------------
        // CHECK-IN WINDOW
        // -----------------------------------------------------

        boolean checkInOpen =
                !currentTime.isBefore(
                        settings.getCheckInStart()
                )
                &&
                !currentTime.isAfter(
                        settings.getCheckInEnd()
                );

        if (!checkInOpen) {

            throw new IllegalArgumentException(
                    "Check-in is currently closed. " +
                    "Allowed time: " +
                    settings.getCheckInStart() +
                    " to " +
                    settings.getCheckInEnd()
            );
        }

        // -----------------------------------------------------
        // FIND TODAY'S RECORD
        // -----------------------------------------------------

        Attendance attendance =
                attendanceRepository
                        .findByEmployeeIdAndDate(
                                user.getEmployeeId(),
                                today
                        )
                        .orElse(null);

        if (attendance != null &&
                attendance.getCheckInTime() != null &&
                !attendance.getCheckInTime().isBlank()) {

            throw new IllegalArgumentException(
                    "You have already checked in today."
            );
        }

        // -----------------------------------------------------
        // CREATE RECORD IF NECESSARY
        // -----------------------------------------------------

        if (attendance == null) {

            Employee employee =
                    employeeRepository
                            .findById(
                                    user.getEmployeeId()
                            )
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Employee record not found."
                                    )
                            );

            attendance =
                    new Attendance();

            attendance.setEmployeeId(
                    employee.getId()
            );

            attendance.setEmployeeName(
                    employee.getName()
            );

            attendance.setDate(today);
        }

        // -----------------------------------------------------
        // SERVER GENERATED TIME
        // -----------------------------------------------------

        attendance.setStatus("Present");

        attendance.setCheckInTime(
                currentTime.toString()
        );

        return attendanceRepository.save(
                attendance
        );
    }

    // =========================================================
    // EMPLOYEE CHECK-OUT
    // SERVER TIME
    // =========================================================

    public Attendance checkOut(
            String email,
            String role) {

        if (!role.equals("EMPLOYEE")) {

            throw new IllegalArgumentException(
                    "Only employees can use Check Out."
            );
        }

        if (attendanceSettingsService.isTodayHoliday()) {
            throw new RuntimeException(
                    "Today is a holiday. Attendance is not required."
            );
        }
        
        User user =
                getUserByEmail(email);

        if (user.getEmployeeId() == null) {

            throw new IllegalArgumentException(
                    "Your account is not linked to an employee."
            );
        }

        LocalDate today =
                LocalDate.now(INDIA_ZONE);

        LocalTime currentTime =
                LocalTime.now(INDIA_ZONE);

        AttendanceSettings settings =
                settingsService.getSettings();

        // -----------------------------------------------------
        // CHECK-OUT WINDOW
        // -----------------------------------------------------

        boolean checkOutOpen =
                !currentTime.isBefore(
                        settings.getCheckOutStart()
                )
                &&
                !currentTime.isAfter(
                        settings.getCheckOutEnd()
                );

        if (!checkOutOpen) {

            throw new IllegalArgumentException(
                    "Check-out is currently closed. " +
                    "Allowed time: " +
                    settings.getCheckOutStart() +
                    " to " +
                    settings.getCheckOutEnd()
            );
        }

        // -----------------------------------------------------
        // FIND TODAY'S ATTENDANCE
        // -----------------------------------------------------

        Attendance attendance =
                attendanceRepository
                        .findByEmployeeIdAndDate(
                                user.getEmployeeId(),
                                today
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "You have not checked in today."
                                )
                        );

        if (attendance.getCheckInTime() == null ||
                attendance.getCheckInTime().isBlank()) {

            throw new IllegalArgumentException(
                    "You must check in before checking out."
            );
        }

        if (attendance.getCheckOutTime() != null &&
                !attendance.getCheckOutTime().isBlank()) {

            throw new IllegalArgumentException(
                    "You have already checked out today."
            );
        }

        // -----------------------------------------------------
        // SERVER GENERATED CHECK-OUT TIME
        // -----------------------------------------------------

        attendance.setCheckOutTime(
                currentTime.toString()
        );

        return attendanceRepository.save(
                attendance
        );
    }

    // =========================================================
    // ADMIN / HR ADD ATTENDANCE
    // KEPT FOR ADMIN/HR CORRECTIONS
    // =========================================================

    public Attendance addAttendance(
            Attendance attendance,
            String role) {

        if (!role.equals("ADMIN") &&
                !role.equals("HR")) {

            throw new IllegalArgumentException(
                    "Only ADMIN or HR can mark attendance."
            );
        }

        if (attendance.getEmployeeId() == null) {

            throw new IllegalArgumentException(
                    "Employee is required."
            );
        }

        if (attendance.getDate() == null) {

            throw new IllegalArgumentException(
                    "Date is required."
            );
        }

        if (attendance.getStatus() == null ||
                attendance.getStatus().isBlank()) {

            throw new IllegalArgumentException(
                    "Attendance status is required."
            );
        }

        Employee employee =
                employeeRepository
                        .findById(
                                attendance.getEmployeeId()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Selected employee does not exist."
                                )
                        );

        boolean alreadyExists =
                attendanceRepository.findByEmployeeIdAndDate(
                        attendance.getEmployeeId(),
                        attendance.getDate()
                ).isPresent();

        if (alreadyExists) {

            throw new IllegalArgumentException(
                    "Attendance is already marked for this employee on this date."
            );
        }

        attendance.setEmployeeName(
                employee.getName()
        );

        attendance.setStatus(
                attendance.getStatus().trim()
        );

        return attendanceRepository.save(
                attendance
        );
    }

    // =========================================================
    // ADMIN / HR UPDATE
    // =========================================================

    public Attendance updateAttendance(
            Long id,
            Attendance attendanceDetails,
            String role) {

        if (!role.equals("ADMIN") &&
                !role.equals("HR")) {

            throw new IllegalArgumentException(
                    "Only ADMIN or HR can update attendance."
            );
        }

        Attendance attendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance record not found."
                                )
                        );

        if (attendanceDetails.getEmployeeId() == null) {

            throw new IllegalArgumentException(
                    "Employee is required."
            );
        }

        if (attendanceDetails.getDate() == null) {

            throw new IllegalArgumentException(
                    "Date is required."
            );
        }

        if (attendanceDetails.getStatus() == null ||
                attendanceDetails.getStatus().isBlank()) {

            throw new IllegalArgumentException(
                    "Attendance status is required."
            );
        }

        Employee employee =
                employeeRepository
                        .findById(
                                attendanceDetails.getEmployeeId()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Selected employee does not exist."
                                )
                        );

        boolean duplicate =
                attendanceRepository
                        .findByEmployeeIdAndDate(
                                attendanceDetails.getEmployeeId(),
                                attendanceDetails.getDate()
                        )
                        .map(existing ->
                                !existing.getId()
                                        .equals(id))
                        .orElse(false);

        if (duplicate) {

            throw new IllegalArgumentException(
                    "Attendance is already marked for this employee on this date."
            );
        }

        attendance.setEmployeeId(
                employee.getId()
        );

        attendance.setEmployeeName(
                employee.getName()
        );

        attendance.setDate(
                attendanceDetails.getDate()
        );

        attendance.setStatus(
                attendanceDetails.getStatus().trim()
        );

        attendance.setCheckInTime(
                attendanceDetails.getCheckInTime()
        );

        attendance.setCheckOutTime(
                attendanceDetails.getCheckOutTime()
        );

        return attendanceRepository.save(
                attendance
        );
    }

    // =========================================================
    // DELETE
    // ADMIN / HR ONLY
    // =========================================================

    public void deleteAttendance(
            Long id,
            String role) {

        if (!role.equals("ADMIN") &&
                !role.equals("HR")) {

            throw new IllegalArgumentException(
                    "Only ADMIN or HR can delete attendance."
            );
        }

        if (!attendanceRepository.existsById(id)) {

            throw new RuntimeException(
                    "Attendance record not found."
            );
        }

        attendanceRepository.deleteById(id);
    }

    // =========================================================
    // USER HELPER
    // =========================================================

    private User getUserByEmail(
            String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User account not found."
                        )
                );
    }
}