export interface Subtopic {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  weightageRating: number;
  displayOrder: number;
  subtopics: Subtopic[];
}

export interface Subject {
  id: string;
  name: string;
  displayOrder: number;
  category: string;
  topics: Topic[];
}

export type MasteryLevel = 'NOT_STARTED' | 'LEARNING' | 'PRACTICED' | 'REVISED' | 'STRONG';

export interface StudyProgress {
  id?: string;
  userId?: string;
  topic: Topic;
  masteryLevel: MasteryLevel;
  completionPercentage: number;
  lastRevisedAt?: string;
  notes?: string;
}
