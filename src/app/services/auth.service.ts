import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'MANAGER' | 'WAITER' | 'KITCHEN';
  establishment_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Configurar Supabase - você precisa adicionar suas credenciais
    this.supabase = createClient(
      'https://your-project.supabase.co',
      'your-anon-key'
    );
    this.checkAuth();
  }

  private checkAuth(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser$.next(JSON.parse(user));
      this.isAuthenticated$.next(true);
    }
  }

  login(email: string, password: string, role: 'MANAGER' | 'WAITER' | 'KITCHEN' = 'MANAGER'): Observable<User> {
    return new Observable((observer) => {
      // Implementar login com Supabase
      // Por enquanto, simulando login
      const mockUser: User = {
        id: '1',
        email,
        name: 'User',
        role: role,
        establishment_id: '1',
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      this.currentUser$.next(mockUser);
      this.isAuthenticated$.next(true);
      observer.next(mockUser);
      observer.complete();
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUser$.next(null);
    this.isAuthenticated$.next(false);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

