import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GraphQLService } from './graphql.service';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'MANAGER' | 'WAITER' | 'KITCHEN';
  establishment_id?: string;
  picture?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private graphqlService: GraphQLService) {
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

  loginWithGoogle(idToken: string, googleUser: any): Observable<User> {
    return this.graphqlService.authenticateWithGoogle(idToken).pipe(
      map((authResult) => {
        const user: User = {
          id: googleUser.id,
          email: authResult.email,
          name: googleUser.name,
          role: authResult.role as 'MANAGER' | 'WAITER' | 'KITCHEN',
          picture: googleUser.picture,
        };

        // Save JWT token
        localStorage.setItem('jwt_token', authResult.jwtToken);
        localStorage.setItem('user', JSON.stringify(user));

        this.currentUser$.next(user);
        this.isAuthenticated$.next(true);

        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');
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

