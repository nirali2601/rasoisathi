import { Recipe } from './recipe.model';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  recipes?: Recipe[];
}
