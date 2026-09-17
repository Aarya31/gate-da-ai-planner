package com.gateda.planner.entity;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "user_availabilities")
public class UserAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private int dayOfWeek; // 1 = Monday, 7 = Sunday

    @Column(nullable = false)
    private double maxHours;

    private LocalTime preferredStartTime;

    private LocalTime preferredEndTime;

    public UserAvailability() {}

    public UserAvailability(UUID userId, int dayOfWeek, double maxHours, LocalTime preferredStartTime, LocalTime preferredEndTime) {
        this.userId = userId;
        this.dayOfWeek = dayOfWeek;
        this.maxHours = maxHours;
        this.preferredStartTime = preferredStartTime;
        this.preferredEndTime = preferredEndTime;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public int getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(int dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public double getMaxHours() { return maxHours; }
    public void setMaxHours(double maxHours) { this.maxHours = maxHours; }

    public LocalTime getPreferredStartTime() { return preferredStartTime; }
    public void setPreferredStartTime(LocalTime preferredStartTime) { this.preferredStartTime = preferredStartTime; }

    public LocalTime getPreferredEndTime() { return preferredEndTime; }
    public void setPreferredEndTime(LocalTime preferredEndTime) { this.preferredEndTime = preferredEndTime; }
}
