package com.gateda.planner.service;

import com.gateda.planner.entity.MockTest;
import com.gateda.planner.repository.MockTestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class MockTestService {

    private final MockTestRepository mockTestRepository;

    public MockTestService(MockTestRepository mockTestRepository) {
        this.mockTestRepository = mockTestRepository;
    }

    public List<MockTest> getMockTests(UUID userId) {
        return mockTestRepository.findByUserIdOrderByTestDateDesc(userId);
    }

    @Transactional
    public MockTest createMockTest(UUID userId, MockTest mockTest) {
        mockTest.setUserId(userId);
        if (mockTest.getTestDate() == null) {
            mockTest.setTestDate(LocalDate.now());
        }
        return mockTestRepository.save(mockTest);
    }
}
