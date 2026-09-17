export interface User {
  id: string;
  email: string;
  fullName: string;
  targetExam?: string;
  targetExamDate?: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  fullName: string;
}

export interface UserAvailability {
  dayOfWeek: number;
  maxHours: number;
  preferredStartTime?: string;
  preferredEndTime?: string;
}
