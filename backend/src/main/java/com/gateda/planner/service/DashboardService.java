package com.gateda.planner.service;

import com.gateda.planner.dto.DashboardStatsDto;
import com.gateda.planner.dto.StudyEventDto;
import com.gateda.planner.entity.StudyEvent;
import com.gateda.planner.entity.UserAvailability;
import com.gateda.planner.entity.enums.EventStatus;
import com.gateda.planner.repository.*;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final StudyEventRepository eventRepository;
    private final TopicRepository topicRepository;
    private final UserAvailabilityRepository availabilityRepository;
    private final EventService eventService;

    public DashboardService(StudyEventRepository eventRepository, TopicRepository topicRepository,
                            UserAvailabilityRepository availabilityRepository, EventService eventService) {
        this.eventRepository = eventRepository;
        this.topicRepository = topicRepository;
        this.availabilityRepository = availabilityRepository;
        this.eventService = eventService;
    }

    public DashboardStatsDto getDashboardStats(UUID userId) {
        DashboardStatsDto stats = new DashboardStatsDto();

        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        // Fetch user events
        List<StudyEvent> allEvents = eventRepository.findByUserId(userId);
        List<StudyEvent> todaysEvents = eventRepository.findByUserIdAndEventDate(userId, today);
        List<StudyEvent> thisWeeksEvents = eventRepository.findByUserIdAndEventDateBetweenOrderByEventDateAscStartTimeAsc(userId, startOfWeek, endOfWeek);

        // Todays sessions
        stats.setTodayTotalSessions(todaysEvents.size());
        int todayCompleted = (int) todaysEvents.stream().filter(e -> e.getStatus() == EventStatus.COMPLETED).count();
        stats.setTodayCompletedSessions(todayCompleted);
        stats.setTodaysSessions(todaysEvents.stream().map(eventService::mapToDto).collect(Collectors.toList()));

        // Weekly hours calculation
        double completedMinutes = thisWeeksEvents.stream()
                .filter(e -> e.getStatus() == EventStatus.COMPLETED)
                .mapToInt(StudyEvent::getDurationMinutes)
                .sum();
        stats.setThisWeekCompletedHours(Math.round((completedMinutes / 60.0) * 10.0) / 10.0);

        List<UserAvailability> availabilities = availabilityRepository.findByUserIdOrderByDayOfWeekAsc(userId);
        double weeklyTargetHours = availabilities.stream().mapToDouble(UserAvailability::getMaxHours).sum();
        stats.setThisWeekTargetHours(weeklyTargetHours > 0 ? weeklyTargetHours : 21.0);

        // Session status counts
        int totalCompleted = (int) allEvents.stream().filter(e -> e.getStatus() == EventStatus.COMPLETED).count();
        int totalPending = (int) allEvents.stream().filter(e -> e.getStatus() == EventStatus.NOT_STARTED || e.getStatus() == EventStatus.IN_PROGRESS).count();
        int totalMissed = (int) allEvents.stream().filter(e -> e.getStatus() == EventStatus.MISSED).count();

        stats.setTotalCompletedSessions(totalCompleted);
        stats.setTotalPendingSessions(totalPending);
        stats.setTotalMissedSessions(totalMissed);

        // Calculate Streak Days
        stats.setCurrentStreakDays(calculateStreakDays(allEvents, today));

        // Overall Syllabus completion
        long totalTopicsCount = topicRepository.count();
        if (totalTopicsCount > 0 && totalCompleted > 0) {
            double percentage = Math.min(100.0, ((double) totalCompleted / (totalTopicsCount * 1.5)) * 100.0);
            stats.setOverallSyllabusProgressPercentage(Math.round(percentage * 10.0) / 10.0);
        } else {
            stats.setOverallSyllabusProgressPercentage(0.0);
        }

        // Weak subjects placeholder / dynamic
        stats.setWeakSubjects(Arrays.asList("Probability & Statistics", "Linear Algebra", "Calculus & Optimization"));

        return stats;
    }

    private int calculateStreakDays(List<StudyEvent> allEvents, LocalDate today) {
        Set<LocalDate> completedDates = allEvents.stream()
                .filter(e -> e.getStatus() == EventStatus.COMPLETED)
                .map(StudyEvent::getEventDate)
                .collect(Collectors.toSet());

        int streak = 0;
        LocalDate checkDate = today;

        if (!completedDates.contains(today)) {
            checkDate = today.minusDays(1);
        }

        while (completedDates.contains(checkDate)) {
            streak++;
            checkDate = checkDate.minusDays(1);
        }

        return streak;
    }
}
