import { Injectable } from '@angular/core';
import gsap from 'gsap';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  constructor() {}

  /**
   * Anima a entrada de um elemento com fade in
   */
  fadeIn(element: HTMLElement, duration = 0.5): gsap.core.Tween {
    return gsap.to(element, {
      opacity: 1,
      duration,
      ease: 'power2.out',
    });
  }

  /**
   * Anima a saída de um elemento com fade out
   */
  fadeOut(element: HTMLElement, duration = 0.5): gsap.core.Tween {
    return gsap.to(element, {
      opacity: 0,
      duration,
      ease: 'power2.out',
    });
  }

  /**
   * Anima a entrada de um elemento com slide up
   */
  slideUp(element: HTMLElement, duration = 0.5): gsap.core.Tween {
    return gsap.to(element, {
      y: 0,
      opacity: 1,
      duration,
      ease: 'power2.out',
    });
  }

  /**
   * Anima a entrada de um elemento com slide down
   */
  slideDown(element: HTMLElement, duration = 0.5): gsap.core.Tween {
    return gsap.to(element, {
      y: 0,
      opacity: 1,
      duration,
      ease: 'power2.out',
    });
  }

  /**
   * Anima a entrada de um elemento com scale
   */
  scaleIn(element: HTMLElement, duration = 0.5): gsap.core.Tween {
    return gsap.to(element, {
      scale: 1,
      opacity: 1,
      duration,
      ease: 'back.out',
    });
  }

  /**
   * Anima um elemento com bounce
   */
  bounce(element: HTMLElement, duration = 0.6): gsap.core.Tween {
    return gsap.to(element, {
      y: -10,
      duration: duration / 2,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    });
  }

  /**
   * Anima um elemento com pulse
   */
  pulse(element: HTMLElement, duration = 0.6): gsap.core.Tween {
    return gsap.to(element, {
      scale: 1.05,
      duration: duration / 2,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    });
  }

  /**
   * Anima um elemento com shake
   */
  shake(element: HTMLElement, duration = 0.5): gsap.core.Tween {
    return gsap.to(element, {
      x: -5,
      duration: duration / 4,
      ease: 'power2.out',
      yoyo: true,
      repeat: 3,
    });
  }

  /**
   * Anima um elemento com rotate
   */
  rotate(element: HTMLElement, angle = 360, duration = 1): gsap.core.Tween {
    return gsap.to(element, {
      rotation: angle,
      duration,
      ease: 'power2.out',
    });
  }

  /**
   * Anima múltiplos elementos em sequência
   */
  staggerIn(elements: HTMLElement[], duration = 0.5, stagger = 0.1): gsap.core.Timeline {
    const tl = gsap.timeline();
    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out',
    });
    return tl;
  }

  /**
   * Anima um elemento com flip
   */
  flip(element: HTMLElement, duration = 0.6): gsap.core.Tween {
    return gsap.to(element, {
      rotationY: 360,
      duration,
      ease: 'back.out',
    });
  }

  /**
   * Anima um elemento com glow
   */
  glow(element: HTMLElement, duration = 0.5): gsap.core.Tween {
    return gsap.to(element, {
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)',
      duration,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    });
  }

  /**
   * Anima um elemento com slide left
   */
  slideLeft(element: HTMLElement, duration = 0.5): gsap.core.Tween {
    return gsap.to(element, {
      x: 0,
      opacity: 1,
      duration,
      ease: 'power2.out',
    });
  }

  /**
   * Anima um elemento com slide right
   */
  slideRight(element: HTMLElement, duration = 0.5): gsap.core.Tween {
    return gsap.to(element, {
      x: 0,
      opacity: 1,
      duration,
      ease: 'power2.out',
    });
  }
}

