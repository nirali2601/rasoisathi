import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div class="empty-state">
      <div class="empty-icon-wrap">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <h3>{{ title() }}</h3>
      <p>{{ description() }}</p>
      @if (actionLabel() && actionLink()) {
        <a mat-flat-button color="primary" [routerLink]="actionLink()">{{ actionLabel() }}</a>
      }
      <ng-content />
    </div>
  `,
  styles: [`
    .empty-state {
      align-items: center;
      background: var(--surface);
      border: 1px dashed var(--border);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      padding: clamp(40px, 6vw, 72px) 24px;
      text-align: center;
    }
    .empty-icon-wrap {
      align-items: center;
      background: linear-gradient(135deg, #fff1eb, #ffe0cc);
      border-radius: 50%;
      display: flex;
      height: 88px;
      justify-content: center;
      margin-bottom: 16px;
      width: 88px;
    }
    .empty-icon-wrap mat-icon {
      color: var(--primary);
      font-size: 42px;
      height: 42px;
      opacity: 0.85;
      width: 42px;
    }
    h3 { font-size: 1.25rem; margin: 0 0 6px; }
    p { color: var(--muted); margin: 0 0 20px; max-width: 420px; }
  `]
})
export class EmptyState {
  icon = input('inbox');
  title = input('Nothing here yet');
  description = input('');
  actionLabel = input('');
  actionLink = input('');
}
