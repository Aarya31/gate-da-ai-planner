package com.gateda.planner.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pyq_records")
public class PYQRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(nullable = false)
    private int attempted;

    @Column(nullable = false)
    private int correct;

    @Column(nullable = false)
    private int incorrect;

    private LocalDateTime recordedAt = LocalDateTime.now();

    public PYQRecord() {}

    public PYQRecord(UUID userId, Topic topic, int attempted, int correct, int incorrect) {
        this.userId = userId;
        this.topic = topic;
        this.attempted = attempted;
        this.correct = correct;
        this.incorrect = incorrect;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }

    public int getAttempted() { return attempted; }
    public void setAttempted(int attempted) { this.attempted = attempted; }

    public int getCorrect() { return correct; }
    public void setCorrect(int correct) { this.correct = correct; }

    public int getIncorrect() { return incorrect; }
    public void setIncorrect(int incorrect) { this.incorrect = incorrect; }

    public double getAccuracyPercentage() {
        if (attempted == 0) return 0.0;
        return ((double) correct / attempted) * 100.0;
    }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
