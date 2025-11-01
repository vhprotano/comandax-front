import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../services/data.service';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent {
  @Input() order!: Order;
  @Output() close = new EventEmitter<void>();
  @Output() print = new EventEmitter<void>();
  @Output() finalize = new EventEmitter<{ orderId: string; paymentMethod: string }>();

  paymentMethod = 'dinheiro';
  paymentMethods = [
    { id: 'dinheiro', label: '💵 Dinheiro' },
    { id: 'cartao_credito', label: '💳 Cartão de Crédito' },
    { id: 'cartao_debito', label: '🏧 Cartão de Débito' },
    { id: 'pix', label: '📱 PIX' },
    { id: 'cheque', label: '📄 Cheque' },
  ];

  get subtotal(): number {
    return this.order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  }

  get tax(): number {
    return this.subtotal * 0.1; // 10% de imposto
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  onClose(): void {
    this.close.emit();
  }

  onPrint(): void {
    this.print.emit();
    window.print();
  }

  onFinalize(): void {
    this.finalize.emit({ orderId: this.order.id, paymentMethod: this.paymentMethod });
  }
}

