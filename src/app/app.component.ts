import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NotificationContainerComponent } from "./components/notification-container/notification-container.component";
import { PerformanceService } from "./services/performance.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NotificationContainerComponent],
  template: `
    <app-notification-container></app-notification-container>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  title = "ComandaX";

  constructor(private performanceService: PerformanceService) {}

  ngOnInit(): void {
    // Initialize performance optimizations
    this.performanceService.init();
  }
}
