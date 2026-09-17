import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject, StudyProgress, MasteryLevel } from '../models/syllabus.model';

@Injectable({
  providedIn: 'root'
})
export class SyllabusService {
  private syllabusUrl = '/api/v1/syllabus';
  private progressUrl = '/api/v1/progress';

  constructor(private http: HttpClient) {}

  getSyllabus(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.syllabusUrl);
  }

  getUserProgress(): Observable<StudyProgress[]> {
    return this.http.get<StudyProgress[]>(this.progressUrl);
  }

  updateProgress(topicId: string, level: MasteryLevel, completionPercentage: number = 0.0, notes?: string): Observable<StudyProgress> {
    let params = new HttpParams()
      .set('level', level)
      .set('completionPercentage', completionPercentage.toString());
    if (notes) params = params.set('notes', notes);

    return this.http.put<StudyProgress>(`${this.progressUrl}/topic/${topicId}`, null, { params });
  }
}
