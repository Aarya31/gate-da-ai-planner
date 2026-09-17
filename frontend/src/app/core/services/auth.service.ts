import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, User, UserAvailability } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/v1/auth';
  private userApiUrl = '/api/v1/users';

  currentUser = signal<User | null>(this.getStoredUser());
  token = signal<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  register(email: string, password: string, fullName: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password, fullName });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.token.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  getAvailability(): Observable<UserAvailability[]> {
    return this.http.get<UserAvailability[]>(`${this.userApiUrl}/availability`);
  }

  updateAvailability(availabilities: UserAvailability[]): Observable<UserAvailability[]> {
    return this.http.put<UserAvailability[]>(`${this.userApiUrl}/availability`, availabilities);
  }

  private handleAuth(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    const user: User = { id: response.userId, email: response.email, fullName: response.fullName };
    localStorage.setItem('user', JSON.stringify(user));
    this.token.set(response.token);
    this.currentUser.set(user);
  }

  private getStoredUser(): User | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }
}
