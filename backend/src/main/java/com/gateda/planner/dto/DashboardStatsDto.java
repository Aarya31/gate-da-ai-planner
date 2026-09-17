package com.gateda.planner.dto;

import java.util.List;

public class DashboardStatsDto {
    private int todayCompletedSessions;
    private int todayTotalSessions;
    private double thisWeekCompletedHours;
    private double thisWeekTargetHours;
    private int totalCompletedSessions;
    private int totalPendingSessions;
    private int totalMissedSessions;
    private int currentStreakDays;
    private double overallSyllabusProgressPercentage;
    private List<String> weakSubjects;
    private List<StudyEventDto> todaysSessions;

    public DashboardStatsDto() {}

    public int getTodayCompletedSessions() { return todayCompletedSessions; }
    public void setTodayCompletedSessions(int todayCompletedSessions) { this.todayCompletedSessions = todayCompletedSessions; }

    public int getTodayTotalSessions() { return todayTotalSessions; }
    public void setTodayTotalSessions(int todayTotalSessions) { this.todayTotalSessions = todayTotalSessions; }

    public double getThisWeekCompletedHours() { return thisWeekCompletedHours; }
    public void setThisWeekCompletedHours(double thisWeekCompletedHours) { this.thisWeekCompletedHours = thisWeekCompletedHours; }

    public double getThisWeekTargetHours() { return thisWeekTargetHours; }
    public void setThisWeekTargetHours(double thisWeekTargetHours) { this.thisWeekTargetHours = thisWeekTargetHours; }

    public int getTotalCompletedSessions() { return totalCompletedSessions; }
    public void setTotalCompletedSessions(int totalCompletedSessions) { this.totalCompletedSessions = totalCompletedSessions; }

    public int getTotalPendingSessions() { return totalPendingSessions; }
    public void setTotalPendingSessions(int totalPendingSessions) { this.totalPendingSessions = totalPendingSessions; }

    public int getTotalMissedSessions() { return totalMissedSessions; }
    public void setTotalMissedSessions(int totalMissedSessions) { this.totalMissedSessions = totalMissedSessions; }

    public int getCurrentStreakDays() { return currentStreakDays; }
    public void setCurrentStreakDays(int currentStreakDays) { this.currentStreakDays = currentStreakDays; }

    public double getOverallSyllabusProgressPercentage() { return overallSyllabusProgressPercentage; }
    public void setOverallSyllabusProgressPercentage(double overallSyllabusProgressPercentage) { this.overallSyllabusProgressPercentage = overallSyllabusProgressPercentage; }

    public List<String> getWeakSubjects() { return weakSubjects; }
    public void setWeakSubjects(List<String> weakSubjects) { this.weakSubjects = weakSubjects; }

    public List<StudyEventDto> getTodaysSessions() { return todaysSessions; }
    public void setTodaysSessions(List<StudyEventDto> todaysSessions) { this.todaysSessions = todaysSessions; }
}
