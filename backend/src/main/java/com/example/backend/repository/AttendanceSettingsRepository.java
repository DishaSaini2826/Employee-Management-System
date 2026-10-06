package com.example.backend.repository;

import com.example.backend.entity.AttendanceSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AttendanceSettingsRepository
        extends JpaRepository<AttendanceSettings, Long> {

    Optional<AttendanceSettings> findFirstByOrderByIdAsc();
}