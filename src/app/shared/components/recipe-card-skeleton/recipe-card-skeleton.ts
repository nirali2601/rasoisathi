import { Component } from '@angular/core';

@Component({
  selector: 'app-recipe-card-skeleton',
  template: `
    <div class="skeleton-card">
      <div class="skeleton shimmer img-skeleton"></div>
      <div class="skeleton-body">
        <div class="skeleton shimmer line w-30"></div>
        <div class="skeleton shimmer line w-80"></div>
        <div class="skeleton shimmer line w-60"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .skeleton-body { display: grid; gap: 10px; padding: 16px; }
    .skeleton { background: #eee; border-radius: 6px; }
    .img-skeleton { aspect-ratio: 4 / 3; border-radius: 0; }
    .line { height: 14px; }
    .w-30 { width: 30%; }
    .w-60 { width: 60%; }
    .w-80 { width: 80%; }
    .shimmer { overflow: hidden; position: relative; }
    .shimmer::after {
      animation: shimmer 1.3s infinite;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
      content: '';
      inset: 0;
      position: absolute;
      transform: translateX(-100%);
    }
    @keyframes shimmer { 100% { transform: translateX(100%); } }
  `]
})
export class RecipeCardSkeleton {}
