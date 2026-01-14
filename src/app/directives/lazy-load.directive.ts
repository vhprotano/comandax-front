import { Directive, ElementRef, OnInit } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID, Inject } from "@angular/core";

@Directive({
  selector: "img[appLazyLoad]",
  standalone: true,
})
export class LazyLoadDirective implements OnInit {
  constructor(
    private el: ElementRef<HTMLImageElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const img = this.el.nativeElement;

    // Set loading attribute for native lazy loading (fallback)
    img.loading = "lazy";

    // Use Intersection Observer for better lazy loading
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(img);
              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: "50px 0px", // Start loading 50px before the image enters the viewport
          threshold: 0.01,
        }
      );

      observer.observe(img);
    } else {
      // Fallback for browsers without Intersection Observer
      this.loadImage(img);
    }
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset["src"] || img.src;

    if (src && img.src !== src) {
      img.src = src;

      // Add loading class
      img.classList.add("loading");

      // Remove loading class when image loads
      img.addEventListener("load", () => {
        img.classList.remove("loading");
        img.classList.add("loaded");
      });

      // Handle load errors
      img.addEventListener("error", () => {
        img.classList.remove("loading");
        img.classList.add("error");
        console.warn(`Failed to load image: ${src}`);
      });
    }
  }
}
