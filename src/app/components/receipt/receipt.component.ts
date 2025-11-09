import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { Tab } from 'src/app/models';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent {
  @Input() tab!: Tab;
  @Output() close = new EventEmitter<void>();
  @Output() sendEmail = new EventEmitter<void>();
  @Output() finalize = new EventEmitter<{ orderId: string; paymentMethod: string }>();

  paymentMethod = 'dinheiro';
  paymentMethods = [
    { id: 'dinheiro', label: '💵 Dinheiro' },
    { id: 'cartao_credito', label: '💳 Cartão de Crédito' },
    { id: 'cartao_debito', label: '🏧 Cartão de Débito' },
    { id: 'pix', label: '📱 PIX' },
    { id: 'cheque', label: '📄 Cheque' },
  ];

  constructor(private notificationService: NotificationService) {}

  get subtotal(): number {
    return this.tab?.orders?.map(order => order.products.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)).reduce((sum, item) => sum + item, 0);
  }

  get tax(): number {
    return this.subtotal * 0.1; // 10% de imposto
  }

  get total(): number {
    return this.subtotal;
  }

  onClose(): void {
    this.close.emit();
  }

  onSendEmail(): void {
    this.sendEmail.emit();
    // Aqui você pode implementar a lógica de envio de e-mail
    this.notificationService.success('Recibo enviado por e-mail com sucesso!');
  }

  onFinalize(): void {
    this.finalize.emit({ orderId: this.tab.id, paymentMethod: this.paymentMethod });
  }
}

