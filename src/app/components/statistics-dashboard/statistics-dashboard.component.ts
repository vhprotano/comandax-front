import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  StatisticsService,
  StatisticCard,
  SalesByHour,
  TopProduct,
  OrderStatusCount,
  DailyRevenue,
} from "../../services/statistics.service";

@Component({
  selector: "app-statistics-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./statistics-dashboard.component.html",
  styleUrls: ["./statistics-dashboard.component.scss"],
})
export class StatisticsDashboardComponent implements OnInit, OnDestroy {
  statistics: StatisticCard[] = [];
  salesByHour: SalesByHour[] = [];
  topProducts: TopProduct[] = [];
  orderStatus: OrderStatusCount[] = [];
  dailyRevenue: DailyRevenue = {
    total: "0.00",
    average: "0.00",
    completedOrders: 0,
  };
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.loading = true;
    this.error = null;

    this.statisticsService
      .getStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.statistics = data.statistics;
          this.salesByHour = data.salesByHour;
          this.topProducts = data.topProducts;
          this.orderStatus = data.orderStatus;
          this.dailyRevenue = data.dailyRevenue;
          this.loading = false;
        },
        error: (err) => {
          console.error("Error loading statistics:", err);
          this.error =
            "Erro ao carregar estatísticas. Tente novamente mais tarde.";
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
