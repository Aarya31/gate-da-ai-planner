package com.gateda.planner.controller;

import com.gateda.planner.dto.UserAvailabilityDto;
import com.gateda.planner.security.CustomUserDetails;
import com.gateda.planner.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<CustomUserDetails> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(userDetails);
    }

    @GetMapping("/availability")
    public ResponseEntity<List<UserAvailabilityDto>> getAvailability(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(authService.getUserAvailability(userDetails.getId()));
    }

    @PutMapping("/availability")
    public ResponseEntity<List<UserAvailabilityDto>> updateAvailability(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody List<UserAvailabilityDto> availabilities) {
        return ResponseEntity.ok(authService.updateAvailability(userDetails.getId(), availabilities));
    }
}
