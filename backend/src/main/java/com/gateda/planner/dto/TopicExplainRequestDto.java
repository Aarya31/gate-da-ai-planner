package com.gateda.planner.dto;

import java.util.UUID;

public class TopicExplainRequestDto {
    private UUID topicId;
    private String question;
    private String mode; // "SIMPLE_EXPLANATION", "PRACTICE_QUESTIONS", "SHORTCUTS", "REVISION"

    public TopicExplainRequestDto() {}

    public UUID getTopicId() { return topicId; }
    public void setTopicId(UUID topicId) { this.topicId = topicId; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
}
