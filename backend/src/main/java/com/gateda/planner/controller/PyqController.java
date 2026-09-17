package com.gateda.planner.controller;

import com.gateda.planner.entity.PYQRecord;
import com.gateda.planner.security.CustomUserDetails;
import com.gateda.planner.service.PyqService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pyqs")
public class PyqController {

    private final PyqService pyqService;

    public PyqController(PyqService pyqService) {
        this.pyqService = pyqService;
    }

    @GetMapping
    public ResponseEntity<List<PYQRecord>> getPyqRecords(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(pyqService.getPyqRecords(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<PYQRecord> recordPyq(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam UUID topicId,
            @RequestParam int attempted,
            @RequestParam int correct,
            @RequestParam int incorrect) {
        return ResponseEntity.ok(pyqService.recordPyqSession(userDetails.getId(), topicId, attempted, correct, incorrect));
    }
}
