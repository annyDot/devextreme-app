import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, Subscription, takeUntil, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private http = inject(HttpClient);
  private apiUrl = 'https://dev.supracontrol.com:8080/api/user/authenticate/';
  private destroy$ = new Subject<void>();

  login(username: string, password: string): void {
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);

    const headers = new HttpHeaders({
      Authorization: `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json',
    });

    this.http
      .post(this.apiUrl, {}, { headers })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
