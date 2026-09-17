package com.gateda.planner.repository;

import com.gateda.planner.entity.UserAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface UserAvailabilityRepository extends JpaRepository<UserAvailability, UUID> {
    List<UserAvailability> findByUserIdOrderByDayOfWeekAsc(UUID userId);
    void deleteByUserId(UUID userId);
}
