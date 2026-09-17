package com.gateda.planner.controller;

import com.gateda.planner.dto.*;
import com.gateda.planner.security.CustomUserDetails;
import com.gateda.planner.service.AiPlannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final AiPlannerService aiPlannerService;

    public AiController(AiPlannerService aiPlannerService) {
        this.aiPlannerService = aiPlannerService;
    }

    @PostMapping("/generate-schedule")
    public ResponseEntity<AiPlanResponseDto> generateSchedule(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody AiPlanRequestDto request) {
        return ResponseEntity.ok(aiPlannerService.generateScheduleProposal(userDetails.getId(), request));
    }

    @PostMapping("/modify-schedule")
    public ResponseEntity<AiPlanResponseDto> modifySchedule(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody AiPlanRequestDto request) {
        return ResponseEntity.ok(aiPlannerService.modifyScheduleProposal(userDetails.getId(), request));
    }

    @PostMapping("/apply-proposal")
    public ResponseEntity<List<StudyEventDto>> applyProposal(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody List<StudyEventDto> proposedEvents) {
        return ResponseEntity.ok(aiPlannerService.applyProposal(userDetails.getId(), proposedEvents));
    }

    @PostMapping("/explain-topic")
    public ResponseEntity<TopicExplainResponseDto> explainTopic(@RequestBody TopicExplainRequestDto request) {
        return ResponseEntity.ok(aiPlannerService.explainTopic(request));
    }
}
