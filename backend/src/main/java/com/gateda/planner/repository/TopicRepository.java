package com.gateda.planner.repository;

import com.gateda.planner.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TopicRepository extends JpaRepository<Topic, UUID> {
    List<Topic> findBySubjectIdOrderByDisplayOrderAsc(UUID subjectId);
    Optional<Topic> findByName(String name);
}
