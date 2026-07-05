import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../../models/user.model';
import { ChatSignalStore } from './chat-signal.store';

@Injectable({ providedIn: 'root' })
export class AuthSignalStore {
  private http = inject(HttpClient);
  private chatStore = inject(ChatSignalStore);
  private tokenKey = 'rasoisathi_token';
  private userKey = 'rasoisathi_user';

  token = signal<string | null>(sessionStorage.getItem(this.tokenKey));
  user = signal<User | null>(this.readUser());
  isLoggedIn = computed(() => !!this.token());

  register(data: { name: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(tap((res) => this.setSession(res)));
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data).pipe(tap((res) => this.setSession(res)));
  }

  loadProfile() {
    return this.http.get<User>(`${environment.apiUrl}/auth/profile`).pipe(tap((user) => this.user.set(user)));
  }

  updateProfile(name: string) {
    return this.http.put<User>(`${environment.apiUrl}/auth/profile`, { name }).pipe(tap((user) => this.user.set({ ...this.user(), ...user })));
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.put<{ message: string }>(`${environment.apiUrl}/auth/password`, { currentPassword, newPassword });
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    this.token.set(null);
    this.user.set(null);
    this.chatStore.clearSession();
  }

  private setSession(res: AuthResponse): void {
    sessionStorage.setItem(this.tokenKey, res.token);
    sessionStorage.setItem(this.userKey, JSON.stringify(res.user));
    this.token.set(res.token);
    this.user.set(res.user);
  }

  private readUser(): User | null {
    const raw = sessionStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) as User : null;
  }
}
