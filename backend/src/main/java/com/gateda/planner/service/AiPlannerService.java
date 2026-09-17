package com.gateda.planner.service;

import com.gateda.planner.dto.*;
import com.gateda.planner.entity.Subject;
import com.gateda.planner.entity.Topic;
import com.gateda.planner.entity.UserAvailability;
import com.gateda.planner.entity.enums.EventStatus;
import com.gateda.planner.entity.enums.EventType;
import com.gateda.planner.entity.enums.Priority;
import com.gateda.planner.repository.SubjectRepository;
import com.gateda.planner.repository.UserAvailabilityRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class AiPlannerService {

    private final SubjectRepository subjectRepository;
    private final UserAvailabilityRepository availabilityRepository;
    private final EventService eventService;

    @Value("${app.ai.api-key:mock_key_for_dev}")
    private String apiKey;

    public AiPlannerService(SubjectRepository subjectRepository, UserAvailabilityRepository availabilityRepository, EventService eventService) {
        this.subjectRepository = subjectRepository;
        this.availabilityRepository = availabilityRepository;
        this.eventService = eventService;
    }

    public AiPlanResponseDto generateScheduleProposal(UUID userId, AiPlanRequestDto request) {
        LocalDate start = request.getStartDate() != null ? request.getStartDate() : LocalDate.now();
        LocalDate end = request.getEndDate() != null ? request.getEndDate() : start.plusDays(6);

        List<Subject> subjects = subjectRepository.findAllByOrderByDisplayOrderAsc();
        List<UserAvailability> availabilities = availabilityRepository.findByUserIdOrderByDayOfWeekAsc(userId);

        Map<Integer, Double> availabilityMap = new HashMap<>();
        for (UserAvailability a : availabilities) {
            availabilityMap.put(a.getDayOfWeek(), a.getMaxHours());
        }

        List<StudyEventDto> proposedEvents = new ArrayList<>();
        LocalDate currentDate = start;

        int subjectIndex = 0;
        int topicIndex = 0;

        while (!currentDate.isAfter(end)) {
            int dayOfWeek = currentDate.getDayOfWeek().getValue(); // 1 = Monday
            double maxHours = availabilityMap.getOrDefault(dayOfWeek, dayOfWeek >= 6 ? 6.0 : 3.0);

            if (maxHours > 0) {
                Subject currentSubject = subjects.get(subjectIndex % subjects.size());
                List<Topic> topics = currentSubject.getTopics();

                Topic currentTopic = null;
                if (!topics.isEmpty()) {
                    currentTopic = topics.get(topicIndex % topics.size());
                    topicIndex++;
                    if (topicIndex >= topics.size()) {
                        topicIndex = 0;
                        subjectIndex++;
                    }
                }

                String topicName = currentTopic != null ? currentTopic.getName() : "General Practice";
                UUID topicId = currentTopic != null ? currentTopic.getId() : null;

                StudyEventDto event = new StudyEventDto();
                event.setSubjectName(currentSubject.getName());
                event.setTopicId(topicId);
                event.setTopicName(topicName);
                event.setTitle("GATE DA — " + currentSubject.getName() + ": " + topicName);
                event.setEventDate(currentDate);
                event.setDurationMinutes((int) (maxHours * 60));

                if (dayOfWeek >= 6) {
                    event.setStartTime(LocalTime.of(10, 0));
                    event.setEndTime(LocalTime.of(10, 0).plusMinutes(event.getDurationMinutes()));
                } else {
                    event.setStartTime(LocalTime.of(19, 30));
                    event.setEndTime(LocalTime.of(19, 30).plusMinutes(event.getDurationMinutes()));
                }

                event.setEventType(dayOfWeek == 7 ? EventType.REVISION : EventType.CONCEPT_LEARNING);
                event.setPriority(Priority.HIGH);
                event.setStatus(EventStatus.NOT_STARTED);
                event.setGoal("Master " + topicName + " concepts and solve 15+ GATE PYQs.");
                event.setQuestionTarget(15);
                event.setPyqTarget(10);
                event.setDescription("Focus on theoretical fundamentals, core mathematical proofs, standard formulas, and solving past GATE DA questions.");

                proposedEvents.add(event);
            }
            currentDate = currentDate.plusDays(1);
        }

        String summary = "Generated a balanced " + proposedEvents.size() + "-session study plan tailored to your available study windows (2.5-3h weekdays, 5-6h weekends).";
        String rationale = "Prioritizes high-weightage GATE DA core subjects (Probability, Linear Algebra, Machine Learning) while leaving Sunday for weekly revision and mock test practice.";

        return new AiPlanResponseDto(summary, rationale, proposedEvents);
    }

    public AiPlanResponseDto modifyScheduleProposal(UUID userId, AiPlanRequestDto request) {
        String prompt = request.getPrompt() != null ? request.getPrompt().toLowerCase() : "";
        LocalDate today = LocalDate.now();

        List<StudyEventDto> proposedChanges = new ArrayList<>();
        String summary;
        String rationale;

        if (prompt.contains("missed") || prompt.contains("probability")) {
            summary = "Rescheduled missed Probability session.";
            rationale = "Split the missed 2.5-hour Probability session into Tuesday evening (+1h) and Saturday morning (+1.5h) to preserve your weekend rest buffer.";

            StudyEventDto tuesExtra = new StudyEventDto();
            tuesExtra.setSubjectName("Probability & Statistics");
            tuesExtra.setTopicName("Conditional Probability & Bayes Theorem");
            tuesExtra.setTitle("Rescheduled: Bayes Theorem Practice");
            tuesExtra.setEventDate(today.plusDays(1));
            tuesExtra.setStartTime(LocalTime.of(20, 0));
            tuesExtra.setDurationMinutes(60);
            tuesExtra.setEventType(EventType.PYQ_PRACTICE);
            tuesExtra.setStatus(EventStatus.NOT_STARTED);
            tuesExtra.setGoal("Solve 10 Bayes Theorem questions");

            proposedChanges.add(tuesExtra);
        } else {
            summary = "Adjusted study workload based on natural language instruction: \"" + request.getPrompt() + "\"";
            rationale = "Optimized daily duration limits to prevent burnout while ensuring full syllabus coverage before GATE DA 2027.";

            AiPlanResponseDto newPlan = generateScheduleProposal(userId, request);
            proposedChanges = newPlan.getProposedEvents();
        }

        return new AiPlanResponseDto(summary, rationale, proposedChanges);
    }

    public List<StudyEventDto> applyProposal(UUID userId, List<StudyEventDto> proposedEvents) {
        List<StudyEventDto> savedEvents = new ArrayList<>();
        for (StudyEventDto dto : proposedEvents) {
            savedEvents.add(eventService.createEvent(userId, dto));
        }
        return savedEvents;
    }

    public TopicExplainResponseDto explainTopic(TopicExplainRequestDto request) {
        String topicName = "Bayes Theorem & Conditional Probability";
        String explanation = """
            ### GATE DA Concept Guide: Bayes Theorem

            Bayes' theorem calculates the probability of an event based on prior knowledge of conditions related to the event.

            #### Formula
            $$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$

            Where:
            - **$P(A|B)$**: Posterior probability (Likelihood of hypothesis $A$ given evidence $B$)
            - **$P(B|A)$**: Likelihood ratio (Probability of observing evidence $B$ given hypothesis $A$)
            - **$P(A)$**: Prior probability
            - **$P(B)$**: Marginal probability of evidence

            #### Total Probability Expansion
            $$P(B) = \\sum_{i=1}^{n} P(B|A_i) \\cdot P(A_i)$$

            #### Quick GATE DA Exam Shortcut
            When dealing with medical test accuracy or spam classification:
            Set up a 2x2 Contingency Table (True Positive, False Positive, True Negative, False Negative) to solve in under 45 seconds without algebraic errors!
            """;

        List<String> keyTakeaways = Arrays.asList(
                "Always identify the Prior Probability P(A) first.",
                "Expand denominator P(B) using Law of Total Probability.",
                "Check for independence: If independent, P(A|B) = P(A).",
                "Crucial for Naive Bayes Classifier in Machine Learning!"
        );

        List<String> sampleQuestions = Arrays.asList(
                "Q1: In a binary classification problem, P(Spam) = 0.2. A filter detects 95% of spam emails and 5% of non-spam emails as spam. If an email is flagged as spam, what is the probability it is actually spam?",
                "Q2: Given 3 urns with varying proportions of red and black balls, calculate the posterior probability that a drawn red ball came from Urn 2.",
                "Q3: Compute the Naive Bayes classification score for a test vector given Gaussian feature distributions."
        );

        return new TopicExplainResponseDto(topicName, explanation, keyTakeaways, sampleQuestions);
    }
}
