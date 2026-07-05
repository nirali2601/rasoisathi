import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../../models/chat.model';
import { Recipe } from '../../models/recipe.model';

interface ChatResponse {
  reply: string;
  recipes: Recipe[];
}

@Injectable({ providedIn: 'root' })
export class ChatSignalStore {
  private http = inject(HttpClient);
  private readonly storageKey = 'rasoisathi_chat_messages';

  messages = signal<ChatMessage[]>(this.readMessages());
  loading = signal(false);

  send(text: string): void {
    const message = text.trim();
    if (!message) return;

    this.messages.update((items) => {
      const next: ChatMessage[] = [...items, { role: 'user', text: message }];
      this.persistMessages(next);
      return next;
    });
    this.loading.set(true);

    this.http.post<ChatResponse>(`${environment.apiUrl}/chat`, { message }).pipe(
      tap((res) => {
        this.messages.update((items) => {
          const next: ChatMessage[] = [...items, { role: 'assistant', text: res.reply, recipes: res.recipes }];
          this.persistMessages(next);
          return next;
        });
      }),
      catchError(() => {
        this.messages.update((items) => {
          const next: ChatMessage[] = [...items, { role: 'assistant', text: 'Sorry, I could not reach the recipe service. Please try again.' }];
          this.persistMessages(next);
          return next;
        });
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  clearSession(): void {
    localStorage.removeItem(this.storageKey);
    this.messages.set([{ role: 'assistant', text: 'Hi! Tell me what ingredients you have, or a cuisine you feel like eating, and I will suggest a recipe. For example: "tomato, onion and paneer" or "Indian dessert".' }]);
  }

  private readMessages(): ChatMessage[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [{ role: 'assistant', text: 'Hi! Tell me what ingredients you have, or a cuisine you feel like eating, and I will suggest a recipe. For example: "tomato, onion and paneer" or "Indian dessert".' }];
    }

    try {
      return JSON.parse(raw) as ChatMessage[];
    } catch {
      return [{ role: 'assistant', text: 'Hi! Tell me what ingredients you have, or a cuisine you feel like eating, and I will suggest a recipe. For example: "tomato, onion and paneer" or "Indian dessert".' }];
    }
  }

  private persistMessages(messages: ChatMessage[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(messages));
  }
}
