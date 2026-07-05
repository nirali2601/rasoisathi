import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecipeSignalStore } from '../../core/stores/recipe-signal.store';
import { FavoriteSignalStore } from '../../core/stores/favorite-signal.store';
import { AuthSignalStore } from '../../core/stores/auth-signal.store';
import { SnackService } from '../../core/services/snack.service';
import { getRecipeMeta } from '../../shared/utils/recipe-meta.util';

@Component({
  selector: 'app-recipe-details',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <section class="page page-narrow">
      @if (!recipe()) {
        <div class="loader">
          <mat-spinner diameter="48" />
          <p>Loading recipe...</p>
        </div>
      } @else {
        <a mat-button class="back-btn" routerLink="/search"><mat-icon>arrow_back</mat-icon> Back to search</a>

        <div class="detail-hero">
          <div class="img-wrap">
            <img [src]="recipe()!.image" [alt]="recipe()!.name"
                 onerror="this.onerror=null;this.parentElement.classList.add('img-fallback')" />
          </div>
          <div class="detail-info">
            <span class="cuisine-badge">{{ recipe()!.cuisine }} &bull; {{ recipe()!.category }}</span>
            <h1>{{ recipe()!.name }}</h1>

            <div class="stats-row">
              <div class="stat-chip"><mat-icon>schedule</mat-icon><span>{{ meta.cookingTime }} min</span></div>
              <div class="stat-chip"><mat-icon>bar_chart</mat-icon><span>{{ meta.difficulty }}</span></div>
              <div class="stat-chip"><mat-icon>local_fire_department</mat-icon><span>{{ meta.calories }} kcal</span></div>
              <div class="stat-chip rating"><mat-icon>star</mat-icon><span>{{ meta.rating }}</span></div>
              <div class="stat-chip match"><mat-icon>percent</mat-icon><span>{{ recipe()!.matchPercent }}% match</span></div>
            </div>

            <div class="quick-actions">
              <button mat-flat-button color="primary" (click)="toggleFavorite()" [disabled]="!auth.isLoggedIn()">
                <mat-icon>{{ isFavorite() ? 'bookmark' : 'bookmark_border' }}</mat-icon>
                {{ isFavorite() ? 'Saved' : 'Save Recipe' }}
              </button>
              <button mat-stroked-button (click)="share()"><mat-icon>share</mat-icon> Share</button>
            </div>
          </div>
        </div>

        <div class="detail-grid">
          <mat-card class="panel">
            <h2><mat-icon>shopping_basket</mat-icon> Ingredients</h2>
            <div class="ingredients">
              @for (item of recipe()!.ingredients; track item.ingredient) {
                <div class="ingredient-item">
                  <mat-icon>check_circle</mat-icon>
                  <span>{{ item.measure }} {{ item.ingredient }}</span>
                </div>
              }
            </div>
          </mat-card>

          <mat-card class="panel instructions">
            <h2><mat-icon>menu_book</mat-icon> Instructions</h2>
            <p>{{ recipe()!.instructions }}</p>
          </mat-card>
        </div>
      }
    </section>
  `,
  styles: [`
    .loader { align-items: center; display: flex; flex-direction: column; gap: 16px; padding: 80px; }
    .loader p { color: var(--muted); margin: 0; }
    .back-btn { margin-bottom: 16px; }
    .detail-hero { display: grid; gap: 32px; grid-template-columns: minmax(280px, 1fr) 1.2fr; margin-bottom: 28px; }
    .img-wrap {
      aspect-ratio: 4 / 3;
      background: linear-gradient(135deg, #ffe4d1, #ffd0e0);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .img-wrap img { height: 100%; object-fit: cover; width: 100%; }
    .img-wrap.img-fallback img { display: none; }
    .cuisine-badge {
      background: #fff1eb;
      border-radius: 999px;
      color: var(--primary);
      display: inline-block;
      font-size: 0.82rem;
      font-weight: 700;
      margin-bottom: 10px;
      padding: 6px 14px;
    }
    .detail-info h1 { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800; line-height: 1.15; margin: 0 0 16px; }
    .stats-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
    .stat-chip {
      align-items: center;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 999px;
      display: inline-flex;
      font-size: 0.85rem;
      font-weight: 600;
      gap: 4px;
      padding: 8px 14px;
    }
    .stat-chip mat-icon { color: var(--primary); font-size: 18px; height: 18px; width: 18px; }
    .stat-chip.rating mat-icon { color: #f59e0b; }
    .stat-chip.match { background: #ecfff4; border-color: #b7f0cc; color: #168347; }
    .stat-chip.match mat-icon { color: #168347; }
    .quick-actions { display: flex; flex-wrap: wrap; gap: 10px; }
    .detail-grid { display: grid; gap: 24px; }
    .panel h2 { align-items: center; display: flex; font-size: 1.15rem; gap: 8px; margin: 0 0 18px; }
    .panel h2 mat-icon { color: var(--primary); }
    .ingredients { display: grid; gap: 10px; }
    .ingredient-item {
      align-items: center;
      background: #faf8f6;
      border-radius: var(--radius);
      display: flex;
      font-size: 0.94rem;
      gap: 10px;
      padding: 12px 14px;
    }
    .ingredient-item mat-icon { color: var(--secondary); font-size: 20px; height: 20px; width: 20px; }
    .instructions p { color: var(--text); line-height: 1.85; margin: 0; white-space: pre-line; }
    @media (max-width: 800px) { .detail-hero { grid-template-columns: 1fr; } }
  `]
})
export class RecipeDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(RecipeSignalStore);
  fav = inject(FavoriteSignalStore);
  auth = inject(AuthSignalStore);
  private snack = inject(SnackService);
  recipe = signal<import('../../models/recipe.model').Recipe | null>(null);

  get meta() {
    const id = this.recipe()?.id ?? '';
    return getRecipeMeta(id);
  }

  ngOnInit(): void {
    this.store.getRecipe(this.route.snapshot.paramMap.get('id') || '').subscribe((recipe) => this.recipe.set(recipe));
    if (this.auth.isLoggedIn() && this.fav.favorites().length === 0) this.fav.load().subscribe();
  }

  isFavorite(): boolean {
    const id = this.recipe()?.id;
    return !!id && this.fav.favoriteIds().has(id);
  }

  toggleFavorite(): void {
    const recipe = this.recipe();
    if (!recipe) return;
    if (!this.auth.isLoggedIn()) { this.snack.show('Login to save favorites'); return; }
    if (this.isFavorite()) this.fav.remove(recipe.id).subscribe(() => this.snack.show('Removed from favorites'));
    else this.fav.add(recipe).subscribe(() => this.snack.show('Saved to favorites'));
  }

  share(): void {
    const recipe = this.recipe();
    if (!recipe) return;
    const url = location.href;
    if (navigator.share) {
      navigator.share({ title: recipe.name, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => this.snack.show('Link copied to clipboard'));
    } else {
      this.snack.show(url);
    }
  }
}
