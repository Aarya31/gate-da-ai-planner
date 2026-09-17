package com.gateda.planner.dto;

import java.time.LocalTime;

public class UserAvailabilityDto {
    private int dayOfWeek; // 1 = Monday, 7 = Sunday
    private double maxHours;
    private LocalTime preferredStartTime;
    private LocalTime preferredEndTime;

    public UserAvailabilityDto() {}

    public UserAvailabilityDto(int dayOfWeek, double maxHours, LocalTime preferredStartTime, LocalTime preferredEndTime) {
        this.dayOfWeek = dayOfWeek;
        this.maxHours = maxHours;
        this.preferredStartTime = preferredStartTime;
        this.preferredEndTime = preferredEndTime;
    }

    public int getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(int dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public double getMaxHours() { return maxHours; }
    public void setMaxHours(double maxHours) { this.maxHours = maxHours; }

    public LocalTime getPreferredStartTime() { return preferredStartTime; }
    public void setPreferredStartTime(LocalTime preferredStartTime) { this.preferredStartTime = preferredStartTime; }

    public LocalTime getPreferredEndTime() { return preferredEndTime; }
    public void setPreferredEndTime(LocalTime preferredEndTime) { this.preferredEndTime = preferredEndTime; }
}
