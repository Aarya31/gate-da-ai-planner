package com.gateda.planner.service;

import com.gateda.planner.entity.Subject;
import com.gateda.planner.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SyllabusService {

    private final SubjectRepository subjectRepository;

    public SyllabusService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Transactional(readOnly = true)
    public List<Subject> getAllSyllabus() {
        return subjectRepository.findAllByOrderByDisplayOrderAsc();
    }
}
