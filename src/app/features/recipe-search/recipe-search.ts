import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RecipeSignalStore } from '../../core/stores/recipe-signal.store';
import { FavoriteSignalStore } from '../../core/stores/favorite-signal.store';
import { AuthSignalStore } from '../../core/stores/auth-signal.store';
import { SnackService } from '../../core/services/snack.service';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { RecipeCardSkeleton } from '../../shared/components/recipe-card-skeleton/recipe-card-skeleton';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-search',
  imports: [
    ReactiveFormsModule, MatButtonModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatSelectModule, RecipeCard, RecipeCardSkeleton, EmptyState
  ],
  template: `
    <section class="page page-narrow">
      <div class="page-header">
        <h1 class="section-title">Recipe Search</h1>
        <p class="section-subtitle">Find the perfect dish using ingredients, cuisine, or recipe name.</p>
      </div>

      <form class="panel search-panel" [formGroup]="form" (ngSubmit)="search()">
        <mat-form-field appearance="outline">
          <mat-label>Search text</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input matInput formControlName="query" placeholder="tomato, onion, paneer" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Mode</mat-label>
          <mat-select formControlName="mode">
            <mat-option value="ingredients">Ingredients</mat-option>
            <mat-option value="name">Recipe Name</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Cuisine</mat-label>
          <mat-select formControlName="cuisine">
            <mat-option value="">Any</mat-option>
            @for (item of store.cuisines(); track item) { <mat-option [value]="item">{{ item }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option value="">Any</mat-option>
            @for (item of store.categories(); track item) { <mat-option [value]="item">{{ item }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" [disabled]="store.loading()">
          <mat-icon>search</mat-icon> Search
        </button>
      </form>

      @if (store.loading()) {
        <div class="grid results">
          @for (i of skeletonRows; track i) { <app-recipe-card-skeleton /> }
        </div>
      } @else if (store.recipes().length === 0) {
        <app-empty-state
          icon="search_off"
          title="No recipes found"
          description='Try "tomato, onion" or choose a cuisine above to discover delicious meals.'
          actionLabel="Browse All"
          actionLink="/search" />
      } @else {
        <p class="results-count">{{ store.recipes().length }} recipes found</p>
        <div class="grid results">
          @for (recipe of store.recipes(); track recipe.id) {
            <app-recipe-card
              [recipe]="recipe"
              [isFavorite]="fav.favoriteIds().has(recipe.id)"
              [canFavorite]="auth.isLoggedIn()"
              (favoriteClick)="toggleFavorite($event)"
              (shareClick)="share($event)" />
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .page-header { margin-bottom: 8px; }
    .search-panel {
      align-items: start;
      display: grid;
      gap: 14px;
      grid-template-columns: 2fr 1fr 1fr 1fr auto;
      margin-bottom: 8px;
    }
    .results { margin-top: 8px; }
    .results-count { color: var(--muted); font-size: 0.92rem; margin: 20px 0 0; }
    @media (max-width: 980px) {
      .search-panel { grid-template-columns: 1fr 1fr; }
      .search-panel button { grid-column: 1 / -1; }
    }
    @media (max-width: 620px) { .search-panel { grid-template-columns: 1fr; } }
  `]
})
export class RecipeSearch implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  store = inject(RecipeSignalStore);
  fav = inject(FavoriteSignalStore);
  auth = inject(AuthSignalStore);
  private snack = inject(SnackService);
  private lastSavedHistoryKey = '';
  form = this.fb.nonNullable.group({ query: ['tomato,onion'], mode: ['ingredients' as 'ingredients' | 'name'], cuisine: [''], category: [''] });
  skeletonRows = Array.from({ length: 6 }, (_, i) => i);

  ngOnInit(): void {
    this.store.loadFilters();
    if (this.auth.isLoggedIn()) this.fav.load().subscribe();
    this.route.queryParamMap.subscribe((params) => {
      this.form.patchValue({ query: params.get('q') || this.form.value.query || '', cuisine: params.get('cuisine') || '', category: params.get('category') || '' });
      if (params.keys.length) this.search();
    });
  }

  search(): void {
    const request = this.form.getRawValue();
    const historyText = [request.query, request.category, request.cuisine].filter(Boolean).join(' • ');
    const historyKey = `${request.mode}:${historyText.toLowerCase()}`;
    const shouldSaveHistory = this.auth.isLoggedIn() && !!historyText && historyKey !== this.lastSavedHistoryKey;

    this.store.search(request).subscribe({
      next: () => {
        if (shouldSaveHistory) {
          this.store.saveHistory(historyText).subscribe({
            next: () => this.lastSavedHistoryKey = historyKey,
            error: () => this.lastSavedHistoryKey = historyKey
          });
        }
      }
    });
  }

  toggleFavorite(recipe: Recipe): void {
    if (!this.auth.isLoggedIn()) { this.snack.show('Login to save favorites'); return; }
    if (this.fav.favoriteIds().has(recipe.id)) this.fav.remove(recipe.id).subscribe(() => this.snack.show('Removed from favorites'));
    else this.fav.add(recipe).subscribe(() => this.snack.show('Saved to favorites'));
  }

  share(recipe: Recipe): void {
    const url = `${location.origin}/recipes/${recipe.id}`;
    if (navigator.share) {
      navigator.share({ title: recipe.name, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => this.snack.show('Link copied to clipboard'));
    } else {
      this.snack.show(url);
    }
  }
}
