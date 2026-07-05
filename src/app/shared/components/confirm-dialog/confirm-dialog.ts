import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      @if (data.icon) {
        <div class="icon-wrap"><mat-icon>{{ data.icon }}</mat-icon></div>
      }
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content><p>{{ data.message }}</p></mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button (click)="ref.close(false)">{{ data.cancelLabel || 'Cancel' }}</button>
        <button mat-flat-button color="warn" (click)="ref.close(true)">{{ data.confirmLabel || 'Confirm' }}</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog { padding: 8px 4px 0; }
    .icon-wrap {
      align-items: center;
      background: #fff1eb;
      border-radius: 50%;
      display: flex;
      height: 52px;
      justify-content: center;
      margin: 0 auto 8px;
      width: 52px;
    }
    .icon-wrap mat-icon { color: var(--primary); }
    h2 { font-size: 1.2rem; margin: 0; text-align: center; }
    p { color: var(--muted); line-height: 1.5; margin: 0; text-align: center; }
    mat-dialog-actions { gap: 8px; padding-top: 16px; }
  `]
})
export class ConfirmDialog {
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  ref = inject(MatDialogRef<ConfirmDialog, boolean>);
}
