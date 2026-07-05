import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialog, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private dialog = inject(MatDialog);

  async confirm(data: ConfirmDialogData): Promise<boolean> {
    const ref = this.dialog.open(ConfirmDialog, {
      data,
      width: '400px',
      panelClass: 'premium-dialog'
    });
    return firstValueFrom(ref.afterClosed()).then((result) => !!result);
  }
}
