export interface RecipeIngredient {
  ingredient: string;
  measure: string;
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  category: string;
  cuisine: string;
  instructions?: string;
  youtube?: string;
  source?: string;
  matchPercent: number;
  matchedIngredients: string[];
  ingredients: RecipeIngredient[];
}

export interface SearchRequest {
  query: string;
  mode: 'ingredients' | 'name';
  cuisine?: string;
  category?: string;
}
