import { Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const userData = JSON.parse(user);
    const requiredRoles = route.data['roles'] as string[];

    if (requiredRoles && requiredRoles.includes(userData.role)) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const user = localStorage.getItem('user');
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const userData = JSON.parse(user);
  const requiredRoles = route.data['roles'] as string[];

  if (requiredRoles && requiredRoles.includes(userData.role)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

