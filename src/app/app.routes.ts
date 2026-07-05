import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  { path: 'login', loadComponent: () => import('./features/auth/login').then((m) => m.Login) },
  { path: 'register', loadComponent: () => import('./features/auth/register').then((m) => m.Register) },
  { path: 'search', loadComponent: () => import('./features/recipe-search/recipe-search').then((m) => m.RecipeSearch) },
  { path: 'chat', loadComponent: () => import('./features/chat/chat').then((m) => m.Chat) },
  { path: 'recipes/:id', loadComponent: () => import('./features/recipe-details/recipe-details').then((m) => m.RecipeDetails) },
  { path: 'favorites', canActivate: [authGuard], loadComponent: () => import('./features/favorites/favorites').then((m) => m.Favorites) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./features/profile/profile').then((m) => m.Profile) },
  { path: '**', loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound) }
];
