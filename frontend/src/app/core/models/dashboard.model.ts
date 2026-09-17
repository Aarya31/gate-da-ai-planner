import { StudyEvent } from './event.model';

export interface DashboardStats {
  todayCompletedSessions: number;
  todayTotalSessions: number;
  thisWeekCompletedHours: number;
  thisWeekTargetHours: number;
  totalCompletedSessions: number;
  totalPendingSessions: number;
  totalMissedSessions: number;
  currentStreakDays: number;
  overallSyllabusProgressPercentage: number;
  weakSubjects: string[];
  todaysSessions: StudyEvent[];
}
