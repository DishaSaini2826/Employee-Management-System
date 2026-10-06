package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "attendance_settings")
public class AttendanceSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalTime checkInStart;

    @Column(nullable = false)
    private LocalTime checkInEnd;

    @Column(nullable = false)
    private LocalTime checkOutStart;

    @Column(nullable = false)
    private LocalTime checkOutEnd;

    // Holiday control
    @Column(nullable = false)
    private boolean holiday = false;

    private LocalDate holidayDate;

    public AttendanceSettings() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalTime getCheckInStart() {
        return checkInStart;
    }

    public void setCheckInStart(LocalTime checkInStart) {
        this.checkInStart = checkInStart;
    }

    public LocalTime getCheckInEnd() {
        return checkInEnd;
    }

    public void setCheckInEnd(LocalTime checkInEnd) {
        this.checkInEnd = checkInEnd;
    }

    public LocalTime getCheckOutStart() {
        return checkOutStart;
    }

    public void setCheckOutStart(LocalTime checkOutStart) {
        this.checkOutStart = checkOutStart;
    }

    public LocalTime getCheckOutEnd() {
        return checkOutEnd;
    }

    public void setCheckOutEnd(LocalTime checkOutEnd) {
        this.checkOutEnd = checkOutEnd;
    }

    public boolean isHoliday() {
        return holiday;
    }

    public void setHoliday(boolean holiday) {
        this.holiday = holiday;
    }

    public LocalDate getHolidayDate() {
        return holidayDate;
    }

    public void setHolidayDate(LocalDate holidayDate) {
        this.holidayDate = holidayDate;
    }
}