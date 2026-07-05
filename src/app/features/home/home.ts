import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RecipeSignalStore } from '../../core/stores/recipe-signal.store';

interface Category { name: string; image: string; query: string; }
interface Feature { icon: string; title: string; text: string; }
interface Testimonial { name: string; role: string; quote: string; avatar: string; }

@Component({
  selector: 'app-home',
  imports: [DecimalPipe, ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  template: `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg" aria-hidden="true">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80" alt="" />
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <p class="eyebrow"><mat-icon>auto_awesome</mat-icon> AI-Powered Recipe Discovery</p>
        <h1>Cook Something<br /><span class="gradient-text">Extraordinary</span> Tonight</h1>
        <p class="hero-text">RasoiSathi AI transforms your pantry into personalized recipes — search by ingredients, chat with our AI chef, and save favorites for your next meal.</p>

        <form class="hero-search glass-panel" [formGroup]="form" (ngSubmit)="goSearch()">
          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label>What's in your kitchen?</mat-label>
            <input matInput formControlName="query" placeholder="tomato, onion, paneer..." />
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit">
            <mat-icon>restaurant</mat-icon> Explore Recipes
          </button>
        </form>

        <div class="hero-actions">
          <a mat-flat-button color="primary" class="cta-generate" routerLink="/chat">
            <mat-icon>auto_awesome</mat-icon> Generate with AI
          </a>
          <a mat-stroked-button routerLink="/search"><mat-icon>tune</mat-icon> Advanced Search</a>
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

    <!-- AI FEATURES -->
    <section class="page page-narrow features-section">
      <div class="section-header center">
        <h2 class="section-title">Powered by AI</h2>
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

    <!-- STATS -->
    <section class="stats-section" #statsSection>
      <div class="page page-narrow stats-grid">
        @for (s of statItems; track s.label) {
          <div class="stat">
            <span class="stat-number">{{ s.value() | number }}{{ s.suffix }}</span>
            <span class="stat-label">{{ s.label }}</span>
          </div>
        }
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="page page-narrow testimonials-section">
      <div class="section-header center">
        <h2 class="section-title">Loved by Home Cooks</h2>
        <p class="section-subtitle">Real stories from people who cook smarter every day.</p>
      </div>
      <div class="testimonial-grid">
        @for (t of testimonials; track t.name) {
          <div class="testimonial-card glass-panel">
            <div class="stars">
              @for (star of [1,2,3,4,5]; track star) { <mat-icon>star</mat-icon> }
            </div>
            <p class="quote">"{{ t.quote }}"</p>
            <div class="testimonial-person">
              <img [src]="t.avatar" [alt]="t.name" loading="lazy" />
              <div>
                <strong>{{ t.name }}</strong>
                <span class="meta">{{ t.role }}</span>
              </div>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="page page-narrow cta-inner glass-panel">
        <h2>Ready to cook smarter?</h2>
        <p>Join thousands of home cooks discovering recipes with AI.</p>
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
      align-items: start;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr auto;
      margin: 0 auto 20px;
      max-width: 600px;
      padding: 16px;
    }
    .hero-search mat-form-field { background: rgba(255,255,255,0.95); border-radius: var(--radius); }
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

    /* STATS */
    .stats-section {
      background: linear-gradient(135deg, var(--primary) 0%, #ff8f5e 50%, var(--accent) 100%);
      color: #fff;
      margin: 20px 0;
    }
    .stats-grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); padding-block: 52px; text-align: center; }
    .stat-number { display: block; font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; }
    .stat-label { font-size: 0.9rem; opacity: 0.92; }

    /* TESTIMONIALS */
    .testimonial-grid { display: grid; gap: 22px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
    .testimonials-section .glass-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 28px;
    }
    .stars { color: #f59e0b; display: flex; gap: 2px; margin-bottom: 12px; }
    .stars mat-icon { font-size: 18px; height: 18px; width: 18px; }
    .quote { color: var(--text); font-size: 0.96rem; line-height: 1.65; margin: 0 0 20px; }
    .testimonial-person { align-items: center; display: flex; gap: 12px; }
    .testimonial-person img { border-radius: 50%; height: 44px; object-fit: cover; width: 44px; }
    .testimonial-person strong { display: block; font-size: 0.92rem; }

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
export class Home implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private recipes = inject(RecipeSignalStore);
  form = this.fb.group({ query: ['tomato,onion'] });

  @ViewChild('statsSection') private statsSection?: ElementRef<HTMLElement>;

  categories: Category[] = [
    { name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80', query: 'Indian' },
    { name: 'Italian', image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=600&q=80', query: 'Italian' },
    { name: 'Chinese', image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=600&q=80', query: 'Chinese' },
    { name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', query: 'Mexican' },
    { name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', query: 'Healthy' },
    { name: 'Fast Food', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80', query: 'Fast Food' },
    { name: 'Dessert', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80', query: 'Dessert' },
    { name: 'Breakfast', image: 'https://images.unsplash.com/photo-1533089860890-a1b9618a8c74?auto=format&fit=crop&w=600&q=80', query: 'Breakfast' }
  ];

  features: Feature[] = [
    { icon: '🍳', title: 'AI Recipe Generator', text: 'Chat with our assistant and get complete recipes built around your ingredients.' },
    { icon: '🥗', title: 'Smart Ingredient Search', text: 'Type what you have — we match the closest recipes instantly.' },
    { icon: '🌎', title: 'Cuisine Recommendation', text: 'Explore Indian, Italian, Chinese, Mexican, and more with one click.' },
    { icon: '⏱️', title: 'Cooking Time Filter', text: 'Find quick meals when you are short on time.' },
    { icon: '📖', title: 'Recipe History', text: 'Every search is saved to your profile for easy reference.' },
    { icon: '⭐', title: 'Save Favorites', text: 'Bookmark dishes you love and access them anytime.' }
  ];

  whyItems = [
    { icon: 'bolt', title: 'Fast', text: 'Instant recipe matching from your pantry ingredients.' },
    { icon: 'psychology', title: 'Smart', text: 'Intelligent ranking by ingredient match percentage.' },
    { icon: 'auto_awesome', title: 'AI Powered', text: 'Conversational AI assistant for recipe discovery.' },
    { icon: 'devices', title: 'Responsive', text: 'Beautiful on desktop, tablet, and mobile.' },
    { icon: 'touch_app', title: 'Easy to Use', text: 'Clean interface designed for everyday home cooks.' }
  ];

  testimonials: Testimonial[] = [
    { name: 'Ananya Rao', role: 'Home Cook, Ahmedabad', quote: 'I stopped wondering what to cook every evening. RasoiSathi always finds something using what is left in my fridge.', avatar: 'https://i.pravatar.cc/80?img=5' },
    { name: 'Devansh Mehta', role: 'College Student, Pune', quote: 'The chat assistant feels like texting a friend who happens to know a thousand recipes.', avatar: 'https://i.pravatar.cc/80?img=12' },
    { name: 'Priya Nair', role: 'Working Professional, Bangalore', quote: 'Clean, fast, and the favorites list has basically become my weekly meal plan.', avatar: 'https://i.pravatar.cc/80?img=9' }
  ];

  display = { recipes: signal(0), users: signal(0), countries: signal(0), recommendations: signal(0) };
  private targets = { recipes: 12000, users: 8500, countries: 24, recommendations: 45000 };
  private animated = false;

  get statItems() {
    return [
      { label: 'Recipes', value: this.display.recipes, suffix: '+' },
      { label: 'Users', value: this.display.users, suffix: '+' },
      { label: 'Countries', value: this.display.countries, suffix: '+' },
      { label: 'Recommendations', value: this.display.recommendations, suffix: '+' }
    ];
  }

  ngOnInit(): void { this.recipes.loadFilters(); }

  ngAfterViewInit(): void {
    if (!this.statsSection || typeof IntersectionObserver === 'undefined') { this.animateStats(); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting) && !this.animated) {
        this.animated = true;
        this.animateStats();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(this.statsSection.nativeElement);
  }

  private animateStats(): void {
    const duration = 1400;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.display.recipes.set(Math.round(this.targets.recipes * eased));
      this.display.users.set(Math.round(this.targets.users * eased));
      this.display.countries.set(Math.round(this.targets.countries * eased));
      this.display.recommendations.set(Math.round(this.targets.recommendations * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  goSearch(): void { this.router.navigate(['/search'], { queryParams: { q: this.form.value.query || '' } }); }
  openCategory(cat: Category): void { this.router.navigate(['/search'], { queryParams: { cuisine: cat.query } }); }
}
