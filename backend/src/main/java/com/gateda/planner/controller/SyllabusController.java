package com.gateda.planner.controller;

import com.gateda.planner.entity.Subject;
import com.gateda.planner.service.SyllabusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/syllabus")
public class SyllabusController {

    private final SyllabusService syllabusService;

    public SyllabusController(SyllabusService syllabusService) {
        this.syllabusService = syllabusService;
    }

    @GetMapping
    public ResponseEntity<List<Subject>> getSyllabus() {
        return ResponseEntity.ok(syllabusService.getAllSyllabus());
    }
}
