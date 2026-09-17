import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  triggerAt: string;
  isRead: boolean;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = '/api/v1/notifications';
  notifications = signal<AppNotification[]>([]);

  constructor(private http: HttpClient) {}

  requestBrowserPermission(): void {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  showBrowserNotification(title: string, body: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }

  getNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.apiUrl);
  }

  markAsRead(id: string): Observable<AppNotification> {
    return this.http.patch<AppNotification>(`${this.apiUrl}/${id}/read`, {});
  }
}
