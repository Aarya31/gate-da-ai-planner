package com.gateda.planner.service;

import com.gateda.planner.entity.StudyProgress;
import com.gateda.planner.entity.Topic;
import com.gateda.planner.entity.enums.MasteryLevel;
import com.gateda.planner.repository.StudyProgressRepository;
import com.gateda.planner.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProgressService {

    private final StudyProgressRepository progressRepository;
    private final TopicRepository topicRepository;

    public ProgressService(StudyProgressRepository progressRepository, TopicRepository topicRepository) {
        this.progressRepository = progressRepository;
        this.topicRepository = topicRepository;
    }

    public List<StudyProgress> getUserProgress(UUID userId) {
        return progressRepository.findByUserId(userId);
    }

    @Transactional
    public StudyProgress updateTopicProgress(UUID userId, UUID topicId, MasteryLevel level, double completionPercentage, String notes) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found: " + topicId));

        StudyProgress progress = progressRepository.findByUserIdAndTopicId(userId, topicId)
                .orElseGet(() -> new StudyProgress(userId, topic, level, completionPercentage));

        progress.setMasteryLevel(level);
        progress.setCompletionPercentage(completionPercentage);
        if (notes != null) progress.setNotes(notes);
        if (level == MasteryLevel.REVISED || level == MasteryLevel.STRONG) {
            progress.setLastRevisedAt(LocalDateTime.now());
        }

        return progressRepository.save(progress);
    }
}
