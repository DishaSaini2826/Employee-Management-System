package com.example.backend.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================
    // CORS CONFIGURATION
    // =========================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "https://employee-management-system-olive-one.vercel.app"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept"
                )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // =========================
            // CORS
            // =========================
            .cors(cors ->
                    cors.configurationSource(corsConfigurationSource())
            )

            // =========================
            // CSRF
            // =========================
            .csrf(csrf -> csrf.disable())

            // =========================
            // SESSION
            // =========================
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            // =========================
            // UNAUTHORIZED RESPONSE
            // =========================
            .exceptionHandling(exception ->
                    exception.authenticationEntryPoint(
                            (request, response, authException) -> {
                                response.setStatus(401);
                                response.getWriter()
                                        .write("Unauthorized");
                            }
                    )
            )

            // =========================
            // AUTHORIZATION
            // =========================
            .authorizeHttpRequests(auth -> auth

                // Login / register
                .requestMatchers("/api/auth/**")
                    .permitAll()

                // CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()

                // =========================
                // EMPLOYEES
                // =========================
                .requestMatchers(
                        HttpMethod.GET,
                        "/api/employees/**"
                )
                    .hasAnyRole("ADMIN", "HR", "EMPLOYEE")

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/employees/**"
                )
                    .hasAnyRole("ADMIN", "HR")

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/employees/**"
                )
                    .hasAnyRole("ADMIN", "HR")

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/employees/**"
                )
                    .hasAnyRole("ADMIN", "HR")

                // =========================
                // DEPARTMENTS
                // =========================
                .requestMatchers(
                        HttpMethod.GET,
                        "/api/departments/**"
                )
                    .hasAnyRole("ADMIN", "HR", "EMPLOYEE")

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/departments/**"
                )
                    .hasAnyRole("ADMIN", "HR")

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/departments/**"
                )
                    .hasAnyRole("ADMIN", "HR")

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/departments/**"
                )
                    .hasAnyRole("ADMIN", "HR")

                // =========================
                // LEAVES
                // =========================
                .requestMatchers("/api/leaves/**")
                    .hasAnyRole("ADMIN", "HR", "EMPLOYEE")

                // =========================
                // ATTENDANCE
                // =========================
                .requestMatchers(
                        HttpMethod.GET,
                        "/api/attendance/**"
                )
                    .hasAnyRole("ADMIN", "HR", "EMPLOYEE")

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/attendance/check-in"
                )
                    .hasRole("EMPLOYEE")

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/attendance/check-out"
                )
                    .hasRole("EMPLOYEE")

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/attendance/**"
                )
                    .hasAnyRole("ADMIN", "HR")

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/attendance/**"
                )
                    .hasAnyRole("ADMIN", "HR")

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/attendance/**"
                )
                    .hasAnyRole("ADMIN", "HR")

                // =========================
                // ATTENDANCE SETTINGS
                // =========================
                .requestMatchers(
                        HttpMethod.POST,
                        "/api/attendance-settings/holiday"
                )
                    .hasAnyRole("ADMIN", "HR")

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/attendance-settings/holiday"
                )
                    .hasAnyRole("ADMIN", "HR")

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/attendance-settings/**"
                )
                    .hasAnyRole("ADMIN", "HR", "EMPLOYEE")

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/attendance-settings/**"
                )
                    .hasAnyRole("ADMIN", "HR")

                // =========================
                // USERS
                // =========================
                .requestMatchers("/api/users/**")
                    .hasAnyRole("ADMIN", "HR")

                // =========================
                // EVERYTHING ELSE
                // =========================
                .anyRequest()
                    .authenticated()
            )

            // =========================
            // JWT FILTER
            // =========================
            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}