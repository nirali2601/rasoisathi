export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  favoriteCount?: number;
  recentSearches?: SearchHistory[];
}

export interface SearchHistory {
  id: number;
  user_id: number;
  search_query: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
