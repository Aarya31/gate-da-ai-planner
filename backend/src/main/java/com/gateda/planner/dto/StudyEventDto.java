package com.gateda.planner.dto;

import com.gateda.planner.entity.enums.EventStatus;
import com.gateda.planner.entity.enums.EventType;
import com.gateda.planner.entity.enums.Priority;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class StudyEventDto {
    private UUID id;
    private UUID topicId;
    private String subjectName;
    private String topicName;
    private String subtopicName;
    private String title;
    private String description;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int durationMinutes;
    private EventType eventType;
    private Priority priority;
    private EventStatus status;
    private String goal;
    private Integer questionTarget;
    private Integer pyqTarget;
    private String notes;
    private String resources;

    public StudyEventDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTopicId() { return topicId; }
    public void setTopicId(UUID topicId) { this.topicId = topicId; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getTopicName() { return topicName; }
    public void setTopicName(String topicName) { this.topicName = topicName; }

    public String getSubtopicName() { return subtopicName; }
    public void setSubtopicName(String subtopicName) { this.subtopicName = subtopicName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public Integer getQuestionTarget() { return questionTarget; }
    public void setQuestionTarget(Integer questionTarget) { this.questionTarget = questionTarget; }

    public Integer getPyqTarget() { return pyqTarget; }
    public void setPyqTarget(Integer pyqTarget) { this.pyqTarget = pyqTarget; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getResources() { return resources; }
    public void setResources(String resources) { this.resources = resources; }
}
