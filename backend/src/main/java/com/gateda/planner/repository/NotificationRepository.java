package com.gateda.planner.repository;

import com.gateda.planner.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUserIdOrderByTriggerAtDesc(UUID userId);
    List<Notification> findByUserIdAndIsReadFalseOrderByTriggerAtDesc(UUID userId);
}
