import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  private activities$ = new BehaviorSubject<Activity[]>([]);

  constructor() {
    // Activities are added dynamically
  }

  

  getActivities(): Observable<Activity[]> {
    return this.activities$.asObservable();
  }

  addActivity(activity: Activity): void {
    const current = this.activities$.value;
    // Add new activity at the beginning
    this.activities$.next([activity, ...current]);
  }

  clearActivities(): void {
    this.activities$.next([]);
  }
}

