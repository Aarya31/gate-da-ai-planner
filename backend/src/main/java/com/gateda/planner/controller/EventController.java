package com.gateda.planner.controller;

import com.gateda.planner.dto.StudyEventDto;
import com.gateda.planner.entity.enums.EventStatus;
import com.gateda.planner.security.CustomUserDetails;
import com.gateda.planner.service.EventService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<StudyEventDto>> getEvents(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(eventService.getEvents(userDetails.getId(), start, end));
    }

    @GetMapping("/today")
    public ResponseEntity<List<StudyEventDto>> getTodaysEvents(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(eventService.getTodaysEvents(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<StudyEventDto> createEvent(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody StudyEventDto dto) {
        return ResponseEntity.ok(eventService.createEvent(userDetails.getId(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyEventDto> updateEvent(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID id,
            @RequestBody StudyEventDto dto) {
        return ResponseEntity.ok(eventService.updateEvent(userDetails.getId(), id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<StudyEventDto> updateStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID id,
            @RequestParam EventStatus status) {
        return ResponseEntity.ok(eventService.updateStatus(userDetails.getId(), id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID id) {
        eventService.deleteEvent(userDetails.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
