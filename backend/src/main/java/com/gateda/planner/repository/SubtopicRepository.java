package com.gateda.planner.repository;

import com.gateda.planner.entity.Subtopic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SubtopicRepository extends JpaRepository<Subtopic, UUID> {
    List<Subtopic> findByTopicId(UUID topicId);
}
