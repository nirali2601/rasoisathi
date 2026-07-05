import { Component, ElementRef, ViewChild, AfterViewChecked, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatSignalStore } from '../../core/stores/chat-signal.store';

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule],
  template: `
    <section class="page page-narrow chat-page">
      <div class="page-header">
        <h1 class="section-title"><mat-icon>auto_awesome</mat-icon> AI Recipe Assistant</h1>
        <p class="section-subtitle">Describe what you want to cook — our AI will find matching recipes instantly.</p>
      </div>

      <mat-card class="chat-window">
        <div class="chat-header">
          <div class="bot-avatar"><mat-icon>restaurant</mat-icon></div>
          <div>
            <strong>RasoiSathi Chef</strong>
            <span class="meta">Online &bull; Ready to help</span>
          </div>
        </div>

        <div class="messages" #scrollArea>
          @if (store.messages().length === 0) {
            <div class="welcome-msg">
              <mat-icon>waving_hand</mat-icon>
              <p>Hi! Tell me what ingredients you have or what cuisine you're craving.</p>
              <div class="suggestions">
                @for (s of suggestions; track s) {
                  <button mat-stroked-button type="button" (click)="useSuggestion(s)">{{ s }}</button>
                }
              </div>
            </div>
          }

          @for (message of store.messages(); track $index) {
            <div class="bubble-row" [class.from-user]="message.role === 'user'">
              @if (message.role !== 'user') {
                <div class="bot-avatar small"><mat-icon>restaurant</mat-icon></div>
              }
              <div class="bubble" [class.user]="message.role === 'user'">
                <p>{{ message.text }}</p>
              </div>
            </div>
            @if (message.recipes?.length) {
              <div class="chat-results">
                @for (recipe of message.recipes; track recipe.id) {
                  <a class="chat-recipe" [routerLink]="['/recipes', recipe.id]">
                    <img [src]="recipe.image" [alt]="recipe.name" loading="lazy" />
                    <div>
                      <strong>{{ recipe.name }}</strong>
                      <span class="meta">{{ recipe.cuisine }} &bull; {{ recipe.category }}</span>
                      <span class="badge">{{ recipe.matchPercent }}% match</span>
                    </div>
                  </a>
                }
              </div>
            }
          }
          @if (store.loading()) {
            <div class="bubble-row">
              <div class="bot-avatar small"><mat-icon>restaurant</mat-icon></div>
              <div class="bubble typing"><span></span><span></span><span></span></div>
            </div>
          }
        </div>

        <form class="chat-input" [formGroup]="form" (ngSubmit)="send()">
          <mat-form-field appearance="outline" class="full" subscriptSizing="dynamic">
            <mat-label>Type ingredients or a cuisine</mat-label>
            <input matInput formControlName="message" placeholder="e.g. tomato, onion and paneer" />
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit" [disabled]="!form.value.message?.trim() || store.loading()">
            <mat-icon>send</mat-icon>
          </button>
        </form>
      </mat-card>
    </section>
  `,
  styles: [`
    .page-header .section-title { align-items: center; display: flex; gap: 10px; }
    .page-header .section-title mat-icon { color: var(--primary); }
    .chat-page { display: flex; flex-direction: column; }
    .chat-window {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      height: min(72vh, 680px);
      overflow: hidden;
      padding: 0;
    }
    .chat-header {
      align-items: center;
      background: linear-gradient(135deg, #fff1eb, #fff);
      border-bottom: 1px solid var(--border);
      display: flex;
      gap: 12px;
      padding: 16px 20px;
    }
    .bot-avatar {
      align-items: center;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      border-radius: 50%;
      color: #fff;
      display: flex;
      height: 44px;
      justify-content: center;
      width: 44px;
    }
    .bot-avatar.small { height: 32px; width: 32px; flex-shrink: 0; }
    .bot-avatar mat-icon { font-size: 22px; height: 22px; width: 22px; }
    .bot-avatar.small mat-icon { font-size: 18px; height: 18px; width: 18px; }
    .chat-header strong { display: block; font-size: 0.95rem; }
    .messages { display: flex; flex: 1; flex-direction: column; gap: 12px; min-height: 0; overflow-y: auto; padding: 20px; }
    .welcome-msg { color: var(--muted); margin: auto; max-width: 400px; text-align: center; }
    .welcome-msg mat-icon { color: var(--primary); font-size: 40px; height: 40px; margin-bottom: 8px; width: 40px; }
    .suggestions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px; }
    .bubble-row { align-items: flex-end; display: flex; gap: 8px; }
    .bubble-row.from-user { justify-content: flex-end; }
    .bubble {
      background: #fff1eb;
      border-radius: 18px 18px 18px 4px;
      max-width: 75%;
      padding: 12px 16px;
    }
    .bubble p { line-height: 1.55; margin: 0; }
    .bubble.user { background: linear-gradient(135deg, var(--primary), var(--primary-light)); border-radius: 18px 18px 4px 18px; color: #fff; }
    .bubble.typing { align-items: center; display: flex; gap: 5px; padding: 16px 18px; }
    .bubble.typing span { animation: blink 1.2s infinite; background: var(--muted); border-radius: 50%; height: 7px; width: 7px; }
    .bubble.typing span:nth-child(2) { animation-delay: 0.2s; }
    .bubble.typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }
    .chat-results { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 8px 40px; }
    .chat-recipe {
      align-items: center;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      display: flex;
      gap: 10px;
      padding: 10px;
      text-decoration: none;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
      width: 260px;
    }
    .chat-recipe:hover { box-shadow: var(--shadow-sm); transform: translateY(-2px); }
    .chat-recipe img { border-radius: 8px; height: 52px; object-fit: cover; width: 52px; }
    .chat-recipe div { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .chat-recipe strong { color: var(--text); font-size: 0.9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .chat-input { align-items: center; border-top: 1px solid var(--border); display: flex; gap: 12px; padding: 14px 20px; }
    @media (max-width: 620px) { .chat-recipe { width: 100%; } }
  `]
})
export class Chat implements AfterViewChecked {
  private fb = inject(FormBuilder);
  store = inject(ChatSignalStore);
  form = this.fb.nonNullable.group({ message: [''] });
  suggestions = ['Indian dinner ideas', 'Quick breakfast', 'Healthy lunch', 'Dessert with chocolate'];

  @ViewChild('scrollArea') private scrollArea?: ElementRef<HTMLDivElement>;

  ngAfterViewChecked(): void {
    if (this.scrollArea) this.scrollArea.nativeElement.scrollTop = this.scrollArea.nativeElement.scrollHeight;
  }

  useSuggestion(text: string): void {
    this.form.patchValue({ message: text });
    this.send();
  }

  send(): void {
    const message = this.form.value.message?.trim();
    if (!message) return;
    this.store.send(message);
    this.form.reset({ message: '' });
  }
}
