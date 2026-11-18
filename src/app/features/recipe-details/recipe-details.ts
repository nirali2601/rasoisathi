import { Component, OnInit, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecipeSignalStore } from '../../core/stores/recipe-signal.store';
import { FavoriteSignalStore } from '../../core/stores/favorite-signal.store';
import { AuthSignalStore } from '../../core/stores/auth-signal.store';
import { SnackService } from '../../core/services/snack.service';
import { getRecipeMeta } from '../../shared/utils/recipe-meta.util';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../../models/chat.model';

@Component({
  selector: 'app-recipe-details',
  imports: [
    ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule
  ],
  template: `
    <section class="page page-narrow">
      @if (!recipe()) {
        <div class="loader">
          <mat-spinner diameter="48" />
          <p>Loading recipe...</p>
        </div>
      } @else {
        @if (cookingModeActive()) {
          <div class="cooking-container animate-fade-up">
            <div class="cooking-header">
              <button mat-stroked-button class="exit-btn" (click)="exitCooking()">
                <mat-icon>close</mat-icon> <span>Exit Cooking</span>
              </button>
              <div class="cooking-title">
                <h2>Cooking: {{ recipe()!.name }}</h2>
                <span class="meta">Step {{ currentStepIndex() + 1 }} of {{ parsedSteps.length }}</span>
              </div>
              <div class="cooking-progress">
                <div class="progress-bar" [style.width.%]="((currentStepIndex() + 1) / parsedSteps.length) * 100"></div>
              </div>
            </div>

            <div class="cooking-grid">
              <!-- Left Column: Step Instruction and Checklist -->
              <div class="cooking-main">
                <mat-card class="cooking-step-card">
                  <div class="step-num">Step {{ currentStepIndex() + 1 }}</div>
                  <p class="step-instruction">{{ parsedSteps[currentStepIndex()] }}</p>
                  
                  <div class="step-nav-actions">
                    <button mat-stroked-button (click)="prevStep()" [disabled]="currentStepIndex() === 0">
                      <mat-icon>navigate_before</mat-icon> <span>Previous</span>
                    </button>
                    <button mat-flat-button color="primary" (click)="nextStep()" [disabled]="currentStepIndex() === parsedSteps.length - 1">
                      <span>Next Step</span> <mat-icon>navigate_next</mat-icon>
                    </button>
                  </div>
                </mat-card>

                <mat-card class="ingredients-checklist-card">
                  <h3><mat-icon>playlist_add_check</mat-icon> Ingredient Checklist</h3>
                  <p class="subtitle">Check off ingredients as you prepare them. Need substitutes? Click "Substitute".</p>
                  <div class="checklist-grid">
                    @for (item of recipe()!.ingredients; track item.ingredient) {
                      <div class="checklist-item" [class.checked]="checkedIngredients().has(item.ingredient)">
                        <label class="custom-checkbox">
                          <input type="checkbox" 
                                 [checked]="checkedIngredients().has(item.ingredient)"
                                 (change)="toggleIngredientCheck(item.ingredient)" />
                          <span class="checkmark"></span>
                          <span class="ingredient-label">
                            <strong>{{ item.measure }}</strong> {{ item.ingredient }}
                          </span>
                        </label>
                        <button type="button" mat-stroked-button class="sub-btn" 
                                [disabled]="cookingLoading()"
                                (click)="askForSubstitute(item.ingredient)">
                          @if (loadingSubstituteFor() === item.ingredient) {
                            <mat-spinner diameter="16" style="margin-right: 6px; display: inline-block; vertical-align: middle;" />
                            <span>Finding...</span>
                          } @else {
                            <ng-container>
                              <mat-icon>swap_horiz</mat-icon> <span>Substitute</span>
                            </ng-container>
                          }
                        </button>
                      </div>
                    }
                  </div>
                </mat-card>
              </div>

              <!-- Right Column: Chef Assistant Chatbox -->
              <div class="cooking-sidebar">
                <mat-card class="assistant-card">
                  <div class="assistant-header">
                    <div class="chef-avatar">
                      <mat-icon>restaurant</mat-icon>
                    </div>
                    <div>
                      <h4>Chef Assistant</h4>
                      <span class="status-indicator"><span class="dot"></span> Online &bull; Search Grounded</span>
                    </div>
                  </div>

                  <div class="assistant-messages" #cookingChatScroll>
                    @for (msg of cookingMessages(); track $index) {
                      <div class="message-row" [class.user-row]="msg.role === 'user'">
                        @if (msg.role !== 'user') {
                          <div class="message-avatar"><mat-icon>restaurant</mat-icon></div>
                        }
                        <div class="message-bubble" [class.user-bubble]="msg.role === 'user'">
                          <p class="message-text">{{ msg.text }}</p>
                        </div>
                      </div>
                    }
                    @if (cookingLoading()) {
                      <div class="message-row">
                        <div class="message-avatar"><mat-icon>restaurant</mat-icon></div>
                        <div class="message-bubble typing">
                          <span></span><span></span><span></span>
                        </div>
                      </div>
                    }
                  </div>

                  <div class="chat-suggestions">
                    <span class="suggestion-label">Quick Actions:</span>
                    <div class="chips-container">
                      <button type="button" mat-stroked-button (click)="sendCookingMessage('How do I know when this step is done?')">
                        How to know it's done?
                      </button>
                      <button type="button" mat-stroked-button (click)="sendCookingMessage('What temperature should I cook this?')">
                        What cook temp?
                      </button>
                      <button type="button" mat-stroked-button (click)="sendCookingMessage('Can I freeze this recipe for later?')">
                        Can I freeze this?
                      </button>
                    </div>
                  </div>

                  <form class="assistant-input-form" [formGroup]="form" (ngSubmit)="sendCookingMessage()">
                    <mat-form-field appearance="outline" class="full" subscriptSizing="dynamic">
                      <mat-label>Ask Chef Assistant...</mat-label>
                      <input matInput formControlName="message" placeholder="Ask questions or substitution help..." />
                    </mat-form-field>
                    <button mat-mini-fab color="primary" type="submit" [disabled]="!form.value.message?.trim() || cookingLoading()">
                      <mat-icon>send</mat-icon>
                    </button>
                  </form>
                </mat-card>
              </div>
            </div>
          </div>
        } @else {
          <a mat-button class="back-btn" routerLink="/search"><mat-icon>arrow_back</mat-icon> <span>Back to search</span></a>

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
                <button mat-flat-button color="primary" (click)="toggleFavorite()">
                  <mat-icon>{{ isFavorite() ? 'bookmark' : 'bookmark_border' }}</mat-icon>
                  <span>{{ isFavorite() ? 'Saved' : 'Save Recipe' }}</span>
                </button>
                <button mat-flat-button class="cook-btn" (click)="startCooking()">
                  <mat-icon>play_arrow</mat-icon>
                  <span>Start Cooking</span>
                </button>
                <button mat-stroked-button (click)="share()"><mat-icon>share</mat-icon> <span>Share</span></button>
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

    /* Cooking Mode Layout */
    .cooking-container {
      background: linear-gradient(135deg, #fcfaf8 0%, #faf6f3 100%);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      padding: clamp(16px, 3vw, 32px);
      margin-bottom: 30px;
    }
    
    .cooking-header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: grid;
      gap: 12px;
      grid-template-columns: auto 1fr;
      align-items: center;
    }
    
    .exit-btn {
      grid-column: 1;
      color: var(--muted);
      border-color: var(--border) !important;
      border-radius: 999px !important;
      font-weight: 600 !important;
      transition: all 0.25s ease !important;
    }
    .exit-btn:hover {
      color: var(--primary) !important;
      border-color: var(--primary-light) !important;
      background: #fff1eb !important;
    }
    
    .cooking-title {
      grid-column: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .cooking-title h2 {
      margin: 0;
      font-size: clamp(1.2rem, 2.5vw, 1.8rem);
      font-weight: 800;
      color: var(--text);
    }
    
    .cooking-progress {
      grid-column: 1 / -1;
      height: 8px;
      background: #ece2dc;
      border-radius: 999px;
      overflow: hidden;
      margin-top: 10px;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--primary-light));
      border-radius: 999px;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 8px var(--primary-light);
    }
    
    .cooking-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 24px;
    }
    
    @media (max-width: 960px) {
      .cooking-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .cooking-main {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .cooking-step-card {
      padding: 24px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: #fff;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .step-num {
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--primary);
      font-size: 0.85rem;
    }
    
    .step-instruction {
      font-size: clamp(1.1rem, 2vw, 1.3rem);
      line-height: 1.7;
      color: var(--text);
      font-weight: 500;
      margin: 0;
      white-space: pre-line;
    }
    
    .step-nav-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      gap: 12px;
    }
    .step-nav-actions button {
      border-radius: 999px !important;
      font-weight: 600 !important;
      height: 44px;
      padding: 0 24px !important;
    }
    
    .ingredients-checklist-card {
      padding: 24px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: #fff;
    }
    .ingredients-checklist-card h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      margin: 0 0 4px;
      color: var(--text);
    }
    .ingredients-checklist-card h3 mat-icon {
      color: var(--primary);
    }
    .ingredients-checklist-card .subtitle {
      color: var(--muted);
      font-size: 0.88rem;
      margin-bottom: 20px;
    }
    
    .checklist-grid {
      display: grid;
      gap: 12px;
    }
    
    .checklist-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--bg);
      transition: all 0.2s ease;
      gap: 12px;
    }
    .checklist-item.checked {
      background: #f0fdf4;
      border-color: #b7f0cc;
      opacity: 0.75;
    }
    .checklist-item.checked .ingredient-label {
      text-decoration: line-through;
      color: var(--muted);
    }
    
    .custom-checkbox {
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 30px;
      cursor: pointer;
      font-size: 0.95rem;
      user-select: none;
      flex: 1;
    }
    .custom-checkbox input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    .checkmark {
      position: absolute;
      left: 0;
      height: 20px;
      width: 20px;
      background-color: #fff;
      border: 2px solid var(--border);
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    .custom-checkbox:hover input ~ .checkmark {
      border-color: var(--primary);
    }
    .custom-checkbox input:checked ~ .checkmark {
      background-color: var(--secondary);
      border-color: var(--secondary);
    }
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    .custom-checkbox input:checked ~ .checkmark:after {
      display: block;
    }
    .custom-checkbox .checkmark:after {
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    .ingredient-label {
      line-height: 1.4;
    }
    
    .sub-btn {
      color: var(--primary);
      font-size: 0.85rem !important;
      font-weight: 700 !important;
      flex-shrink: 0;
      border-radius: 999px !important;
      padding: 0 12px !important;
    }
    .sub-btn:hover {
      background: rgba(255, 107, 53, 0.08) !important;
    }
    
    .cooking-sidebar {
      height: 100%;
    }
    .assistant-card {
      padding: 0;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: #fff;
      display: flex;
      flex-direction: column;
      height: 600px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    
    .assistant-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: linear-gradient(135deg, #fff1eb, #fff);
      border-bottom: 1px solid var(--border);
    }
    .chef-avatar {
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: grid;
      place-items: center;
    }
    .assistant-header h4 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      color: var(--secondary);
      font-weight: 600;
    }
    .status-indicator .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--secondary);
      animation: pulse-dot 1.5s infinite;
    }
    @keyframes pulse-dot {
      0% { transform: scale(0.9); opacity: 0.6; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.6; }
    }
    
    .assistant-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #faf9f8;
    }
    
    .message-row {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      max-width: 85%;
    }
    .message-row.user-row {
      align-self: flex-end;
      justify-content: flex-end;
      max-width: 85%;
    }
    
    .message-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      color: white;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .message-avatar mat-icon {
      font-size: 15px;
      width: 15px;
      height: 15px;
    }
    
    .message-bubble {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 16px 16px 16px 4px;
      padding: 12px 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
    }
    .message-row.user-row .message-bubble {
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      border: none;
      color: white;
      border-radius: 16px 16px 4px 16px;
    }
    
    .message-text {
      margin: 0;
      line-height: 1.6;
      font-size: 0.92rem;
      white-space: pre-line;
    }
    
    .message-bubble.typing {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 14px 18px;
    }
    .message-bubble.typing span {
      width: 6px;
      height: 6px;
      background: var(--muted);
      border-radius: 50%;
      animation: bounce 1.2s infinite;
      opacity: 0.3;
    }
    .message-bubble.typing span:nth-child(2) { animation-delay: 0.2s; }
    .message-bubble.typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-5px); opacity: 1; }
    }
    
    .chat-suggestions {
      padding: 10px 16px;
      border-top: 1px solid var(--border);
      background: #fff;
    }
    .suggestion-label {
      font-size: 0.78rem;
      color: var(--muted);
      font-weight: 600;
      display: block;
      margin-bottom: 6px;
    }
    .chips-container {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .chips-container button {
      font-size: 0.8rem !important;
      padding: 4px 10px !important;
      height: 28px !important;
      border-radius: 999px !important;
      border-color: var(--border) !important;
    }
    .chips-container button:hover {
      background: #fff1eb !important;
      color: var(--primary) !important;
      border-color: var(--primary-light) !important;
    }
    
    .assistant-input-form {
      display: flex;
      gap: 8px;
      padding: 14px 20px;
      border-top: 1px solid var(--border);
      background: #fff;
      align-items: center;
    }
    .assistant-input-form mat-form-field {
      flex: 1;
    }
    .assistant-input-form button {
      flex-shrink: 0;
    }
    
    .cook-btn {
      background: linear-gradient(135deg, var(--secondary), #27ae60) !important;
      box-shadow: 0 4px 14px rgba(46, 204, 113, 0.3) !important;
      color: white !important;
      border-radius: 999px !important;
      font-weight: 600 !important;
      letter-spacing: 0.02em !important;
    }
    .cook-btn:hover {
      background: linear-gradient(135deg, #27ae60, #219653) !important;
    }
    
    .custom-checkbox input:checked ~ .checkmark::after {
      animation: checkScale 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
    }
    @keyframes checkScale {
      from { transform: rotate(45deg) scale(0); }
      to { transform: rotate(45deg) scale(1); }
    }
  `]
})
export class RecipeDetails implements OnInit, AfterViewChecked {
  private route = inject(ActivatedRoute);
  private store = inject(RecipeSignalStore);
  fav = inject(FavoriteSignalStore);
  auth = inject(AuthSignalStore);
  private snack = inject(SnackService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  recipe = signal<import('../../models/recipe.model').Recipe | null>(null);

  // Cooking wizard states
  cookingModeActive = signal(false);
  currentStepIndex = signal(0);
  checkedIngredients = signal<Set<string>>(new Set());
  cookingMessages = signal<ChatMessage[]>([]);
  cookingLoading = signal(false);
  loadingSubstituteFor = signal<string | null>(null);

  form = this.fb.nonNullable.group({ message: [''] });

  @ViewChild('cookingChatScroll') private cookingChatScroll?: ElementRef<HTMLDivElement>;

  get meta() {
    const id = this.recipe()?.id ?? '';
    return getRecipeMeta(id);
  }

  get parsedSteps(): string[] {
    const raw = this.recipe()?.instructions || '';
    if (!raw) return [];
    
    let steps = raw
      .split(/\r?\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (steps.length === 1) {
      steps = steps[0]
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }

    return steps.map(s => s.replace(/^(?:step\s+\d+|\d+)[\.\s\-:]+/i, ''));
  }

  ngOnInit(): void {
    this.store.getRecipe(this.route.snapshot.paramMap.get('id') || '').subscribe((recipe) => this.recipe.set(recipe));
    if (this.auth.isLoggedIn() && this.fav.favorites().length === 0) this.fav.load().subscribe();
  }

  ngAfterViewChecked(): void {
    if (this.cookingChatScroll) {
      this.cookingChatScroll.nativeElement.scrollTop = this.cookingChatScroll.nativeElement.scrollHeight;
    }
  }

  startCooking(): void {
    this.cookingModeActive.set(true);
    this.currentStepIndex.set(0);
    this.checkedIngredients.set(new Set());
    
    this.cookingMessages.set([
      {
        role: 'assistant',
        text: `Welcome to Cooking Mode! 🍳 I am your Chef Assistant. I can help you with steps, conversions, or finding substitutes if you lack any ingredients. What can I do for you?`
      }
    ]);
  }

  exitCooking(): void {
    this.cookingModeActive.set(false);
  }

  nextStep(): void {
    if (this.currentStepIndex() < this.parsedSteps.length - 1) {
      this.currentStepIndex.update(idx => idx + 1);
    }
  }

  prevStep(): void {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update(idx => idx - 1);
    }
  }

  toggleIngredientCheck(ingredient: string): void {
    this.checkedIngredients.update(set => {
      const next = new Set(set);
      if (next.has(ingredient)) {
        next.delete(ingredient);
      } else {
        next.add(ingredient);
      }
      return next;
    });
  }

  sendCookingMessage(text?: string): void {
    const msgText = (text || this.form.value.message || '').trim();
    if (!msgText) return;

    if (!text) {
      this.form.reset({ message: '' });
    }

    this.cookingMessages.update(msgs => [...msgs, { role: 'user', text: msgText }]);
    this.cookingLoading.set(true);

    const payload = {
      message: msgText,
      recipeName: this.recipe()?.name || '',
      ingredients: this.recipe()?.ingredients || [],
      instructions: this.recipe()?.instructions || '',
      currentStepIndex: this.currentStepIndex(),
      history: this.cookingMessages().slice(0, -1)
    };

    this.http.post<{ reply: string }>(`${environment.apiUrl}/chat/cooking`, payload).subscribe({
      next: (res) => {
        this.cookingMessages.update(msgs => [...msgs, { role: 'assistant', text: res.reply }]);
        this.cookingLoading.set(false);
        this.loadingSubstituteFor.set(null);
      },
      error: () => {
        this.cookingMessages.update(msgs => [
          ...msgs,
          { role: 'assistant', text: 'Sorry, I am having trouble connecting to the Chef Assistant. Please check your connection and try again.' }
        ]);
        this.cookingLoading.set(false);
        this.loadingSubstituteFor.set(null);
      }
    });
  }

  askForSubstitute(ingredient: string): void {
    const text = `I don't have ${ingredient}. What can I use instead as a substitute for this recipe?`;
    this.loadingSubstituteFor.set(ingredient);
    
    if (window.innerWidth <= 960) {
      setTimeout(() => {
        const chatEl = document.querySelector('.cooking-sidebar');
        if (chatEl) {
          chatEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
    
    this.sendCookingMessage(text);
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
