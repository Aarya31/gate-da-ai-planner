import { StudyEvent } from './event.model';

export interface AiPlanRequest {
  prompt?: string;
  startDate?: string;
  endDate?: string;
  focusArea?: string;
}

export interface AiPlanResponse {
  summary: string;
  rationale: string;
  proposedEvents: StudyEvent[];
}

export interface TopicExplainRequest {
  topicId?: string;
  question?: string;
  mode?: 'SIMPLE_EXPLANATION' | 'PRACTICE_QUESTIONS' | 'SHORTCUTS' | 'REVISION';
}

export interface TopicExplainResponse {
  topicName: string;
  explanationMarkdown: string;
  keyTakeaways: string[];
  sampleQuestions: string[];
}
