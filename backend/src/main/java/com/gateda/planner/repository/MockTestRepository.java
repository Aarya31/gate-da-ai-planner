package com.gateda.planner.repository;

import com.gateda.planner.entity.MockTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MockTestRepository extends JpaRepository<MockTest, UUID> {
    List<MockTest> findByUserIdOrderByTestDateDesc(UUID userId);
}
