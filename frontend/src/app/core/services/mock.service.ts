import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MockTest {
  id?: string;
  title: string;
  testDate?: string;
  score: number;
  maxScore: number;
  attemptedQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
  timeTakenMinutes: number;
  notes?: string;
  accuracyPercentage?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockTestService {
  private apiUrl = 'http://localhost:8080/api/v1/mocks';

  constructor(private http: HttpClient) {}

  getMockTests(): Observable<MockTest[]> {
    return this.http.get<MockTest[]>(this.apiUrl);
  }

  createMockTest(mock: MockTest): Observable<MockTest> {
    return this.http.post<MockTest>(this.apiUrl, mock);
  }
}
