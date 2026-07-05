import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <section class="page not-found">
      <div class="error-visual">
        <div class="plate" aria-hidden="true">
          <mat-icon>ramen_dining</mat-icon>
        </div>
        <span class="code">404</span>
      </div>
      <h1>Looks like this recipe got eaten</h1>
      <p>The page you're looking for doesn't exist or may have been moved.</p>
      <div class="actions">
        <a mat-flat-button color="primary" routerLink="/"><mat-icon>home</mat-icon> Go Home</a>
        <a mat-stroked-button routerLink="/search"><mat-icon>search</mat-icon> Browse Recipes</a>
      </div>
    </section>
  `,
  styles: [`
    .not-found {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: calc(100vh - 200px);
      padding: 60px 24px;
      text-align: center;
    }
    .error-visual { margin-bottom: 16px; position: relative; }
    .plate {
      align-items: center;
      animation: float 3s ease-in-out infinite;
      background: linear-gradient(135deg, #fff1eb, #ffe0cc);
      border-radius: 50%;
      box-shadow: var(--shadow);
      display: flex;
      height: 120px;
      justify-content: center;
      margin: 0 auto;
      width: 120px;
    }
    .plate mat-icon { color: var(--primary); font-size: 56px; height: 56px; width: 56px; }
    .code {
      color: var(--primary);
      font-size: 5rem;
      font-weight: 800;
      left: 50%;
      line-height: 1;
      opacity: 0.15;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .not-found h1 { font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 800; margin: 0 0 8px; }
    .not-found p { color: var(--muted); margin: 0 0 28px; max-width: 400px; }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
  `]
})
export class NotFound {}
