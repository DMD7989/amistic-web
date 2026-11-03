import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
}

// Notifications et boîte de confirmation partagées par toutes les pages d'administration
// (affichées par admin-shell.ts)
@Injectable({ providedIn: 'root' })
export class AdminUi {
  readonly toastMessage = signal<{ text: string; error: boolean } | null>(null);
  readonly confirmState = signal<ConfirmOptions | null>(null);

  private toastTimer?: ReturnType<typeof setTimeout>;
  private resolver?: (answer: boolean) => void;

  toast(text: string, error = false) {
    clearTimeout(this.toastTimer);
    this.toastMessage.set({ text, error });
    this.toastTimer = setTimeout(() => this.toastMessage.set(null), error ? 6000 : 3500);
  }

  confirm(options: ConfirmOptions): Promise<boolean> {
    this.resolver?.(false);
    this.confirmState.set(options);
    return new Promise((resolve) => (this.resolver = resolve));
  }

  answer(answer: boolean) {
    this.confirmState.set(null);
    this.resolver?.(answer);
    this.resolver = undefined;
  }
}
