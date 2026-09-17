package com.gateda.planner.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "mock_test_topic_analyses")
public class MockTestTopicAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mock_test_id", nullable = false)
    @JsonIgnore
    private MockTest mockTest;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    private String performanceRating; // "STRONG", "NEEDS_PRACTICE", "WEAK"

    public MockTestTopicAnalysis() {}

    public MockTestTopicAnalysis(MockTest mockTest, Topic topic, String performanceRating) {
        this.mockTest = mockTest;
        this.topic = topic;
        this.performanceRating = performanceRating;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public MockTest getMockTest() { return mockTest; }
    public void setMockTest(MockTest mockTest) { this.mockTest = mockTest; }

    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }

    public String getPerformanceRating() { return performanceRating; }
    public void setPerformanceRating(String performanceRating) { this.performanceRating = performanceRating; }
}
