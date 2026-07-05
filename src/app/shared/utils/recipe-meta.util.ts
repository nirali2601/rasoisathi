export interface RecipeMeta {
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number;
  rating: number;
}

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash << 5) - hash + id.charCodeAt(i);
  return Math.abs(hash);
}

/** Deterministic display metadata derived from recipe id — no API changes needed. */
export function getRecipeMeta(id: string): RecipeMeta {
  const h = hashId(id);
  const difficulties: RecipeMeta['difficulty'][] = ['Easy', 'Medium', 'Hard'];
  return {
    cookingTime: 15 + (h % 76),
    difficulty: difficulties[h % 3],
    calories: 180 + (h % 620),
    rating: Math.round((35 + (h % 16)) / 10 * 10) / 10
  };
}
