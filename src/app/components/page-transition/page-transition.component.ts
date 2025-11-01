import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-page-transition',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #pageElement class="page-transition-wrapper">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .page-transition-wrapper {
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class PageTransitionComponent implements AfterViewInit {
  @ViewChild('pageElement') pageElement!: ElementRef<HTMLElement>;

  constructor(private animationService: AnimationService) {}

  ngAfterViewInit(): void {
    if (this.pageElement) {
      this.animationService.fadeIn(this.pageElement.nativeElement, 0.5);
    }
  }
}

