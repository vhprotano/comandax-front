import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmationDialog {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private dialogs$ = new BehaviorSubject<ConfirmationDialog[]>([]);

  getDialogs(): Observable<ConfirmationDialog[]> {
    return this.dialogs$.asObservable();
  }

  confirm(options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger' | 'success';
  }): Promise<boolean> {
    return new Promise((resolve) => {
      const id = `dialog-${Date.now()}`;
      const dialog: ConfirmationDialog = {
        id,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        type: options.type || 'info',
        onConfirm: () => {
          this.closeDialog(id);
          resolve(true);
        },
        onCancel: () => {
          this.closeDialog(id);
          resolve(false);
        },
      };

      const dialogs = this.dialogs$.value;
      this.dialogs$.next([...dialogs, dialog]);
    });
  }

  delete(title: string = 'Deletar item?', message: string = 'Esta ação não pode ser desfeita.'): Promise<boolean> {
    return this.confirm({
      title,
      message,
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      type: 'danger',
    });
  }

  warning(title: string, message: string): Promise<boolean> {
    return this.confirm({
      title,
      message,
      type: 'warning',
    });
  }

  success(title: string, message: string): Promise<boolean> {
    return this.confirm({
      title,
      message,
      type: 'success',
    });
  }

  info(title: string, message: string): Promise<boolean> {
    return this.confirm({
      title,
      message,
      type: 'info',
    });
  }

  closeDialog(id: string): void {
    const dialogs = this.dialogs$.value;
    this.dialogs$.next(dialogs.filter((d) => d.id !== id));
  }

  closeAll(): void {
    this.dialogs$.next([]);
  }
}

