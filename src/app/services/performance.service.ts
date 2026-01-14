import { Injectable } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID, Inject } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PerformanceService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Lazy load images with Intersection Observer
   */
  lazyLoadImages(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const images = document.querySelectorAll("img[data-src]");

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset["src"]!;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback for browsers without Intersection Observer
      images.forEach((img) => {
        const htmlImg = img as HTMLImageElement;
        htmlImg.src = htmlImg.dataset["src"]!;
      });
    }
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Preload critical fonts
    this.preloadFont(
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
    );
    this.preloadFont(
      "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap"
    );

    // Preload critical images
    this.preloadImage("/assets/logo/logo.png");
    this.preloadImage("/assets/og-image.png");
  }

  /**
   * Preload a font
   */
  private preloadFont(href: string): void {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = "style";
    link.onload = () => {
      link.rel = "stylesheet";
    };
    document.head.appendChild(link);
  }

  /**
   * Preload an image
   */
  private preloadImage(src: string): void {
    const img = new Image();
    img.src = src;
  }

  /**
   * Defer non-critical JavaScript
   */
  deferNonCriticalJS(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Defer loading of non-critical scripts
    const scripts = document.querySelectorAll("script[data-defer]");

    scripts.forEach((script) => {
      const newScript = document.createElement("script");
      newScript.src = script.getAttribute("src")!;
      newScript.defer = true;

      // Copy other attributes
      Array.from(script.attributes).forEach((attr) => {
        if (attr.name !== "data-defer") {
          newScript.setAttribute(attr.name, attr.value);
        }
      });

      script.parentNode?.replaceChild(newScript, script);
    });
  }

  /**
   * Optimize Core Web Vitals
   */
  optimizeCoreWebVitals(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Reduce Cumulative Layout Shift (CLS)
    this.preventLayoutShift();

    // Optimize Largest Contentful Paint (LCP)
    this.optimizeLCP();

    // Improve First Input Delay (FID)
    this.optimizeFID();
  }

  /**
   * Prevent layout shift by reserving space for images
   */
  private preventLayoutShift(): void {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
      if (!img.hasAttribute("width") || !img.hasAttribute("height")) {
        // Set default aspect ratio if dimensions not specified
        img.style.aspectRatio = "16/9";
        img.style.width = "100%";
        img.style.height = "auto";
      }
    });
  }

  /**
   * Optimize Largest Contentful Paint
   */
  private optimizeLCP(): void {
    // Prioritize loading of above-the-fold content
    const heroImage = document.querySelector(".hero img");
    if (heroImage) {
      heroImage.setAttribute("fetchpriority", "high");
    }

    // Preload critical CSS
    const criticalCSS = document.querySelector('link[rel="stylesheet"]');
    if (criticalCSS) {
      criticalCSS.setAttribute("fetchpriority", "high");
    }
  }

  /**
   * Optimize First Input Delay
   */
  private optimizeFID(): void {
    // Break up long tasks
    this.breakUpLongTasks();

    // Use passive event listeners where possible
    this.addPassiveListeners();
  }

  /**
   * Break up long JavaScript tasks
   */
  private breakUpLongTasks(): void {
    // Yield control to the browser periodically
    const yieldToMain = () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    };

    // Use this in long-running functions
    (window as any).yieldToMain = yieldToMain;
  }

  /**
   * Add passive event listeners for better scroll performance
   */
  private addPassiveListeners(): void {
    // Add passive listeners to scroll events
    const addPassiveListener = (
      element: Element,
      event: string,
      handler: EventListener
    ) => {
      element.addEventListener(event, handler, { passive: true });
    };

    // Apply to common scroll elements
    document.querySelectorAll("[data-scroll]").forEach((element) => {
      addPassiveListener(element, "scroll", () => {});
    });
  }

  /**
   * Monitor performance metrics
   */
  monitorPerformance(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Monitor custom metrics
    this.monitorCustomMetrics();
  }

  /**
   * Monitor custom performance metrics
   */
  private monitorCustomMetrics(): void {
    // Time to interactive
    window.addEventListener("load", () => {
      const timing = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const timeToInteractive = timing.domInteractive - timing.fetchStart;

      console.log("Time to Interactive:", timeToInteractive, "ms");

      // Send to analytics if available
      if ((window as any).gtag) {
        (window as any).gtag("event", "timing_complete", {
          name: "time_to_interactive",
          value: timeToInteractive,
          event_category: "performance",
        });
      }
    });
  }

  /**
   * Initialize all performance optimizations
   */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Initialize all optimizations
    this.preloadCriticalResources();
    this.lazyLoadImages();
    this.deferNonCriticalJS();
    this.optimizeCoreWebVitals();
    this.monitorPerformance();

    console.log("[Performance Service] Initialized");
  }
}
