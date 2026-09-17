package com.gateda.planner.service;

import com.gateda.planner.entity.Notification;
import com.gateda.planner.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getUserNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByTriggerAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(UUID userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByTriggerAtDesc(userId);
    }

    @Transactional
    public Notification markAsRead(UUID userId, UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized notification access");
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public Notification createNotification(UUID userId, String title, String message, String type) {
        Notification notification = new Notification(userId, title, message, type);
        return notificationRepository.save(notification);
    }
}
