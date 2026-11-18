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
        <h1 class="section-title"><mat-icon>auto_awesome</mat-icon> Recipe Assistant</h1>
        <p class="section-subtitle">Describe what you want to cook — our assistant will find matching recipes instantly.</p>
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
            @if (message.videos?.length) {
              <div class="chat-videos-header">
                <mat-icon>play_circle_filled</mat-icon>
                <span>Recommended Video Guides</span>
              </div>
              <div class="chat-videos">
                @for (video of message.videos; track video.id) {
                  <a class="chat-video-card" [href]="video.url" target="_blank" rel="noopener noreferrer">
                    <div class="video-thumbnail-wrapper">
                      <img [src]="video.thumbnail" [alt]="video.title" loading="lazy" />
                      <div class="play-overlay">
                        <mat-icon>play_arrow</mat-icon>
                      </div>
                    </div>
                    <div class="video-info">
                      <span class="video-title" [title]="video.title">{{ video.title }}</span>
                      <span class="video-channel">
                        <mat-icon>videocam</mat-icon> {{ video.channel }}
                      </span>
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
    .chat-videos-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 12px 0 6px 40px;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .chat-videos-header mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #ff0000;
    }
    .chat-videos {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 0 0 16px 40px;
    }
    .chat-video-card {
      display: flex;
      flex-direction: column;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      text-decoration: none;
      width: 200px;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: var(--shadow-sm);
    }
    .chat-video-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      border-color: #ff0000;
    }
    .video-thumbnail-wrapper {
      position: relative;
      aspect-ratio: 16/9;
      width: 100%;
      background: #000;
      overflow: hidden;
    }
    .video-thumbnail-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .chat-video-card:hover .video-thumbnail-wrapper img {
      transform: scale(1.05);
    }
    .play-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);
      display: grid;
      place-items: center;
      opacity: 0.8;
      transition: all 0.3s ease;
    }
    .chat-video-card:hover .play-overlay {
      background: rgba(0, 0, 0, 0.4);
      opacity: 1;
    }
    .play-overlay mat-icon {
      color: #fff;
      font-size: 32px;
      width: 32px;
      height: 32px;
      background: rgba(255, 0, 0, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease;
    }
    .chat-video-card:hover .play-overlay mat-icon {
      transform: scale(1.1);
      background: #ff0000;
    }
    .video-info {
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .video-title {
      color: var(--text);
      font-size: 0.82rem;
      font-weight: 600;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 2.7em;
    }
    .video-channel {
      color: var(--muted);
      font-size: 0.72rem;
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .video-channel mat-icon {
      font-size: 12px;
      width: 12px;
      height: 12px;
    }
    .chat-input { align-items: center; border-top: 1px solid var(--border); display: flex; gap: 12px; padding: 14px 20px; }
    @media (max-width: 620px) {
      .chat-recipe { width: 100%; }
      .chat-video-card {
        width: 100%;
        flex-direction: row;
        height: 80px;
      }
      .video-thumbnail-wrapper {
        width: 120px;
        height: 100%;
        aspect-ratio: auto;
      }
      .video-info {
        flex: 1;
        justify-content: center;
      }
      .video-title {
        height: auto;
        -webkit-line-clamp: 2;
      }
    }
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
