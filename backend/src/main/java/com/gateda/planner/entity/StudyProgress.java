package com.gateda.planner.entity;

import com.gateda.planner.entity.enums.MasteryLevel;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "study_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "topic_id"})
})
public class StudyProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MasteryLevel masteryLevel = MasteryLevel.NOT_STARTED;

    @Column(nullable = false)
    private double completionPercentage = 0.0;

    private LocalDateTime lastRevisedAt;

    @Column(length = 1000)
    private String notes;

    public StudyProgress() {}

    public StudyProgress(UUID userId, Topic topic, MasteryLevel masteryLevel, double completionPercentage) {
        this.userId = userId;
        this.topic = topic;
        this.masteryLevel = masteryLevel;
        this.completionPercentage = completionPercentage;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }

    public MasteryLevel getMasteryLevel() { return masteryLevel; }
    public void setMasteryLevel(MasteryLevel masteryLevel) { this.masteryLevel = masteryLevel; }

    public double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(double completionPercentage) { this.completionPercentage = completionPercentage; }

    public LocalDateTime getLastRevisedAt() { return lastRevisedAt; }
    public void setLastRevisedAt(LocalDateTime lastRevisedAt) { this.lastRevisedAt = lastRevisedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
