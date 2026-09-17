package com.gateda.planner.service;

import com.gateda.planner.dto.AuthRequest;
import com.gateda.planner.dto.AuthResponse;
import com.gateda.planner.dto.UserAvailabilityDto;
import com.gateda.planner.entity.User;
import com.gateda.planner.entity.UserAvailability;
import com.gateda.planner.repository.UserAvailabilityRepository;
import com.gateda.planner.repository.UserRepository;
import com.gateda.planner.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserAvailabilityRepository availabilityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, UserAvailabilityRepository availabilityRepository,
                       PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.availabilityRepository = availabilityRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(AuthRequest request) {
        throw new IllegalArgumentException("Wrong credentials");
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Wrong credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Wrong credentials");
        }

        String token = tokenProvider.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName());
    }

    public List<UserAvailabilityDto> getUserAvailability(UUID userId) {
        return availabilityRepository.findByUserIdOrderByDayOfWeekAsc(userId).stream()
                .map(a -> new UserAvailabilityDto(a.getDayOfWeek(), a.getMaxHours(), a.getPreferredStartTime(), a.getPreferredEndTime()))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<UserAvailabilityDto> updateAvailability(UUID userId, List<UserAvailabilityDto> dtos) {
        availabilityRepository.deleteByUserId(userId);
        List<UserAvailability> availabilities = new ArrayList<>();
        for (UserAvailabilityDto dto : dtos) {
            availabilities.add(new UserAvailability(
                    userId,
                    dto.getDayOfWeek(),
                    dto.getMaxHours(),
                    dto.getPreferredStartTime(),
                    dto.getPreferredEndTime()
            ));
        }
        availabilityRepository.saveAll(availabilities);
        return dtos;
    }

    private void seedDefaultAvailability(UUID userId) {
        List<UserAvailability> defaultAvailabilities = new ArrayList<>();
        // Weekdays: Mon-Fri (1 to 5) -> 3.0 hours
        for (int day = 1; day <= 5; day++) {
            defaultAvailabilities.add(new UserAvailability(
                    userId, day, 3.0, LocalTime.of(19, 30), LocalTime.of(22, 30)
            ));
        }
        // Weekends: Sat-Sun (6 & 7) -> 6.0 hours
        defaultAvailabilities.add(new UserAvailability(userId, 6, 6.0, LocalTime.of(10, 0), LocalTime.of(16, 0)));
        defaultAvailabilities.add(new UserAvailability(userId, 7, 6.0, LocalTime.of(10, 0), LocalTime.of(16, 0)));

        availabilityRepository.saveAll(defaultAvailabilities);
    }
}
