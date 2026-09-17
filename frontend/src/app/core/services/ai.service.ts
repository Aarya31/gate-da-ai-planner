import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiPlanRequest, AiPlanResponse, TopicExplainRequest, TopicExplainResponse } from '../models/ai.model';
import { StudyEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = '/api/v1/ai';

  constructor(private http: HttpClient) {}

  generateSchedule(request: AiPlanRequest): Observable<AiPlanResponse> {
    return this.http.post<AiPlanResponse>(`${this.apiUrl}/generate-schedule`, request);
  }

  modifySchedule(request: AiPlanRequest): Observable<AiPlanResponse> {
    return this.http.post<AiPlanResponse>(`${this.apiUrl}/modify-schedule`, request);
  }

  applyProposal(events: StudyEvent[]): Observable<StudyEvent[]> {
    return this.http.post<StudyEvent[]>(`${this.apiUrl}/apply-proposal`, events);
  }

  explainTopic(request: TopicExplainRequest): Observable<TopicExplainResponse> {
    return this.http.post<TopicExplainResponse>(`${this.apiUrl}/explain-topic`, request);
  }
}
