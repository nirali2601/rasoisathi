import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RecipeSignalStore } from '../../core/stores/recipe-signal.store';

interface Category { name: string; image: string; query: string; }
interface Feature { icon: string; title: string; text: string; }

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  template: `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg" aria-hidden="true">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80" alt="" />
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <p class="eyebrow"><mat-icon>auto_awesome</mat-icon> Smart Recipe Discovery</p>
        <h1>Cook Something<br /><span class="gradient-text">Extraordinary</span> Tonight</h1>
        <p class="hero-text">RasoiSathi transforms your pantry into personalized recipes — search by ingredients, chat with our chef, and save favorites for your next meal.</p>

        <form class="hero-search glass-panel" [formGroup]="form" (ngSubmit)="goSearch()">
          <div class="search-input-wrapper">
            <mat-icon class="search-icon">search</mat-icon>
            <input type="text" formControlName="query" placeholder="tomato, onion, paneer..." aria-label="What's in your kitchen?" />
          </div>
          <button mat-flat-button color="primary" type="submit">
            <mat-icon>restaurant</mat-icon> <span>Explore Recipes</span>
          </button>
        </form>
        
        <div class="hero-actions">
          <a mat-flat-button color="primary" routerLink="/search">
            <mat-icon>search</mat-icon> <span>Explore Recipes</span>
          </a>
          <a mat-stroked-button routerLink="/search"><mat-icon>tune</mat-icon> <span>Advanced Search</span></a>
          <button mat-stroked-button type="button" [disabled]="randomLoading()" (click)="surpriseMe()">
            <mat-icon>casino</mat-icon> <span>Surprise Me</span>
          </button>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="page page-narrow">
      <div class="section-header">
        <h2 class="section-title">Featured Categories</h2>
        <p class="section-subtitle">Explore cuisines from around the world — one click away.</p>
      </div>
      <div class="category-grid">
        @for (cat of categories; track cat.name) {
          <a class="category-card" (click)="openCategory(cat)" tabindex="0" (keyup.enter)="openCategory(cat)">
            <img [src]="cat.image" [alt]="cat.name" loading="lazy" onerror="this.style.display='none'" />
            <div class="category-overlay"></div>
            <span class="category-name">{{ cat.name }}</span>
            <mat-icon class="category-arrow">arrow_forward</mat-icon>
          </a>
        }
      </div>
    </section>

    <!-- SMART FEATURES -->
    <section class="page page-narrow features-section">
      <div class="section-header center">
        <h2 class="section-title">Smart Features</h2>
        <p class="section-subtitle">Smart tools that make cooking effortless and fun.</p>
      </div>
      <div class="feature-grid">
        @for (f of features; track f.title) {
          <div class="feature-card glass-panel">
            <div class="feature-icon">{{ f.icon }}</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.text }}</p>
          </div>
        }
      </div>
    </section>

    <!-- WHY CHOOSE -->
    <section class="page page-narrow why-section">
      <div class="section-header center">
        <h2 class="section-title">Why Choose RasoiSathi</h2>
        <p class="section-subtitle">Built for speed, intelligence, and everyday home cooks.</p>
      </div>
      <div class="why-grid">
        @for (w of whyItems; track w.title) {
          <div class="why-card glass-panel">
            <div class="why-icon"><mat-icon>{{ w.icon }}</mat-icon></div>
            <h3>{{ w.title }}</h3>
            <p>{{ w.text }}</p>
          </div>
        }
      </div>
    </section>




    <!-- CTA -->
    <section class="cta-section">
      <div class="page page-narrow cta-inner glass-panel">
        <h2>Ready to cook smarter?</h2>
        <p>Join thousands of home cooks discovering recipes with RasoiSathi.</p>
        <div class="hero-actions">
          <a mat-flat-button color="primary" routerLink="/register">Create Free Account</a>
          <a mat-stroked-button routerLink="/search">Browse Recipes</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* HERO */
    .hero {
      align-items: center;
      display: flex;
      justify-content: center;
      min-height: clamp(520px, 85vh, 720px);
      overflow: hidden;
      position: relative;
    }
    .hero-bg { inset: 0; position: absolute; z-index: 0; }
    .hero-bg img { height: 100%; object-fit: cover; width: 100%; }
    .hero-overlay {
      background: linear-gradient(135deg, rgba(26,26,46,0.82) 0%, rgba(255,107,53,0.55) 100%);
      inset: 0;
      position: absolute;
    }
    .hero-content {
      color: #fff;
      max-width: 720px;
      padding: clamp(40px, 6vw, 80px) clamp(20px, 5vw, 64px);
      position: relative;
      text-align: center;
      z-index: 1;
    }
    .eyebrow {
      align-items: center;
      color: rgba(255,255,255,0.9);
      display: inline-flex;
      font-size: 0.88rem;
      font-weight: 600;
      gap: 6px;
      letter-spacing: 0.12em;
      margin: 0 0 16px;
      text-transform: uppercase;
    }
    .eyebrow mat-icon { font-size: 18px; height: 18px; width: 18px; }
    .hero-content h1 {
      font-size: clamp(2.4rem, 5.5vw, 4rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.08;
      margin: 0 0 18px;
    }
    .gradient-text {
      background: linear-gradient(135deg, #ffd6a5, #fff);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .hero-text {
      color: rgba(255,255,255,0.88);
      font-size: 1.08rem;
      line-height: 1.65;
      margin: 0 auto 28px;
      max-width: 560px;
    }
    .glass-panel {
      backdrop-filter: blur(16px);
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: var(--radius-lg);
    }
    .hero-search {
      align-items: center;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr auto;
      margin: 0 auto 20px;
      max-width: 600px;
      padding: 16px;
    }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
    .cta-generate {
      background: linear-gradient(135deg, #fff, #ffe0cc) !important;
      color: var(--primary-dark) !important;
    }

    .section-header.center { text-align: center; }
    .section-header.center .section-subtitle { margin-left: auto; margin-right: auto; }

    /* CATEGORIES */
    .category-grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
    .category-card {
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      display: block;
      height: 200px;
      overflow: hidden;
      position: relative;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .category-card:hover, .category-card:focus-visible {
      box-shadow: var(--shadow);
      outline: none;
      transform: translateY(-8px) scale(1.02);
    }
    .category-card img { height: 100%; object-fit: cover; transition: transform 0.4s ease; width: 100%; }
    .category-card:hover img { transform: scale(1.12); }
    .category-overlay {
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
      inset: 0;
      position: absolute;
    }
    .category-name {
      bottom: 16px;
      color: #fff;
      font-size: 1.1rem;
      font-weight: 700;
      left: 16px;
      position: absolute;
      z-index: 1;
    }
    .category-arrow {
      bottom: 16px;
      color: #fff;
      opacity: 0;
      position: absolute;
      right: 16px;
      transform: translateX(-8px);
      transition: opacity 0.25s ease, transform 0.25s ease;
      z-index: 1;
    }
    .category-card:hover .category-arrow { opacity: 1; transform: translateX(0); }

    /* FEATURES */
    .features-section { background: linear-gradient(180deg, transparent, rgba(255,107,53,0.03)); }
    .feature-grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .features-section .glass-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 28px;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .features-section .glass-panel:hover { box-shadow: var(--shadow); transform: translateY(-4px); }
    .feature-icon { font-size: 2.2rem; margin-bottom: 12px; }
    .feature-card h3 { font-size: 1.05rem; margin: 0 0 8px; }
    .feature-card p { color: var(--muted); font-size: 0.92rem; line-height: 1.55; margin: 0; }

    /* WHY */
    .why-grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
    .why-section .glass-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 28px 20px;
      text-align: center;
      transition: transform 0.25s ease;
    }
    .why-section .glass-panel:hover { transform: translateY(-4px); }
    .why-icon {
      align-items: center;
      background: linear-gradient(135deg, #fff1eb, #ffe0cc);
      border-radius: 50%;
      display: flex;
      height: 56px;
      justify-content: center;
      margin: 0 auto 14px;
      width: 56px;
    }
    .why-icon mat-icon { color: var(--primary); font-size: 28px; height: 28px; width: 28px; }
    .why-card h3 { font-size: 1rem; margin: 0 0 6px; }
    .why-card p { color: var(--muted); font-size: 0.88rem; line-height: 1.5; margin: 0; }




    /* CTA */
    .cta-section { padding-bottom: clamp(40px, 6vw, 80px); }
    .cta-inner {
      background: linear-gradient(135deg, #fff1eb, #fff);
      border: 1px solid var(--border);
      padding: clamp(32px, 5vw, 56px);
      text-align: center;
    }
    .cta-inner h2 { font-size: clamp(1.5rem, 3vw, 2rem); margin: 0 0 8px; }
    .cta-inner p { color: var(--muted); margin: 0 0 24px; }

    @media (max-width: 680px) {
      .hero-search { grid-template-columns: 1fr; }
      .category-grid { grid-template-columns: repeat(2, 1fr); }
      .category-card { height: 150px; }
    }
  `]
})
export class Home implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private recipes = inject(RecipeSignalStore);
  form = this.fb.group({ query: [''] });
  randomLoading = signal(false);

  categories: Category[] = [
    { name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80', query: 'Indian' },
    { name: 'Italian', image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=600&q=80', query: 'Italian' },
    { name: 'Chinese', image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=600&q=80', query: 'Chinese' },
    { name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', query: 'Mexican' },
    { name: 'Dessert', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80', query: 'Dessert' },
    { name: 'Breakfast', image: 'https://images.unsplash.com/photo-1533089860890-a1b9618a8c74?auto=format&fit=crop&w=600&q=80', query: 'Breakfast' }
  ];

  features: Feature[] = [
    { icon: '🍳', title: 'Recipe Generator', text: 'Chat with our assistant and get complete recipes built around your ingredients.' },
    { icon: '🥗', title: 'Smart Ingredient Search', text: 'Type what you have — we match the closest recipes instantly.' },
    { icon: '🌎', title: 'Cuisine Recommendation', text: 'Explore Indian, Italian, Chinese, Mexican, and more with one click.' },
    { icon: '⏱️', title: 'Cooking Time Filter', text: 'Find quick meals when you are short on time.' },
    { icon: '📖', title: 'Recipe History', text: 'Every search is saved to your profile for easy reference.' },
    { icon: '⭐', title: 'Save Favorites', text: 'Bookmark dishes you love and access them anytime.' }
  ];

  whyItems = [
    { icon: 'bolt', title: 'Fast', text: 'Instant recipe matching from your pantry ingredients.' },
    { icon: 'psychology', title: 'Smart', text: 'Intelligent ranking by ingredient match percentage.' },
    { icon: 'auto_awesome', title: 'Smart Search', text: 'Conversational assistant for recipe discovery.' },
    { icon: 'devices', title: 'Responsive', text: 'Beautiful on desktop, tablet, and mobile.' },
    { icon: 'touch_app', title: 'Easy to Use', text: 'Clean interface designed for everyday home cooks.' }
  ];


  ngOnInit(): void { this.recipes.loadFilters(); }

  goSearch(): void { this.router.navigate(['/search'], { queryParams: { q: this.form.value.query || '' } }); }

  surpriseMe(): void {
    this.randomLoading.set(true);
    this.recipes.getRandomRecipe().subscribe({
      next: (recipe) => {
        this.randomLoading.set(false);
        this.router.navigate(['/recipes', recipe.id]);
      },
      error: () => this.randomLoading.set(false)
    });
  }
  openCategory(cat: Category): void {
    const cuisines = ['Indian', 'Italian', 'Chinese', 'Mexican'];
    const categoriesList = ['Dessert', 'Breakfast'];
    
    if (cuisines.includes(cat.name)) {
      this.router.navigate(['/search'], { queryParams: { cuisine: cat.query } });
    } else if (categoriesList.includes(cat.name)) {
      this.router.navigate(['/search'], { queryParams: { category: cat.query } });
    } else {
      this.router.navigate(['/search'], { queryParams: { q: cat.query } });
    }
  }
}
