package com.gateda.planner.dto;

import java.time.LocalDate;

public class AiPlanRequestDto {
    private String prompt;
    private LocalDate startDate;
    private LocalDate endDate;
    private String focusArea;

    public AiPlanRequestDto() {}

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getFocusArea() { return focusArea; }
    public void setFocusArea(String focusArea) { this.focusArea = focusArea; }
}
