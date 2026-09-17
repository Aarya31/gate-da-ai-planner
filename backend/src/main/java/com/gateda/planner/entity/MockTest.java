package com.gateda.planner.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "mock_tests")
public class MockTest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDate testDate;

    @Column(nullable = false)
    private double score;

    @Column(nullable = false)
    private double maxScore;

    private int attemptedQuestions;
    private int correctQuestions;
    private int incorrectQuestions;
    private int timeTakenMinutes;

    @Column(length = 2000)
    private String notes;

    @OneToMany(mappedBy = "mockTest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MockTestTopicAnalysis> topicAnalyses = new ArrayList<>();

    public MockTest() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getTestDate() { return testDate; }
    public void setTestDate(LocalDate testDate) { this.testDate = testDate; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public double getMaxScore() { return maxScore; }
    public void setMaxScore(double maxScore) { this.maxScore = maxScore; }

    public int getAttemptedQuestions() { return attemptedQuestions; }
    public void setAttemptedQuestions(int attemptedQuestions) { this.attemptedQuestions = attemptedQuestions; }

    public int getCorrectQuestions() { return correctQuestions; }
    public void setCorrectQuestions(int correctQuestions) { this.correctQuestions = correctQuestions; }

    public int getIncorrectQuestions() { return incorrectQuestions; }
    public void setIncorrectQuestions(int incorrectQuestions) { this.incorrectQuestions = incorrectQuestions; }

    public int getTimeTakenMinutes() { return timeTakenMinutes; }
    public void setTimeTakenMinutes(int timeTakenMinutes) { this.timeTakenMinutes = timeTakenMinutes; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<MockTestTopicAnalysis> getTopicAnalyses() { return topicAnalyses; }
    public void setTopicAnalyses(List<MockTestTopicAnalysis> topicAnalyses) { this.topicAnalyses = topicAnalyses; }

    public double getAccuracyPercentage() {
        if (attemptedQuestions == 0) return 0.0;
        return ((double) correctQuestions / attemptedQuestions) * 100.0;
    }
}
