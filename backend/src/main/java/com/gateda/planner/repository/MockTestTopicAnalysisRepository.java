package com.gateda.planner.repository;

import com.gateda.planner.entity.MockTestTopicAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MockTestTopicAnalysisRepository extends JpaRepository<MockTestTopicAnalysis, UUID> {
    List<MockTestTopicAnalysis> findByMockTestId(UUID mockTestId);
}
