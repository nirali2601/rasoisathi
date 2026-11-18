import { Recipe } from './recipe.model';

export interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  channel: string;
  description?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  recipes?: Recipe[];
  videos?: YouTubeVideo[];
}

