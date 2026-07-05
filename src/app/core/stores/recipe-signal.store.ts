import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Recipe, SearchRequest } from '../../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeSignalStore {
  private http = inject(HttpClient);
  recipes = signal<Recipe[]>([]);
  categories = signal<string[]>([]);
  cuisines = signal<string[]>([]);
  loading = signal(false);
  lastQuery = signal('');

  search(request: SearchRequest) {
    this.loading.set(true);
    this.lastQuery.set(request.query || request.category || request.cuisine || 'all recipes');
    return this.http.post<{ query: string; recipes: Recipe[] }>(`${environment.apiUrl}/recipes/search`, request).pipe(
      tap((res) => this.recipes.set(res.recipes)),
      finalize(() => this.loading.set(false))
    );
  }

  getRecipe(id: string) {
    return this.http.get<Recipe>(`${environment.apiUrl}/recipes/${id}`);
  }

  loadFilters(): void {
    this.http.get<string[]>(`${environment.apiUrl}/recipes/categories`).subscribe((items) => this.categories.set(items));
    this.http.get<string[]>(`${environment.apiUrl}/recipes/cuisines`).subscribe((items) => this.cuisines.set(items));
  }

  saveHistory(query: string) {
    return this.http.post(`${environment.apiUrl}/history`, { search_query: query });
  }
}
