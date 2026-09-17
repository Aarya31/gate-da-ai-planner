package com.gateda.planner.service;

import com.gateda.planner.entity.PYQRecord;
import com.gateda.planner.entity.Topic;
import com.gateda.planner.repository.PYQRecordRepository;
import com.gateda.planner.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PyqService {

    private final PYQRecordRepository pyqRepository;
    private final TopicRepository topicRepository;

    public PyqService(PYQRecordRepository pyqRepository, TopicRepository topicRepository) {
        this.pyqRepository = pyqRepository;
        this.topicRepository = topicRepository;
    }

    public List<PYQRecord> getPyqRecords(UUID userId) {
        return pyqRepository.findByUserId(userId);
    }

    @Transactional
    public PYQRecord recordPyqSession(UUID userId, UUID topicId, int attempted, int correct, int incorrect) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found: " + topicId));

        PYQRecord record = new PYQRecord(userId, topic, attempted, correct, incorrect);
        return pyqRepository.save(record);
    }
}
