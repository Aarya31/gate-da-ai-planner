export type EventType = 
  | 'CONCEPT_LEARNING' 
  | 'PYQ_PRACTICE' 
  | 'REVISION' 
  | 'MOCK_TEST' 
  | 'ANALYSIS' 
  | 'DOUBT_SESSION' 
  | 'REST' 
  | 'MILESTONE';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EventStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'MISSED';

export interface StudyEvent {
  id?: string;
  topicId?: string;
  subjectName?: string;
  topicName?: string;
  subtopicName?: string;
  title: string;
  description?: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  durationMinutes: number;
  eventType: EventType;
  priority: Priority;
  status: EventStatus;
  goal?: string;
  questionTarget?: number;
  pyqTarget?: number;
  notes?: string;
  resources?: string;
}
