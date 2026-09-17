import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudyEvent, EventStatus } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = 'http://localhost:8080/api/v1/events';

  constructor(private http: HttpClient) {}

  getEvents(start?: string, end?: string): Observable<StudyEvent[]> {
    let params = new HttpParams();
    if (start) params = params.set('start', start);
    if (end) params = params.set('end', end);
    return this.http.get<StudyEvent[]>(this.apiUrl, { params });
  }

  getTodaysEvents(): Observable<StudyEvent[]> {
    return this.http.get<StudyEvent[]>(`${this.apiUrl}/today`);
  }

  createEvent(event: StudyEvent): Observable<StudyEvent> {
    return this.http.post<StudyEvent>(this.apiUrl, event);
  }

  updateEvent(id: string, event: StudyEvent): Observable<StudyEvent> {
    return this.http.put<StudyEvent>(`${this.apiUrl}/${id}`, event);
  }

  updateStatus(id: string, status: EventStatus): Observable<StudyEvent> {
    return this.http.patch<StudyEvent>(`${this.apiUrl}/${id}/status`, null, {
      params: new HttpParams().set('status', status)
    });
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
