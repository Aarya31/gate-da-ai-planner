package com.gateda.planner.service;

import com.gateda.planner.dto.StudyEventDto;
import com.gateda.planner.entity.StudyEvent;
import com.gateda.planner.entity.Topic;
import com.gateda.planner.entity.enums.EventStatus;
import com.gateda.planner.repository.StudyEventRepository;
import com.gateda.planner.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final StudyEventRepository eventRepository;
    private final TopicRepository topicRepository;

    public EventService(StudyEventRepository eventRepository, TopicRepository topicRepository) {
        this.eventRepository = eventRepository;
        this.topicRepository = topicRepository;
    }

    public List<StudyEventDto> getEvents(UUID userId, LocalDate start, LocalDate end) {
        LocalDate startDate = start != null ? start : LocalDate.now().minusMonths(1);
        LocalDate endDate = end != null ? end : LocalDate.now().plusMonths(3);

        return eventRepository.findByUserIdAndEventDateBetweenOrderByEventDateAscStartTimeAsc(userId, startDate, endDate)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<StudyEventDto> getTodaysEvents(UUID userId) {
        return eventRepository.findByUserIdAndEventDate(userId, LocalDate.now())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudyEventDto createEvent(UUID userId, StudyEventDto dto) {
        StudyEvent event = new StudyEvent();
        event.setUserId(userId);
        updateEventFromDto(event, dto);
        event = eventRepository.save(event);
        return mapToDto(event);
    }

    @Transactional
    public StudyEventDto updateEvent(UUID userId, UUID eventId, StudyEventDto dto) {
        StudyEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));

        if (!event.getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized event access");
        }

        updateEventFromDto(event, dto);
        event = eventRepository.save(event);
        return mapToDto(event);
    }

    @Transactional
    public StudyEventDto updateStatus(UUID userId, UUID eventId, EventStatus status) {
        StudyEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));

        if (!event.getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized event access");
        }

        event.setStatus(status);
        event = eventRepository.save(event);
        return mapToDto(event);
    }

    @Transactional
    public void deleteEvent(UUID userId, UUID eventId) {
        StudyEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));

        if (!event.getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized event access");
        }

        eventRepository.delete(event);
    }

    private void updateEventFromDto(StudyEvent event, StudyEventDto dto) {
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getEventDate() != null ? dto.getEventDate() : LocalDate.now());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setDurationMinutes(dto.getDurationMinutes());
        if (dto.getEventType() != null) event.setEventType(dto.getEventType());
        if (dto.getPriority() != null) event.setPriority(dto.getPriority());
        if (dto.getStatus() != null) event.setStatus(dto.getStatus());
        event.setGoal(dto.getGoal());
        event.setQuestionTarget(dto.getQuestionTarget());
        event.setPyqTarget(dto.getPyqTarget());
        event.setNotes(dto.getNotes());
        event.setResources(dto.getResources());
        event.setSubjectName(dto.getSubjectName());
        event.setSubtopicName(dto.getSubtopicName());

        if (dto.getTopicId() != null) {
            Topic topic = topicRepository.findById(dto.getTopicId()).orElse(null);
            event.setTopic(topic);
            if (topic != null && topic.getSubject() != null) {
                event.setSubjectName(topic.getSubject().getName());
            }
        }
    }

    public StudyEventDto mapToDto(StudyEvent event) {
        StudyEventDto dto = new StudyEventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setEventDate(event.getEventDate());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setDurationMinutes(event.getDurationMinutes());
        dto.setEventType(event.getEventType());
        dto.setPriority(event.getPriority());
        dto.setStatus(event.getStatus());
        dto.setGoal(event.getGoal());
        dto.setQuestionTarget(event.getQuestionTarget());
        dto.setPyqTarget(event.getPyqTarget());
        dto.setNotes(event.getNotes());
        dto.setResources(event.getResources());
        dto.setSubjectName(event.getSubjectName());
        dto.setSubtopicName(event.getSubtopicName());

        if (event.getTopic() != null) {
            dto.setTopicId(event.getTopic().getId());
            dto.setTopicName(event.getTopic().getName());
            if (event.getTopic().getSubject() != null) {
                dto.setSubjectName(event.getTopic().getSubject().getName());
            }
        }
        return dto;
    }
}
