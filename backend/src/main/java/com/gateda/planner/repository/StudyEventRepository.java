package com.gateda.planner.repository;

import com.gateda.planner.entity.StudyEvent;
import com.gateda.planner.entity.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface StudyEventRepository extends JpaRepository<StudyEvent, UUID> {
    List<StudyEvent> findByUserIdAndEventDateBetweenOrderByEventDateAscStartTimeAsc(UUID userId, LocalDate start, LocalDate end);
    List<StudyEvent> findByUserIdAndEventDate(UUID userId, LocalDate date);
    List<StudyEvent> findByUserIdAndStatus(UUID userId, EventStatus status);
    List<StudyEvent> findByUserId(UUID userId);
}
