package com.gateda.planner.dto;

import java.util.List;

public class TopicExplainResponseDto {
    private String topicName;
    private String explanationMarkdown;
    private List<String> keyTakeaways;
    private List<String> sampleQuestions;

    public TopicExplainResponseDto() {}

    public TopicExplainResponseDto(String topicName, String explanationMarkdown, List<String> keyTakeaways, List<String> sampleQuestions) {
        this.topicName = topicName;
        this.explanationMarkdown = explanationMarkdown;
        this.keyTakeaways = keyTakeaways;
        this.sampleQuestions = sampleQuestions;
    }

    public String getTopicName() { return topicName; }
    public void setTopicName(String topicName) { this.topicName = topicName; }

    public String getExplanationMarkdown() { return explanationMarkdown; }
    public void setExplanationMarkdown(String explanationMarkdown) { this.explanationMarkdown = explanationMarkdown; }

    public List<String> getKeyTakeaways() { return keyTakeaways; }
    public void setKeyTakeaways(List<String> keyTakeaways) { this.keyTakeaways = keyTakeaways; }

    public List<String> getSampleQuestions() { return sampleQuestions; }
    public void setSampleQuestions(List<String> sampleQuestions) { this.sampleQuestions = sampleQuestions; }
}
