import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PYQRecord {
  id: string;
  topic: { id: string; name: string };
  attempted: number;
  correct: number;
  incorrect: number;
  accuracyPercentage: number;
  recordedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PyqService {
  private apiUrl = '/api/v1/pyqs';

  constructor(private http: HttpClient) {}

  getPyqRecords(): Observable<PYQRecord[]> {
    return this.http.get<PYQRecord[]>(this.apiUrl);
  }

  recordPyqSession(topicId: string, attempted: number, correct: number, incorrect: number): Observable<PYQRecord> {
    const params = new HttpParams()
      .set('topicId', topicId)
      .set('attempted', attempted.toString())
      .set('correct', correct.toString())
      .set('incorrect', incorrect.toString());

    return this.http.post<PYQRecord>(this.apiUrl, null, { params });
  }
}
