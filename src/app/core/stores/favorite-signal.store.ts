import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Recipe } from '../../models/recipe.model';

export interface Favorite {
  id: number;
  user_id: number;
  recipe_id: string;
  recipe_name: string;
  recipe_image: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class FavoriteSignalStore {
  private http = inject(HttpClient);
  favorites = signal<Favorite[]>([]);
  favoriteIds = computed(() => new Set(this.favorites().map((item) => item.recipe_id)));

  load() {
    return this.http.get<Favorite[]>(`${environment.apiUrl}/favorites`).pipe(tap((items) => this.favorites.set(items)));
  }

  add(recipe: Recipe) {
    return this.http.post(`${environment.apiUrl}/favorites`, recipe).pipe(tap(() => this.load().subscribe()));
  }

  remove(recipeId: string) {
    return this.http.delete(`${environment.apiUrl}/favorites/${recipeId}`).pipe(tap(() => this.favorites.update((items) => items.filter((item) => item.recipe_id !== recipeId))));
  }
}
