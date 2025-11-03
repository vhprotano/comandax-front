import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../models';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private employees$ = new BehaviorSubject<Employee[]>([]);

  constructor() {
    // Load employees when needed
  }

  

  getEmployees(): Observable<Employee[]> {
    return this.employees$.asObservable();
  }

  addEmployee(employee: Employee): void {
    const current = this.employees$.value;
    this.employees$.next([...current, employee]);
  }

  updateEmployee(id: string, employee: Partial<Employee>): void {
    const current = this.employees$.value;
    const updated = current?.map((e) => (e.id === id ? { ...e, ...employee } : e));
    this.employees$.next(updated);
  }

  deleteEmployee(id: string): void {
    const current = this.employees$.value;
    this.employees$.next(current.filter((e) => e.id !== id));
  }
}

