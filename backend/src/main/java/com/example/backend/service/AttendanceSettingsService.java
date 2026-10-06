package com.example.backend.service;

import com.example.backend.entity.AttendanceSettings;
import com.example.backend.repository.AttendanceSettingsRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

@Service
public class AttendanceSettingsService {

    private final AttendanceSettingsRepository repository;

    private final ZoneId INDIA_ZONE =
            ZoneId.of("Asia/Kolkata");

    public AttendanceSettingsService(
            AttendanceSettingsRepository repository) {

        this.repository = repository;
    }

    // =========================================================
    // GET SETTINGS
    // =========================================================

    public AttendanceSettings getSettings() {

        return repository
                .findFirstByOrderByIdAsc()
                .orElseThrow(() ->
                        new RuntimeException(
                                "Attendance timings are not configured yet."
                        )
                );
    }

    // =========================================================
    // SAVE / UPDATE ATTENDANCE TIMINGS
    // ADMIN / HR ONLY
    // =========================================================

    public AttendanceSettings saveSettings(
            AttendanceSettings newSettings,
            String role) {

        if (!role.equals("ADMIN") &&
                !role.equals("HR")) {

            throw new RuntimeException(
                    "Only Admin or HR can update attendance settings."
            );
        }

        // Validate timings
        if (newSettings.getCheckInStart() == null ||
                newSettings.getCheckInEnd() == null ||
                newSettings.getCheckOutStart() == null ||
                newSettings.getCheckOutEnd() == null) {

            throw new RuntimeException(
                    "All attendance timings are required."
            );
        }

        if (!newSettings.getCheckInStart()
                .isBefore(newSettings.getCheckInEnd())) {

            throw new RuntimeException(
                    "Check-in start time must be before check-in end time."
            );
        }

        if (!newSettings.getCheckOutStart()
                .isBefore(newSettings.getCheckOutEnd())) {

            throw new RuntimeException(
                    "Check-out start time must be before check-out end time."
            );
        }

        AttendanceSettings settings =
                repository.findFirstByOrderByIdAsc()
                        .orElse(new AttendanceSettings());

        // Only update attendance timings
        settings.setCheckInStart(
                newSettings.getCheckInStart()
        );

        settings.setCheckInEnd(
                newSettings.getCheckInEnd()
        );

        settings.setCheckOutStart(
                newSettings.getCheckOutStart()
        );

        settings.setCheckOutEnd(
                newSettings.getCheckOutEnd()
        );

        /*
         * IMPORTANT:
         *
         * Do NOT modify holiday or holidayDate here.
         *
         * Holiday is controlled only by:
         *
         * markTodayAsHoliday()
         * cancelTodayHoliday()
         *
         * Therefore, changing attendance timings
         * will not accidentally cancel today's holiday.
         */

        return repository.save(settings);
    }

    // =========================================================
    // MARK TODAY AS HOLIDAY
    // ADMIN / HR ONLY
    // =========================================================

    public AttendanceSettings markTodayAsHoliday(
            String role) {

        if (!role.equals("ADMIN") &&
                !role.equals("HR")) {

            throw new RuntimeException(
                    "Only Admin or HR can mark a holiday."
            );
        }

        AttendanceSettings settings =
                getSettings();

        LocalDate today =
                LocalDate.now(INDIA_ZONE);

        settings.setHoliday(true);
        settings.setHolidayDate(today);

        return repository.save(settings);
    }

    // =========================================================
    // CANCEL TODAY'S HOLIDAY
    // ADMIN / HR ONLY
    // =========================================================

    public AttendanceSettings cancelTodayHoliday(
            String role) {

        if (!role.equals("ADMIN") &&
                !role.equals("HR")) {

            throw new RuntimeException(
                    "Only Admin or HR can cancel a holiday."
            );
        }

        AttendanceSettings settings =
                getSettings();

        LocalDate today =
                LocalDate.now(INDIA_ZONE);

        if (today.equals(settings.getHolidayDate())) {

            settings.setHoliday(false);
            settings.setHolidayDate(null);
        }

        return repository.save(settings);
    }

    // =========================================================
    // CHECK WHETHER TODAY IS A HOLIDAY
    // =========================================================

    public boolean isTodayHoliday() {

        AttendanceSettings settings;

        try {

            settings = getSettings();

        } catch (Exception e) {

            return false;
        }

        LocalDate today =
                LocalDate.now(INDIA_ZONE);

        return settings.isHoliday()
                && today.equals(
                        settings.getHolidayDate()
                );
    }

    // =========================================================
    // CURRENT ATTENDANCE WINDOW STATUS
    // =========================================================

    public Map<String, Object> getCurrentStatus() {

        Map<String, Object> result =
                new HashMap<>();

        LocalDate today =
                LocalDate.now(INDIA_ZONE);

        LocalTime currentTime =
                LocalTime.now(INDIA_ZONE);

        result.put(
                "date",
                today.toString()
        );

        result.put(
                "currentTime",
                currentTime.toString()
        );

        AttendanceSettings settings;

        try {

            settings = getSettings();

        } catch (Exception e) {

            result.put(
                    "configured",
                    false
            );

            result.put(
                    "checkInOpen",
                    false
            );

            result.put(
                    "checkOutOpen",
                    false
            );

            result.put(
                    "holiday",
                    false
            );

            result.put(
                    "message",
                    "Attendance timings are not configured yet."
            );

            return result;
        }

        // =====================================================
        // CHECK HOLIDAY
        // =====================================================

        boolean todayHoliday =
                settings.isHoliday()
                        && today.equals(
                                settings.getHolidayDate()
                        );

        // =====================================================
        // CHECK-IN WINDOW
        // =====================================================

        boolean checkInOpen =
                !todayHoliday
                        && !currentTime.isBefore(
                                settings.getCheckInStart()
                        )
                        && !currentTime.isAfter(
                                settings.getCheckInEnd()
                        );

        // =====================================================
        // CHECK-OUT WINDOW
        // =====================================================

        boolean checkOutOpen =
                !todayHoliday
                        && !currentTime.isBefore(
                                settings.getCheckOutStart()
                        )
                        && !currentTime.isAfter(
                                settings.getCheckOutEnd()
                        );

        // =====================================================
        // RESPONSE
        // =====================================================

        result.put(
                "configured",
                true
        );

        result.put(
                "checkInStart",
                settings.getCheckInStart().toString()
        );

        result.put(
                "checkInEnd",
                settings.getCheckInEnd().toString()
        );

        result.put(
                "checkOutStart",
                settings.getCheckOutStart().toString()
        );

        result.put(
                "checkOutEnd",
                settings.getCheckOutEnd().toString()
        );

        result.put(
                "holiday",
                todayHoliday
        );

        result.put(
                "holidayDate",
                settings.getHolidayDate() == null
                        ? null
                        : settings.getHolidayDate().toString()
        );

        result.put(
                "checkInOpen",
                checkInOpen
        );

        result.put(
                "checkOutOpen",
                checkOutOpen
        );

        if (todayHoliday) {

            result.put(
                    "message",
                    "Today is a holiday. Attendance is not required."
            );
        }

        return result;
    }
}