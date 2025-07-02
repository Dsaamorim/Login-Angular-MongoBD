import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthResponse } from './models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // login(email: string, password: string): Observable<any> {
  //   return this.http.post(`${this.API_URL}/login`, { email, password }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  login(email: string, password: string): Observable<AuthResponse> {
  return this.http
    .post<AuthResponse>(`${this.API_URL}/login`, { email, password })
    .pipe(catchError(this.handleError));
  }

  // register(userData: { name: string; email: string; password: string }): Observable<any> {
  //   return this.http.post(`${this.API_URL}/register`, userData);
  // }

  register(userData: { name: string; email: string; password: string }): Observable<AuthResponse> {
  return this.http
    .post<AuthResponse>(`${this.API_URL}/register`, userData)
    .pipe(catchError(this.handleError));
  }

  getProfile() {
    return this.http.get(`${this.API_URL}/profile`);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na requisição:', error);
    
    let errorMessage = 'Erro desconhecido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.message;
    }
    
    return throwError(() => ({
      status: error.status,
      message: errorMessage
    }));
  }
}