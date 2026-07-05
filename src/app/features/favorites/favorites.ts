import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FavoriteSignalStore } from '../../core/stores/favorite-signal.store';
import { SnackService } from '../../core/services/snack.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { IstDatePipe } from '../../shared/pipes/ist-date.pipe';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-favorites',
  imports: [IstDatePipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule, EmptyState],
  template: `
    <section class="page page-narrow">
      <div class="page-header">
        <h1 class="section-title">Favorite Recipes</h1>
        <p class="section-subtitle">Every dish you have bookmarked, ready for your next cooking session.</p>
      </div>

      @if (fav.favorites().length === 0) {
        <app-empty-state
          icon="favorite_border"
          title="No favorites saved yet"
          description="Browse recipes and tap the bookmark icon to save them here."
          actionLabel="Explore Recipes"
          actionLink="/search" />
      } @else {
        <div class="grid">
          @for (item of fav.favorites(); track item.recipe_id) {
            <mat-card class="fav-card">
              <div class="img-wrap">
                <img [src]="item.recipe_image" [alt]="item.recipe_name" loading="lazy"
                     onerror="this.onerror=null;this.parentElement.classList.add('img-fallback')" />
                <button mat-icon-button class="remove-btn" (click)="remove(item.recipe_id)" aria-label="Remove favorite">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              <mat-card-content>
                <h3>{{ item.recipe_name }}</h3>
                <span class="meta ist-date">Saved {{ item.created_at | istDate }}</span>
              </mat-card-content>
              <mat-card-actions>
                <a mat-flat-button color="primary" [routerLink]="['/recipes', item.recipe_id]">
                  <mat-icon>restaurant</mat-icon> Open Recipe
                </a>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .page-header { margin-bottom: 8px; }
    .fav-card {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg) !important;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .fav-card:hover { box-shadow: var(--shadow); transform: translateY(-4px); }
    .img-wrap { aspect-ratio: 4 / 3; background: linear-gradient(135deg, #ffe4d1, #ffd0e0); overflow: hidden; position: relative; }
    .img-wrap img { height: 100%; object-fit: cover; transition: transform 0.35s ease; width: 100%; }
    .fav-card:hover .img-wrap img { transform: scale(1.06); }
    .img-wrap.img-fallback img { display: none; }
    .remove-btn {
      background: rgba(255,255,255,0.9) !important;
      position: absolute !important;
      right: 8px;
      top: 8px;
    }
    h3 { font-size: 1.05rem; margin: 0 0 6px; }
    mat-card-content { padding: 16px 18px 8px !important; }
    mat-card-actions { padding: 4px 12px 16px !important; }
    mat-card-actions a { border-radius: 999px !important; width: 100%; }
  `]
})
export class Favorites implements OnInit {
  fav = inject(FavoriteSignalStore);
  private snack = inject(SnackService);
  private confirm = inject(ConfirmService);

  ngOnInit(): void { this.fav.load().subscribe(); }

  async remove(id: string): Promise<void> {
    const ok = await this.confirm.confirm({
      title: 'Remove Favorite?',
      message: 'This recipe will be removed from your favorites list.',
      confirmLabel: 'Remove',
      icon: 'delete_outline'
    });
    if (ok) this.fav.remove(id).subscribe(() => this.snack.show('Favorite removed'));
  }
}
