package com.gateda.planner.controller;

import com.gateda.planner.entity.StudyProgress;
import com.gateda.planner.entity.enums.MasteryLevel;
import com.gateda.planner.security.CustomUserDetails;
import com.gateda.planner.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping
    public ResponseEntity<List<StudyProgress>> getProgress(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(progressService.getUserProgress(userDetails.getId()));
    }

    @PutMapping("/topic/{topicId}")
    public ResponseEntity<StudyProgress> updateProgress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID topicId,
            @RequestParam MasteryLevel level,
            @RequestParam(defaultValue = "0.0") double completionPercentage,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(progressService.updateTopicProgress(userDetails.getId(), topicId, level, completionPercentage, notes));
    }
}
