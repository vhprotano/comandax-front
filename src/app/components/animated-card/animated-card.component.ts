import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-animated-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #cardElement class="card group hover:shadow-lg transition-all duration-300 cursor-pointer"
         (mouseenter)="onMouseEnter()"
         (mouseleave)="onMouseLeave()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AnimatedCardComponent implements AfterViewInit {
  @ViewChild('cardElement') cardElement!: ElementRef<HTMLElement>;
  @Input() animateOnHover = true;
  @Input() animateOnLoad = true;

  constructor(private animationService: AnimationService) {}

  ngAfterViewInit(): void {
    if (this.animateOnLoad && this.cardElement) {
      this.animationService.scaleIn(this.cardElement.nativeElement, 0.5);
    }
  }

  onMouseEnter(): void {
    if (this.animateOnHover && this.cardElement) {
      this.animationService.pulse(this.cardElement.nativeElement, 0.3);
    }
  }

  onMouseLeave(): void {
    // Reset animation
  }
}

