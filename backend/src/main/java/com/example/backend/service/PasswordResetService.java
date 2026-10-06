package com.example.backend.service;

import com.example.backend.entity.PasswordResetOtp;
import com.example.backend.entity.User;
import com.example.backend.repository.PasswordResetOtpRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetOtpRepository otpRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender) {

        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    // =====================================================
    // SEND OTP
    // =====================================================

    @Transactional
    public void sendOtp(String email) {

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException(
                    "Email address is required."
            );
        }

        String cleanEmail =
                email.trim().toLowerCase();

        // Check whether user exists
        User user = userRepository
                .findByEmail(cleanEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No account found with this email."
                        )
                );

        // Generate 6-digit OTP
        String otp = generateOtp();

        // Remove previous OTP
        otpRepository.deleteByEmail(cleanEmail);

        // Create new OTP record
        PasswordResetOtp resetOtp =
                new PasswordResetOtp();

        resetOtp.setEmail(cleanEmail);
        resetOtp.setOtp(otp);

        // OTP valid for 10 minutes
        resetOtp.setExpiryTime(
                LocalDateTime.now().plusMinutes(10)
        );

        otpRepository.save(resetOtp);

        // Send OTP through Gmail
        sendOtpEmail(
                cleanEmail,
                user.getName(),
                otp
        );
    }

    // =====================================================
    // RESET PASSWORD
    // =====================================================

    @Transactional
    public void resetPassword(
            String email,
            String otp,
            String newPassword) {

        if (email == null ||
                email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Email address is required."
            );
        }

        if (otp == null ||
                otp.trim().isEmpty()) {

            throw new RuntimeException(
                    "OTP is required."
            );
        }

        if (newPassword == null ||
                newPassword.trim().isEmpty()) {

            throw new RuntimeException(
                    "New password is required."
            );
        }

        String cleanEmail =
                email.trim().toLowerCase();

        String cleanOtp =
                otp.trim();

        String cleanPassword =
                newPassword.trim();

        // Password validation
        if (cleanPassword.length() < 6) {

            throw new RuntimeException(
                    "Password must contain at least 6 characters."
            );
        }

        // Find latest OTP
        PasswordResetOtp resetOtp =
                otpRepository
                        .findTopByEmailOrderByIdDesc(
                                cleanEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid or expired OTP."
                                )
                        );

        // Check OTP expiry
        if (LocalDateTime.now()
                .isAfter(resetOtp.getExpiryTime())) {

            otpRepository.deleteByEmail(
                    cleanEmail
            );

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }

        // Check OTP
        if (!resetOtp.getOtp()
                .equals(cleanOtp)) {

            throw new RuntimeException(
                    "Invalid OTP."
            );
        }

        // Find user
        User user = userRepository
                .findByEmail(cleanEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found."
                        )
                );

        // Encrypt new password
        String encodedPassword =
                passwordEncoder.encode(
                        cleanPassword
                );

        user.setPassword(
                encodedPassword
        );

        userRepository.save(user);

        // OTP can no longer be reused
        otpRepository.deleteByEmail(
                cleanEmail
        );
    }

    // =====================================================
    // GENERATE OTP
    // =====================================================

    private String generateOtp() {

        Random random = new Random();

        int number =
                100000 +
                random.nextInt(900000);

        return String.valueOf(number);
    }

    // =====================================================
    // SEND EMAIL
    // =====================================================

    private void sendOtpEmail(
            String email,
            String name,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "EMS - Password Reset OTP"
        );

        message.setText(
                "Hello " + name + ",\n\n"

                + "We received a request to reset "
                + "your Employee Management System "
                + "password.\n\n"

                + "Your OTP is:\n\n"

                + otp

                + "\n\n"
                + "This OTP is valid for 10 minutes."

                + "\n\n"
                + "Please do not share this OTP "
                + "with anyone."

                + "\n\n"
                + "If you did not request a password "
                + "reset, please ignore this email."

                + "\n\n"
                + "Regards,\n"
                + "Employee Management System"
        );

        mailSender.send(message);
    }
}