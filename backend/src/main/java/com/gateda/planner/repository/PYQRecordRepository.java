package com.gateda.planner.repository;

import com.gateda.planner.entity.PYQRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PYQRecordRepository extends JpaRepository<PYQRecord, UUID> {
    List<PYQRecord> findByUserId(UUID userId);
    List<PYQRecord> findByUserIdAndTopicId(UUID userId, UUID topicId);
}
