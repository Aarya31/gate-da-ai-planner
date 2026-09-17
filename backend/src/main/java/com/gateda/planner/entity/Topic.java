package com.gateda.planner.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    @JsonIgnore
    private Subject subject;

    @Column(nullable = false)
    private String name;

    private int weightageRating; // 1 to 5 scale

    private int displayOrder;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subtopic> subtopics = new ArrayList<>();

    public Topic() {}

    public Topic(Subject subject, String name, int weightageRating, int displayOrder) {
        this.subject = subject;
        this.name = name;
        this.weightageRating = weightageRating;
        this.displayOrder = displayOrder;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getWeightageRating() { return weightageRating; }
    public void setWeightageRating(int weightageRating) { this.weightageRating = weightageRating; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }

    public List<Subtopic> getSubtopics() { return subtopics; }
    public void setSubtopics(List<Subtopic> subtopics) { this.subtopics = subtopics; }
}
