import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

// ==================== GRAPHQL QUERIES ====================

const GET_STATISTICS_DATA = gql`
  query GetStatisticsData {
    customerTabs {
      id
      name
      status
      orders {
        id
        status
        products {
          productId
          quantity
          totalPrice
          product {
            id
            name
            price
          }
        }
      }
    }
    orders {
      id
      status
      customerTabId
      products {
        productId
        quantity
        totalPrice
        product {
          id
          name
          price
        }
      }
    }
  }
`;

// ==================== INTERFACES ====================

export interface StatisticCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

export interface SalesByHour {
  time: string;
  value: number;
  percentage: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

export interface OrderStatusCount {
  label: string;
  count: number;
  icon: string;
  colorClass: string;
}

export interface DailyRevenue {
  total: string;
  average: string;
  completedOrders: number;
}

export interface StatisticsData {
  statistics: StatisticCard[];
  salesByHour: SalesByHour[];
  topProducts: TopProduct[];
  orderStatus: OrderStatusCount[];
  dailyRevenue: DailyRevenue;
}

// ==================== SERVICE ====================

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private apollo: Apollo) {}

  getStatistics(): Observable<StatisticsData> {
    return this.apollo
      .watchQuery<any>({
        query: GET_STATISTICS_DATA,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result) => {
          const tabs = result.data?.customerTabs || [];
          const orders = result.data?.orders || [];
          
          return this.calculateStatistics(tabs, orders);
        })
      );
  }

  private calculateStatistics(tabs: any[], orders: any[]): StatisticsData {
    // Calculate closed tabs and revenue
    const closedTabs = tabs.filter((t) => t.status === 'CLOSED');
    const openTabs = tabs.filter((t) => t.status === 'OPEN');
    
    // Calculate total revenue from closed tabs
    const totalRevenue = closedTabs.reduce((sum, tab) => {
      const tabTotal = tab.orders?.reduce((orderSum: number, order: any) => {
        const orderTotal = order.products?.reduce((prodSum: number, p: any) => 
          prodSum + (p.totalPrice || 0), 0) || 0;
        return orderSum + orderTotal;
      }, 0) || 0;
      return sum + tabTotal;
    }, 0);

    // Calculate average order value
    const averageOrder = closedTabs.length > 0 ? totalRevenue / closedTabs.length : 0;

    // Count orders by status
    const openOrdersCount = orders.filter((o) => o.status === 'OPEN').length;
    const closedOrdersCount = orders.filter((o) => o.status === 'CLOSED').length;

    // Statistics cards
    const statistics: StatisticCard[] = [
      {
        title: 'Total de Comandas',
        value: tabs.length,
        icon: '📋',
        color: 'blue',
      },
      {
        title: 'Receita Total',
        value: `R$ ${totalRevenue.toFixed(2)}`,
        icon: '💰',
        color: 'green',
      },
      {
        title: 'Ticket Médio',
        value: `R$ ${averageOrder.toFixed(2)}`,
        icon: '📊',
        color: 'purple',
      },
      {
        title: 'Comandas Fechadas',
        value: closedTabs.length,
        icon: '✅',
        color: 'green',
      },
    ];

    // Calculate top products
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    tabs.forEach((tab) => {
      tab.orders?.forEach((order: any) => {
        order.products?.forEach((p: any) => {
          const productId = p.productId;
          const existing = productMap.get(productId);
          
          if (existing) {
            existing.quantity += p.quantity;
            existing.revenue += p.totalPrice || 0;
          } else {
            productMap.set(productId, {
              name: p.product?.name || 'Produto',
              quantity: p.quantity,
              revenue: p.totalPrice || 0,
            });
          }
        });
      });
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Sales by hour (simulated for now - would need timestamp data from backend)
    const salesByHour: SalesByHour[] = this.generateSalesByHour(totalRevenue);

    // Order status counts
    const orderStatus: OrderStatusCount[] = [
      {
        label: 'Comandas Abertas',
        count: openTabs.length,
        icon: '📝',
        colorClass: 'text-blue-600',
      },
      {
        label: 'Pedidos Abertos',
        count: openOrdersCount,
        icon: '📤',
        colorClass: 'text-yellow-600',
      },
      {
        label: 'Pedidos Fechados',
        count: closedOrdersCount,
        icon: '✅',
        colorClass: 'text-green-600',
      },
      {
        label: 'Comandas Fechadas',
        count: closedTabs.length,
        icon: '🎉',
        colorClass: 'text-purple-600',
      },
    ];

    // Daily revenue
    const dailyRevenue: DailyRevenue = {
      total: totalRevenue.toFixed(2),
      average: averageOrder.toFixed(2),
      completedOrders: closedTabs.length,
    };

    return {
      statistics,
      salesByHour,
      topProducts,
      orderStatus,
      dailyRevenue,
    };
  }

  private generateSalesByHour(totalRevenue: number): SalesByHour[] {
    // This is a simplified version - ideally would use actual timestamp data
    const hours = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    const maxValue = totalRevenue / 4; // Distribute across hours
    
    return hours.map((time, index) => {
      const value = Math.random() * maxValue;
      const percentage = (value / maxValue) * 100;
      
      return {
        time,
        value: parseFloat(value.toFixed(2)),
        percentage: Math.min(100, percentage),
      };
    });
  }
}

