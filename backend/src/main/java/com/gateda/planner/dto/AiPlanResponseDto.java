package com.gateda.planner.dto;

import java.util.List;

public class AiPlanResponseDto {
    private String summary;
    private String rationale;
    private List<StudyEventDto> proposedEvents;

    public AiPlanResponseDto() {}

    public AiPlanResponseDto(String summary, String rationale, List<StudyEventDto> proposedEvents) {
        this.summary = summary;
        this.rationale = rationale;
        this.proposedEvents = proposedEvents;
    }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }

    public List<StudyEventDto> getProposedEvents() { return proposedEvents; }
    public void setProposedEvents(List<StudyEventDto> proposedEvents) { this.proposedEvents = proposedEvents; }
}
