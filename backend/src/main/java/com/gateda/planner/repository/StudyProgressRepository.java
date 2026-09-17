package com.gateda.planner.repository;

import com.gateda.planner.entity.StudyProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudyProgressRepository extends JpaRepository<StudyProgress, UUID> {
    List<StudyProgress> findByUserId(UUID userId);
    Optional<StudyProgress> findByUserIdAndTopicId(UUID userId, UUID topicId);
}
