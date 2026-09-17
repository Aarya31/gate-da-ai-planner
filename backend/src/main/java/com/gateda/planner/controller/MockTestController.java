package com.gateda.planner.controller;

import com.gateda.planner.entity.MockTest;
import com.gateda.planner.security.CustomUserDetails;
import com.gateda.planner.service.MockTestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mocks")
public class MockTestController {

    private final MockTestService mockTestService;

    public MockTestController(MockTestService mockTestService) {
        this.mockTestService = mockTestService;
    }

    @GetMapping
    public ResponseEntity<List<MockTest>> getMockTests(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(mockTestService.getMockTests(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<MockTest> createMockTest(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody MockTest mockTest) {
        return ResponseEntity.ok(mockTestService.createMockTest(userDetails.getId(), mockTest));
    }
}
