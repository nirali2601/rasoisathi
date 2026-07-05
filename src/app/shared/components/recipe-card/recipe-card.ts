import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Recipe } from '../../../models/recipe.model';
import { getRecipeMeta } from '../../utils/recipe-meta.util';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="recipe-card">
      <div class="img-wrap">
        <img [src]="recipe().image" [alt]="recipe().name" loading="lazy"
             onerror="this.onerror=null;this.parentElement.classList.add('img-fallback')" />
        @if (showMatch()) {
          <span class="match-badge">{{ recipe().matchPercent }}% match</span>
        }
        <div class="img-overlay">
          <button mat-icon-button type="button" class="overlay-btn" [class.is-favorite]="isFavorite()"
                  (click)="favoriteClick.emit(recipe()); $event.stopPropagation()"
                  [disabled]="!canFavorite()"
                  [attr.aria-label]="isFavorite() ? 'Remove from favorites' : 'Add to favorites'">
            <mat-icon>{{ isFavorite() ? 'favorite' : 'favorite_border' }}</mat-icon>
          </button>
        </div>
      </div>
      <mat-card-content>
        <div class="card-top">
          <span class="cuisine-tag">{{ recipe().cuisine }}</span>
          <span class="rating"><mat-icon>star</mat-icon>{{ meta.rating }}</span>
        </div>
        <h3>{{ recipe().name }}</h3>
        <div class="meta-row">
          <span><mat-icon>schedule</mat-icon>{{ meta.cookingTime }} min</span>
          <span><mat-icon>bar_chart</mat-icon>{{ meta.difficulty }}</span>
          <span><mat-icon>local_fire_department</mat-icon>{{ meta.calories }} kcal</span>
        </div>
      </mat-card-content>
      <mat-card-actions class="card-actions">
        <a mat-flat-button color="primary" [routerLink]="['/recipes', recipe().id]">View Recipe</a>
        @if (showShare()) {
          <button mat-icon-button type="button" (click)="shareClick.emit(recipe())" aria-label="Share recipe">
            <mat-icon>share</mat-icon>
          </button>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .recipe-card {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg) !important;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform 0.28s ease, box-shadow 0.28s ease;
    }
    .recipe-card:hover {
      box-shadow: var(--shadow);
      transform: translateY(-6px);
    }
    .img-wrap {
      aspect-ratio: 4 / 3;
      background: linear-gradient(135deg, #ffe4d1, #ffd0e0);
      overflow: hidden;
      position: relative;
    }
    .img-wrap img {
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
      width: 100%;
    }
    .recipe-card:hover .img-wrap img { transform: scale(1.08); }
    .img-wrap.img-fallback img { display: none; }
    .match-badge {
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
      border-radius: 999px;
      color: #fff;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 5px 11px;
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .img-overlay {
      align-items: center;
      background: linear-gradient(to top, rgba(0,0,0,0.45), transparent);
      bottom: 0;
      display: flex;
      gap: 4px;
      justify-content: flex-end;
      left: 0;
      opacity: 0;
      padding: 10px;
      position: absolute;
      right: 0;
      transition: opacity 0.25s ease;
    }
    .recipe-card:hover .img-overlay { opacity: 1; }
    .overlay-btn {
      background: rgba(255, 255, 255, 0.92) !important;
      color: var(--text) !important;
    }
    .overlay-btn.is-favorite mat-icon { color: #e53935; }
    mat-card-content { display: grid; gap: 8px; padding: 16px 18px 8px !important; }
    .card-top { align-items: center; display: flex; justify-content: space-between; }
    .cuisine-tag {
      background: #fff1eb;
      border-radius: 999px;
      color: var(--primary);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
    }
    .rating {
      align-items: center;
      color: #f59e0b;
      display: inline-flex;
      font-size: 0.88rem;
      font-weight: 700;
      gap: 2px;
    }
    .rating mat-icon { font-size: 16px; height: 16px; width: 16px; }
    h3 {
      font-size: 1.02rem;
      line-height: 1.35;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .meta-row {
      color: var(--muted);
      display: flex;
      flex-wrap: wrap;
      font-size: 0.78rem;
      gap: 10px;
    }
    .meta-row span { align-items: center; display: inline-flex; gap: 3px; }
    .meta-row mat-icon { font-size: 14px; height: 14px; width: 14px; }
    .card-actions {
      align-items: center;
      display: flex;
      gap: 4px;
      padding: 4px 12px 14px !important;
    }
    .card-actions a { border-radius: 999px !important; flex: 1; }
  `]
})
export class RecipeCard {
  recipe = input.required<Recipe>();
  isFavorite = input(false);
  canFavorite = input(true);
  showMatch = input(true);
  showShare = input(true);

  favoriteClick = output<Recipe>();
  shareClick = output<Recipe>();

  get meta() {
    return getRecipeMeta(this.recipe().id);
  }
}
