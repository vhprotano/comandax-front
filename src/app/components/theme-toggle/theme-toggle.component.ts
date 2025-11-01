import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="relative inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300"
      [ngClass]="currentTheme === 'dark'
        ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
      title="Alternar tema"
    >
      <span class="text-lg transition-transform duration-300" [ngClass]="{ 'rotate-180': currentTheme === 'dark' }">
        {{ currentTheme === 'dark' ? '🌙' : '☀️' }}
      </span>
    </button>
  `,
  styles: [],
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  currentTheme: Theme = 'light';
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService
      .getTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        this.currentTheme = theme;
      });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

