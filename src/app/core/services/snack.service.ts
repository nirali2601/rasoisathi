import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackService {
  private snackBar = inject(MatSnackBar);

  show(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3200, horizontalPosition: 'right', verticalPosition: 'top' });
  }
}
