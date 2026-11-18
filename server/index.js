require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { z } = require('zod');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'rasoisathi-dev-secret';
const MEALDB = process.env.MEALDB_BASE || 'https://www.themealdb.com/api/json/v1/1';
const { buildCorsOptions } = require('./cors-config');

app.use(helmet());
app.use(cors(buildCorsOptions(process.env)));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));

const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string().regex(strongPassword, 'Password must be 8+ chars with uppercase, number and special character')
});
const loginSchema = z.object({ email: z.string().email().toLowerCase(), password: z.string().min(1) });

function clean(value) {
  return String(value || '').trim().replace(/[<>]/g, '');
}

function tokenFor(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2d' });
}

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Login required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Session expired. Please login again.' });
  }
}

// Reads the token if one is sent, but never blocks the request.
// Used by the chat endpoint so both guests and logged-in users can chat.
function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try { req.user = jwt.verify(token, JWT_SECRET); } catch { req.user = null; }
  }
  next();
}

// Ordered list of {keywords, image} pairs used to pick a photo that actually
// matches a dish name. Checked top-to-bottom, first match wins, so more
// specific dish names (e.g. "butter chicken") are listed before generic
// category words (e.g. "chicken").
const CURATED_DISH_IMAGES = [
  { keywords: ['palak', 'spinach'], image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['samosa'], image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['butter chicken', 'tikka masala', 'chicken tikka'], image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['paneer butter', 'paneer masala', 'shahi paneer', 'paneer tikka', 'paneer'], image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['biryani', 'pulao', 'pilaf'], image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['dal tadka', 'dal fry', 'dal makhani', 'lentil'], image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['chana masala', 'chole', 'chickpea'], image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['naan', 'roti', 'paratha', 'chapati'], image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['dosa', 'idli', 'sambar'], image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['taco', 'burrito', 'quesadilla', 'nachos'], image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['pizza'], image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['burger'], image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['sushi'], image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['noodle', 'chow mein', 'lo mein', 'ramen'], image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['fried rice'], image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['dumpling', 'momo'], image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['soup'], image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['salad'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['sandwich', 'sub'], image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['pancake'], image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['waffle'], image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['omelette', 'omelet', 'scrambled egg'], image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['cake'], image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['cookie', 'brownie'], image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['ice cream'], image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['pasta', 'spaghetti', 'lasagna', 'macaroni', 'penne'], image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['curry'], image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['fish', 'salmon', 'seafood', 'shrimp', 'prawn'], image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['chicken'], image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['rice'], image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80' },
];

// Category/cuisine level fallbacks, used when no dish-name keyword matches.
const CURATED_CATEGORY_IMAGES = {
  dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80',
  vegetarian: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  vegan: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  seafood: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
  breakfast: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80',
  chinese: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=600&q=80',
};

// Last-resort generic "delicious plate of food" photo when nothing else matches.
const GENERIC_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

// Picks a photo that visually matches the dish, instead of trusting a
// third-party thumbnail that may not correspond to the name at all.
function pickCuratedImage(name, category, cuisine) {
  const nameLower = (name || '').toLowerCase();
  const found = CURATED_DISH_IMAGES.find((entry) => entry.keywords.some((keyword) => nameLower.includes(keyword)));
  if (found) return found.image;
  const categoryKey = (category || '').toLowerCase();
  const cuisineKey = (cuisine || '').toLowerCase();
  if (CURATED_CATEGORY_IMAGES[categoryKey]) return CURATED_CATEGORY_IMAGES[categoryKey];
  if (CURATED_CATEGORY_IMAGES[cuisineKey]) return CURATED_CATEGORY_IMAGES[cuisineKey];
  return GENERIC_FOOD_IMAGE;
}

// `origin` tells us where the recipe data came from:
//  - 'mealdb': a real recipe fetched from TheMealDB, whose thumbnail is
//     verified and accurate, so it is always trusted as-is.
//  - 'local': our own hand-written Indian recipes, whose thumbnails were
//     picked by us to match the dish, so they are also trusted as-is.
//  - 'ai': a recipe generated by the AI chef. The AI can only *guess* at an
//     image URL - it has no way to see what photo actually lives at that
//     URL - so those guesses are unreliable and frequently mismatched. For
//     AI recipes we always replace the guessed URL with a curated photo
//     chosen from the dish name/category instead.
function mapMeal(meal, matchPercent = 0, matchedIngredients = [], origin = 'mealdb') {
  const image = origin === 'ai' || !meal.strMealThumb
    ? pickCuratedImage(meal.strMeal, meal.strCategory, meal.strArea)
    : meal.strMealThumb;

  return {
    id: meal.idMeal,
    name: meal.strMeal,
    image,
    category: meal.strCategory || 'Unknown',
    cuisine: meal.strArea || 'Unknown',
    instructions: meal.strInstructions || '',
    youtube: meal.strYoutube || '',
    source: meal.strSource || '',
    matchPercent,
    matchedIngredients,
    ingredients: Array.from({ length: 20 }, (_, i) => i + 1)
      .map((i) => ({ ingredient: meal[`strIngredient${i}`], measure: meal[`strMeasure${i}`] }))
      .filter((item) => item.ingredient && item.ingredient.trim())
  };
}

async function mealDb(path, params = {}) {
  const { data } = await axios.get(`${MEALDB}/${path}`, { params, timeout: 12000 });
  return data;
}

async function lookupMeal(id) {
  try {
    const data = await mealDb('lookup.php', { i: id });
    return data.meals?.[0] || null;
  } catch {
    return null;
  }
}

function computeMatch(meal, userIngredients, mode = 'ingredients') {
  // Extract non-empty ingredients required by the recipe
  const recipeIngredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    if (ing && ing.trim()) {
      recipeIngredients.push(ing.trim().toLowerCase());
    }
  }

  // If no ingredients are searched, or the search array is empty, return 100% match
  if (!userIngredients || userIngredients.length === 0) {
    return { matched: [], percent: 100 };
  }

  // Name mode: match name against query words
  if (mode === 'name') {
    const nameLower = (meal.strMeal || '').toLowerCase();
    const matched = userIngredients.filter(q => nameLower.includes(q.toLowerCase()));
    return {
      matched,
      percent: matched.length ? 100 : 0
    };
  }

  // Ingredients mode: check how many of the USER'S entered ingredients match the recipe
  const searchable = [
    meal.strMeal,
    meal.strCategory,
    meal.strArea,
    meal.strInstructions,
    ...recipeIngredients
  ].join(' ').toLowerCase();

  const matched = userIngredients.filter(userIng => {
    const userIngLower = userIng.toLowerCase().trim();
    const matchesIng = recipeIngredients.some(recipeIng => 
      recipeIng.includes(userIngLower) || userIngLower.includes(recipeIng)
    );
    if (matchesIng) return true;
    return searchable.includes(userIngLower);
  });

  const percent = userIngredients.length 
    ? Math.round((matched.length / userIngredients.length) * 100) 
    : 100;

  return {
    matched,
    percent
  };
}

app.get('/api/health', (_, res) => res.json({ ok: true, api: 'RasoiSathi' }));

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const input = registerSchema.parse({ ...req.body, name: clean(req.body.name) });
    const exists = await db.get('SELECT id FROM users WHERE email = ?', [input.email]);
    if (exists) return res.status(409).json({ message: 'Email is already registered' });
    const hash = await bcrypt.hash(input.password, 10);
    const result = await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [input.name, input.email, hash]);
    const user = { id: result.id, name: input.name, email: input.email };
    res.status(201).json({ token: tokenFor(user), user });
  } catch (error) { next(error); }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const row = await db.get('SELECT * FROM users WHERE email = ?', [input.email]);
    if (!row || !(await bcrypt.compare(input.password, row.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = { id: row.id, name: row.name, email: row.email };
    res.json({ token: tokenFor(user), user });
  } catch (error) { next(error); }
});

app.get('/api/auth/profile', auth, async (req, res, next) => {
  try {
    const user = await db.get('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    const favoriteCount = await db.get('SELECT COUNT(*) as count FROM favorites WHERE user_id = ?', [req.user.id]);
    const recentSearches = await db.all('SELECT * FROM search_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 8', [req.user.id]);
    res.json({ ...user, favoriteCount: favoriteCount.count, recentSearches });
  } catch (error) { next(error); }
});

app.put('/api/auth/profile', auth, async (req, res, next) => {
  try {
    const name = clean(req.body.name);
    if (name.length < 2) return res.status(400).json({ message: 'Name is required' });
    await db.run('UPDATE users SET name = ? WHERE id = ?', [name, req.user.id]);
    const user = await db.get('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    res.json(user);
  } catch (error) { next(error); }
});

app.put('/api/auth/password', auth, async (req, res, next) => {
  try {
    if (!strongPassword.test(req.body.newPassword || '')) return res.status(400).json({ message: 'Use a stronger new password' });
    const row = await db.get('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (!row || !(await bcrypt.compare(req.body.currentPassword || '', row.password))) return res.status(401).json({ message: 'Current password is wrong' });
    await db.run('UPDATE users SET password = ? WHERE id = ?', [await bcrypt.hash(req.body.newPassword, 10), req.user.id]);
    res.json({ message: 'Password changed' });
  } catch (error) { next(error); }
});

// Beef is excluded from this app everywhere (category list, search results,
// and chat results) to keep the recipe catalogue vegetarian-friendly.
const EXCLUDED_CATEGORIES = new Set(['beef']);

const aiRecipeCache = new Map();

const LOCAL_INDIAN_RECIPES = [
  {
    idMeal: "local_indian_1",
    strMeal: "Paneer Butter Masala",
    strMealThumb: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
    strCategory: "Vegetarian",
    strArea: "Indian",
    strInstructions: "Step 1: Heat 2 tbsp butter in a pan and sauté chopped onions, ginger, and garlic until soft.\nStep 2: Add tomato puree, cashews, and spices (chili powder, turmeric, garam masala). Cook until oil separates.\nStep 3: Blend this mixture into a smooth paste and return to the pan.\nStep 4: Add paneer cubes, heavy cream, and water. Simmer for 5 minutes.\nStep 5: Garnish with coriander and serve hot with naan.",
    strIngredient1: "Paneer", strMeasure1: "250g",
    strIngredient2: "Butter", strMeasure2: "3 tbsp",
    strIngredient3: "Onion", strMeasure3: "1 large",
    strIngredient4: "Tomatoes", strMeasure4: "3 medium",
    strIngredient5: "Ginger garlic paste", strMeasure5: "1 tbsp",
    strIngredient6: "Heavy Cream", strMeasure6: "2 tbsp",
    strIngredient7: "Cashews", strMeasure7: "10 pieces",
    strIngredient8: "Garam Masala", strMeasure8: "1 tsp",
    strIngredient9: "Coriander", strMeasure9: "For garnish"
  },
  {
    idMeal: "local_indian_2",
    strMeal: "Chicken Tikka Masala",
    strMealThumb: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80",
    strCategory: "Chicken",
    strArea: "Indian",
    strInstructions: "Step 1: Marinate chicken pieces in yogurt, lemon juice, ginger garlic paste, and spices for 1 hour.\nStep 2: Grill or bake marinated chicken until slightly charred and cooked through.\nStep 3: In a pot, cook onions, ginger, garlic, and spices in butter. Add tomato paste and heavy cream to form a rich gravy.\nStep 4: Toss in the grilled chicken tikka pieces and simmer for 10 minutes.\nStep 5: Garnish with cilantro and serve with rice.",
    strIngredient1: "Chicken", strMeasure1: "500g",
    strIngredient2: "Yogurt", strMeasure2: "1/2 cup",
    strIngredient3: "Butter", strMeasure3: "2 tbsp",
    strIngredient4: "Heavy Cream", strMeasure4: "1/2 cup",
    strIngredient5: "Tomato Paste", strMeasure5: "3 tbsp",
    strIngredient6: "Onion", strMeasure6: "1 medium",
    strIngredient7: "Ginger garlic paste", strMeasure7: "1 tbsp",
    strIngredient8: "Lemon Juice", strMeasure8: "1 tbsp",
    strIngredient9: "Coriander", strMeasure9: "Garnish"
  },
  {
    idMeal: "local_indian_3",
    strMeal: "Vegetable Biryani",
    strMealThumb: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80",
    strCategory: "Vegetarian",
    strArea: "Indian",
    strInstructions: "Step 1: Wash and soak Basmati rice for 30 minutes, then parboil with whole spices.\nStep 2: Sauté mixed vegetables (potatoes, carrots, beans, peas) with onions, yogurt, mint, coriander, and biryani masala.\nStep 3: Layer the cooked rice and spiced vegetable curry in a heavy-bottomed pot.\nStep 4: Drizzle saffron milk, ghee, and fried onions on top. Cover tightly and cook on low heat (dum) for 15 minutes.\nStep 5: Fluff gently and serve with raita.",
    strIngredient1: "Basmati Rice", strMeasure1: "2 cups",
    strIngredient2: "Mixed Vegetables", strMeasure2: "2 cups",
    strIngredient3: "Onion", strMeasure3: "2 sliced",
    strIngredient4: "Yogurt", strMeasure4: "1/2 cup",
    strIngredient5: "Ghee", strMeasure5: "2 tbsp",
    strIngredient6: "Mint leaves", strMeasure6: "Handful",
    strIngredient7: "Biryani Masala", strMeasure7: "2 tsp",
    strIngredient8: "Saffron", strMeasure8: "Pinch"
  },
  {
    idMeal: "local_indian_4",
    strMeal: "Dal Tadka",
    strMealThumb: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    strCategory: "Vegetarian",
    strArea: "Indian",
    strInstructions: "Step 1: Pressure cook yellow lentils (toor dal) with turmeric, salt, and water until soft.\nStep 2: In a pan, heat ghee. Add cumin seeds, mustard seeds, and dried red chilies until they splutter.\nStep 3: Add chopped onions, green chilies, ginger, and tomatoes. Sauté until mushy.\nStep 4: Pour the cooked dal into the pan and bring to a boil. Adjust salt.\nStep 5: Heat ghee in a small ladle, add minced garlic and chili powder, pour it over the dal (tadka) and cover instantly.",
    strIngredient1: "Yellow Lentils (Toor Dal)", strMeasure1: "1 cup",
    strIngredient2: "Ghee", strMeasure2: "2 tbsp",
    strIngredient3: "Cumin seeds", strMeasure3: "1 tsp",
    strIngredient4: "Onion", strMeasure4: "1 small",
    strIngredient5: "Tomatoes", strMeasure5: "1 medium",
    strIngredient6: "Garlic", strMeasure6: "3 cloves",
    strIngredient7: "Turmeric", strMeasure7: "1/2 tsp",
    strIngredient8: "Dried Red Chilies", strMeasure8: "2 pieces"
  },
  {
    idMeal: "local_indian_5",
    strMeal: "Chana Masala",
    strMealThumb: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
    strCategory: "Vegetarian",
    strArea: "Indian",
    strInstructions: "Step 1: Soak chickpeas overnight and boil with salt and a tea bag (for dark color) until tender.\nStep 2: Heat oil in a pot and sauté finely chopped onions, ginger garlic paste, and green chilies.\nStep 3: Add tomato puree and spices (chana masala powder, red chili, cumin, coriander). Cook until oil separates.\nStep 4: Add the boiled chickpeas along with some cooking water. Mash a few chickpeas to thicken gravy.\nStep 5: Simmer for 10 minutes. Garnish with ginger juliennes and cilantro.",
    strIngredient1: "Chickpeas (Chana)", strMeasure1: "1.5 cups",
    strIngredient2: "Onion", strMeasure2: "1 large",
    strIngredient3: "Tomatoes", strMeasure3: "2 medium",
    strIngredient4: "Ginger garlic paste", strMeasure4: "1 tbsp",
    strIngredient5: "Chana Masala powder", strMeasure5: "2 tsp",
    strIngredient6: "Coriander", strMeasure6: "Garnish",
    strIngredient7: "Lemon Juice", strMeasure7: "1 tsp"
  },
  {
    idMeal: "local_indian_6",
    strMeal: "Indian Samosa",
    strMealThumb: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80",
    strCategory: "Vegetarian",
    strArea: "Indian",
    strInstructions: "Step 1: Prepare dough with flour, carom seeds (ajwain), oil, and warm water. Rest for 30 minutes.\nStep 2: Boil potatoes and peas. Mash potatoes coarsely.\nStep 3: Heat oil in a pan, add cumin, ginger, chilies, and spices. Sauté potatoes and peas for 5 minutes.\nStep 4: Roll dough into ovals, cut in half, shape into cones, and stuff with potato mixture. Seal edges with water.\nStep 5: Deep fry samosas on low-medium heat until golden brown and crispy.",
    strIngredient1: "Flour", strMeasure1: "2 cups",
    strIngredient2: "Potatoes", strMeasure2: "3 medium",
    strIngredient3: "Green Peas", strMeasure3: "1/2 cup",
    strIngredient4: "Ajwain seeds", strMeasure4: "1/2 tsp",
    strIngredient5: "Cumin seeds", strMeasure5: "1 tsp",
    strIngredient6: "Garam Masala", strMeasure6: "1/2 tsp",
    strIngredient7: "Oil", strMeasure7: "For deep fry"
  }
];

// Shared search logic used by both the search box (/api/recipes/search)
// and the chat assistant (/api/chat), so both features behave the same way.
async function performSearch({ query, mode, cuisine, category }) {
  const cleanQuery = clean(query || '');
  const cleanCuisine = clean(cuisine || '');
  const cleanCategory = clean(category || '');
  const userIngredients = cleanQuery.split(',').map((x) => clean(x).toLowerCase()).filter(Boolean);
  let basics = [];

  if (mode === 'name' && cleanQuery) {
    basics = (await mealDb('search.php', { s: cleanQuery }).catch(() => ({ meals: [] }))).meals || [];
  } else if (cleanCategory) {
    basics = (await mealDb('filter.php', { c: cleanCategory }).catch(() => ({ meals: [] }))).meals || [];
  } else if (cleanCuisine) {
    basics = (await mealDb('filter.php', { a: cleanCuisine }).catch(() => ({ meals: [] }))).meals || [];
  } else if (userIngredients.length) {
    // TheMealDB's filter.php only accepts ONE ingredient per call, so to
    // support "tomato, onion, paneer" style queries we call it once per
    // ingredient (first 3, to keep it fast) and merge the results. Meals
    // that show up for more than one ingredient are ranked first, since
    // they are the closest overall match.
    const ingredientSets = await Promise.all(
      userIngredients.slice(0, 3).map((ingredient) => mealDb('filter.php', { i: ingredient }).catch(() => ({ meals: [] })))
    );
    const merged = new Map();
    const occurrences = new Map();
    ingredientSets.forEach((set) => {
      (set.meals || []).forEach((meal) => {
        merged.set(meal.idMeal, meal);
        occurrences.set(meal.idMeal, (occurrences.get(meal.idMeal) || 0) + 1);
      });
    });
    basics = Array.from(merged.values()).sort((a, b) => (occurrences.get(b.idMeal) || 0) - (occurrences.get(a.idMeal) || 0));
  } else {
    basics = (await mealDb('search.php', { s: '' }).catch(() => ({ meals: [] }))).meals || [];
  }

  // 1. Fetch remote database recipes from TheMealDB first
  const detailMeals = (await Promise.all(basics.slice(0, 24).map((meal) => lookupMeal(meal.idMeal)))).filter(Boolean);
  let recipes = detailMeals.map((meal) => {
    const match = computeMatch(meal, userIngredients, mode);
    return mapMeal(meal, match.percent, match.matched, 'mealdb');
  });

  // 2. Gather all local matching Indian recipes
  const matchedLocalIndian = [];
  const lowerQuery = cleanQuery.toLowerCase();
  const lowerCuisine = cleanCuisine.toLowerCase();
  const lowerCategory = cleanCategory.toLowerCase();

  if (lowerCuisine === 'indian' || lowerQuery.includes('indian') || lowerQuery.includes('paneer') || lowerQuery.includes('masala') || lowerQuery.includes('biryani') || lowerQuery.includes('dal') || lowerQuery.includes('chana') || lowerQuery.includes('samosa') || lowerQuery.includes('curry') || userIngredients.some(i => ['paneer', 'butter', 'biryani', 'dal', 'chana', 'samosa', 'indian', 'curry'].includes(i))) {
    LOCAL_INDIAN_RECIPES.forEach(meal => {
      if (lowerCategory && meal.strCategory.toLowerCase() !== lowerCategory) return;
      const match = computeMatch(meal, userIngredients, mode);
      if (mode === 'name' && lowerQuery) {
        if (!meal.strMeal.toLowerCase().includes(lowerQuery)) return;
      }
      matchedLocalIndian.push(mapMeal(meal, match.percent, match.matched, 'local'));
    });
  }

  // 3. Query Gemini for dynamic recipe generation if API key is present
  const matchedAiRecipes = [];

  // Decide whether to run AI generation based on results count and queries
  const shouldTriggerAi = process.env.GEMINI_API_KEY && (
    recipes.length < 4 ||
    lowerCuisine === 'indian' ||
    lowerCuisine === 'mexican' ||
    lowerCuisine === 'chinese' ||
    lowerCuisine === 'healthy' ||
    lowerCuisine === 'fast food' ||
    lowerQuery.includes('breakfast') ||
    lowerQuery.includes('healthy') ||
    lowerQuery.includes('dessert')
  );

  if (shouldTriggerAi) {
    try {
      const prompt = `You are an expert chef database. Generate a JSON list of 3-4 authentic recipes that match the search query: "${cleanQuery}", selected cuisine: "${cleanCuisine || 'Any'}", and category: "${cleanCategory || 'Any'}".
Each recipe must use the following schema.
${cleanCuisine ? `Note: Every generated recipe MUST have "strArea" set to exactly "${cleanCuisine}".` : ''}
${cleanCategory ? `Note: Every generated recipe MUST have "strCategory" set to exactly "${cleanCategory}".` : ''}
The JSON object must be formatted exactly as:
{
  "meals": [
    {
      "idMeal": "ai_gen_" + Math.floor(Math.random() * 100000),
      "strMeal": "Recipe Name",
      "strCategory": "${cleanCategory || 'Vegetarian'}",
      "strArea": "${cleanCuisine || 'Mexican'}",
      "strInstructions": "Step 1: ...\\nStep 2: ...\\nStep 3: ...",
      "strYoutube": "",
      "strSource": "",
      "strIngredient1": "ingredient name",
      "strMeasure1": "measurement",
      ... up to strIngredient20 and strMeasure20
    }
  ]
}`;

      const geminiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        },
        { timeout: 20000 }
      );

      const resText = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (resText) {
        const parsed = JSON.parse(resText);
        if (parsed && Array.isArray(parsed.meals)) {
          parsed.meals.forEach(meal => {
            aiRecipeCache.set(meal.idMeal, meal);
            const match = computeMatch(meal, userIngredients, mode);
            matchedAiRecipes.push(mapMeal(meal, match.percent, match.matched, 'ai'));
          });
        }
      }
    } catch (aiErr) {
      console.error('Gemini Recipe Generator failed:', aiErr.message);
    }
  }

  // Combine results. Real TheMealDB recipes and our hand-curated Indian
  // recipes are listed first (most trustworthy), with AI-generated recipes
  // last, purely to fill any gaps. dedupeRecipes() then removes repeats by
  // name so the same dish never shows up twice (e.g. the AI generating
  // "Paneer Butter Masala" when it's already in the local Indian list).
  recipes = dedupeRecipes([...recipes, ...matchedLocalIndian, ...matchedAiRecipes]);
  recipes = recipes.filter((recipe) => !EXCLUDED_CATEGORIES.has(recipe.category.toLowerCase()));
  if (cleanCuisine) recipes = recipes.filter((recipe) => recipe.cuisine.toLowerCase() === cleanCuisine.toLowerCase());
  if (cleanCategory) recipes = recipes.filter((recipe) => recipe.category.toLowerCase() === cleanCategory.toLowerCase());
  recipes.sort((a, b) => b.matchPercent - a.matchPercent || a.name.localeCompare(b.name));
  return { query: cleanQuery, recipes };
}

// Normalizes a recipe name for comparison ("Paneer Butter Masala!" -> "paneer butter masala")
// so near-identical names from different sources are recognised as the same dish.
function normalizeRecipeName(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Removes duplicate recipes (same dish name) across the merged TheMealDB /
// local / AI result sets, keeping the first occurrence of each name.
function dedupeRecipes(list) {
  const seen = new Set();
  const unique = [];
  for (const recipe of list) {
    const key = normalizeRecipeName(recipe.name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(recipe);
  }
  return unique;
}

app.post('/api/recipes/search', async (req, res, next) => {
  try {
    const result = await performSearch(req.body || {});
    res.json(result);
  } catch (error) { next(error); }
});

// Categories and cuisines rarely change, so they are cached in memory for
// this server run instead of calling TheMealDB again on every request.
const filterCache = { categories: null, cuisines: null };
async function getFilterLists() {
  if (!filterCache.categories) {
    const all = (await mealDb('list.php', { c: 'list' }).catch(() => ({ meals: [] }))).meals?.map((x) => x.strCategory) || [];
    filterCache.categories = all.filter((item) => !EXCLUDED_CATEGORIES.has(item.toLowerCase()));
  }
  if (!filterCache.cuisines) {
    const list = (await mealDb('list.php', { a: 'list' }).catch(() => ({ meals: [] }))).meals?.map((x) => x.strArea) || [];
    if (!list.includes('Indian')) {
      list.push('Indian');
    }
    filterCache.cuisines = list;
  }
  return filterCache;
}

app.get('/api/recipes/categories', async (_, res, next) => {
  try { res.json((await getFilterLists()).categories); } catch (error) { next(error); }
});
app.get('/api/recipes/cuisines', async (_, res, next) => {
  try { res.json((await getFilterLists()).cuisines); } catch (error) { next(error); }
});

// --- Chat assistant -------------------------------------------------------
// Simple, explainable rule-based parsing (no paid external model):
// 1. Look for a known category word (e.g. "Dessert") in the message.
// 2. Look for a known cuisine word (e.g. "Indian") in the message.
// 3. Whatever plain words are left over (after removing filler words like
//    "I", "have", "please") are treated as ingredients.
// The parsed result is passed into the same performSearch() used by the
// search page, so the chat gives identical results to a manual search.
const CHAT_FILLER_WORDS = new Set([
  'i', 'me', 'my', 'a', 'an', 'the', 'to', 'for', 'and', 'with', 'of', 'in',
  'on', 'at', 'as', 'or', 'from', 'into', 'up', 'down', 'out', 'not',
  'have', 'has', 'had', 'got', 'want', 'wants', 'need', 'needs', 'like',
  'make', 'made', 'making', 'cook', 'cooking', 'find', 'show', 'give',
  'suggest', 'suggestion', 'suggestions', 'use', 'using', 'get',
  'recommend', 'recipe', 'recipes', 'please', 'can', 'you', 'your', 'some', 'any',
  'today', 'tonight', 'now', 'dinner', 'lunch', 'meal', 'food', 'dish',
  'idea', 'ideas', 'option', 'options', 'is', 'are', 'am', 'was', 'were',
  'do', 'does', 'did', 'will', 'would', 'should', 'could',
  'what', 'which', 'how', 'about', 'that', 'this', 'these', 'those',
  'more', 'less', 'than', 'also', 'just', 'only', 'really', 'very',
  'much', 'many', 'few', 'lot', 'lots', 'other', 'another',
  'kind', 'type', 'types', 'sort', 'style', 'way', 'ways',
  'something', 'anything', 'good', 'nice', 'quick', 'easy', 'tasty', 'best', 'new',
  'hi', 'hey', 'hello', 'thanks', 'thank', 'plz', 'pls', 'home', 'kitchen',
  'hungry', 'craving', 'crave', 'mood', 'feel', 'feeling'
]);

function parseChatMessage(message, categories, cuisines) {
  const lower = ` ${message.toLowerCase()} `;
  const category = categories.find((item) => lower.includes(` ${item.toLowerCase()} `));
  const cuisine = cuisines.find((item) => lower.includes(` ${item.toLowerCase()} `));

  let remainder = lower;
  if (category) remainder = remainder.split(category.toLowerCase()).join(' ');
  if (cuisine) remainder = remainder.split(cuisine.toLowerCase()).join(' ');

  // Expand common contractions before stripping punctuation, so "I'm",
  // "don't", "I've" etc. don't turn into stray noise words like "im"/"dont".
  remainder = remainder
    .replace(/n't/g, ' not')
    .replace(/'re/g, ' are')
    .replace(/'ve/g, ' have')
    .replace(/'ll/g, ' will')
    .replace(/'m/g, ' am')
    .replace(/'d/g, ' would')
    .replace(/'s/g, ' ');

  const words = remainder
    .replace(/[^a-z0-9,\s]/g, ' ')
    .split(/[\s,]+/)
    .map((word) => word.trim())
    // Real ingredient names are essentially never 1-2 letters long, so this
    // also quietly removes any leftover contraction fragments.
    .filter((word) => word.length > 2 && !CHAT_FILLER_WORDS.has(word));

  return { query: words.join(','), cuisine: cuisine || '', category: category || '' };
}

function buildChatReply({ query, cuisine, category, recipes }) {
  const parts = [];
  if (query) parts.push(`ingredients ${query.split(',').join(', ')}`);
  if (cuisine) parts.push(`${cuisine} cuisine`);
  if (category) parts.push(`${category} category`);
  const criteria = parts.length ? parts.join(' and ') : 'popular recipes';

  if (!recipes.length) {
    return `I could not find a recipe for ${criteria}. Try different ingredients, or mention a cuisine like Indian or a category like Dessert.`;
  }
  const top = recipes[0];
  const countText = recipes.length === 1 ? '1 recipe' : `${recipes.length} recipes`;
  return `Based on ${criteria}, here are ${countText}. "${top.name}" is the closest match at ${top.matchPercent}% ingredients matched.`;
}

function generateGeneralChatReply(message, parsed, recipes) {
  const lower = message.toLowerCase();

  // 1. Greetings & Intro
  if (lower.match(/\b(hi|hello|hey|greetings|hola|chef)\b/)) {
    return `👋 **Welcome to RasoiSathi!** I am your AI Chef Assistant.\n\nYou can ask me to:\n• 🔍 **Find recipes:** *"Find me pasta recipes"* or *"Show me Indian vegetarian dishes"*.\n• 🥕 **Search by ingredients:** *"What can I cook with tomato, onion, and paneer?"*.\n• 💬 **Ask cooking advice:** *"How to bake a cake?"* or *"What is a substitute for butter?"*\n\nWhat would you like to cook today?`;
  }

  // 2. Cooking tips / general help requested
  if (lower.includes('substitute') || lower.includes('instead') || lower.includes('done') || lower.includes('cooked') || lower.includes('temperature') || lower.includes('heat') || lower.includes('freeze') || lower.includes('store')) {
    const localSubstitutes = {
      egg: 'applesauce, mashed banana, 1 tbsp flaxseed meal + 3 tbsp water, yogurt, or silken tofu',
      butter: 'coconut oil, olive oil, margarine, ghee, or applesauce',
      milk: 'almond milk, soy milk, oat milk, coconut milk, or cashew milk',
      sugar: 'honey, maple syrup, coconut sugar, stevia, or applesauce',
      buttermilk: '1 cup milk + 1 tbsp lemon juice or white vinegar (let sit 5 mins)',
      onion: 'asafoetida (hing) or leeks',
      garlic: 'shallots or garlic powder',
      paneer: 'tofu or cottage cheese',
      cheese: 'nutritional yeast or vegan cheese substitutes',
      flour: 'almond flour, oat flour, or gluten-free baking blend'
    };
    return generateExpertResponse(message, "your selected recipe", [], [], localSubstitutes, "Local Expert System");
  }

  // 3. Recipes found
  if (recipes && recipes.length > 0) {
    const cuisineText = parsed.cuisine ? `**${parsed.cuisine}** cuisine ` : '';
    const categoryText = parsed.category ? `**${parsed.category}** category ` : '';
    const ingredientsText = parsed.query ? `using **${parsed.query.split(',').join(', ')}** ` : '';

    return `🍳 **Chef Agent:**\nI have scanned our recipe database and found some great ideas for you ${cuisineText}${categoryText}${ingredientsText}!\n\nHere are the top matches:\n• **${recipes.slice(0, 3).map(r => r.name).join('**\n• **')}**\n\nYou can click on any of the recipe cards listed below to view their details and start cooking!`;
  }

  // 4. Default fallback
  return `🍳 **Chef Agent:**\nI searched for recipe ideas matching your message: "${message}", but couldn't find matches in our current database.\n\nTry searching for common ingredients like *"paneer, tomato"* or cuisines like *"Indian"* or *"Italian"*, or ask general cooking questions!`;
}

function decodeHtmlEntities(str) {
  return String(str || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'");
}

async function searchYouTube(query) {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.trim();

  // Try direct YouTube search scraping first
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 8000
    });
    const html = response.data;
    const regex = /ytInitialData\s*=\s*({.+?});/;
    const match = html.match(regex);
    if (match) {
      const json = JSON.parse(match[1]);
      const contents = json.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;
      if (contents && Array.isArray(contents)) {
        const results = [];
        for (const item of contents) {
          if (item.videoRenderer) {
            const video = item.videoRenderer;
            const videoId = video.videoId;
            const title = video.title?.runs?.[0]?.text;
            const thumbnail = video.thumbnail?.thumbnails?.[0]?.url;
            const channelName = video.ownerText?.runs?.[0]?.text;
            if (videoId && title) {
              results.push({
                id: videoId,
                title,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                channel: channelName || 'YouTube'
              });
            }
            if (results.length >= 3) break;
          }
        }
        if (results.length > 0) return results;
      }
    }
  } catch (error) {
    console.error("YouTube primary search failed:", error.message);
  }

  // Fallback 1: DuckDuckGo search with site:youtube.com
  try {
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent('site:youtube.com ' + cleanQuery)}`;
    const response = await axios.get(ddgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      },
      timeout: 8000
    });
    const html = response.data;
    const regex = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    const results = [];
    while ((match = regex.exec(html)) !== null && results.length < 3) {
      let href = match[1];
      let titleText = match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      href = decodeHtmlEntities(href);

      if (href.includes('uddg=')) {
        const urlParam = href.split('uddg=')[1]?.split('&')[0];
        if (urlParam) {
          href = decodeURIComponent(urlParam);
        }
      }

      if (href.includes('youtube.com/watch?v=')) {
        const videoId = href.split('v=')[1]?.split('&')[0];
        if (videoId) {
          results.push({
            id: videoId,
            title: titleText,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            channel: 'YouTube Video'
          });
        }
      } else if (href.includes('youtu.be/')) {
        const videoId = href.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
        if (videoId) {
          results.push({
            id: videoId,
            title: titleText,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            channel: 'YouTube Video'
          });
        }
      }
    }
    if (results.length > 0) return results;
  } catch (ddgErr) {
    console.error("YouTube DDG search fallback failed:", ddgErr.message);
  }

  // Fallback 2: Yahoo search with site:youtube.com
  try {
    const yahooUrl = `https://search.yahoo.com/search?p=${encodeURIComponent('site:youtube.com ' + cleanQuery)}`;
    const response = await axios.get(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      },
      timeout: 8000
    });
    const html = response.data;
    const regex = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    const results = [];
    while ((match = regex.exec(html)) !== null && results.length < 3) {
      const href = decodeHtmlEntities(match[1]);
      let titleText = match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      if (href.includes('youtube.com/watch?v=') && titleText.length > 5 && !titleText.includes('<')) {
        const videoId = href.split('v=')[1]?.split('&')[0];
        if (videoId) {
          results.push({
            id: videoId,
            title: titleText,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            channel: 'YouTube Video'
          });
        }
      }
    }
    if (results.length > 0) return results;
  } catch (yahooErr) {
    console.error("YouTube Yahoo search fallback failed:", yahooErr.message);
  }

  return [];
}

app.post('/api/chat', optionalAuth, async (req, res, next) => {
  try {
    const message = clean(req.body.message || '');
    const history = req.body.history || [];
    if (!message) return res.status(400).json({ message: 'Type a message first' });
    if (message.length > 300) return res.status(400).json({ message: 'Message is too long' });

    let youtubeQuery = '';
    const lowerMessage = message.toLowerCase();
    const isGreeting = !!lowerMessage.match(/\b(hi|hello|hey|greetings|hola|chef)\b/);

    if (process.env.GEMINI_API_KEY) {
      try {
        const systemInstruction = `You are RasoiSathi, an intelligent conversational AI chef assistant on the main recipe search and discovery page.
Your task is to respond to the user's question, cooking query, or instruction, and optionally provide search parameters to query our database if they are looking for recipes.
You must respond ONLY with a JSON object containing two fields:
1. "reply": A friendly, natural, helpful conversational response to the user's question or instruction. Keep it engaging, clear, and only in English.
2. "searchParams": An optional object containing parameters to find matching recipes from our database if the user is looking for recipes, or null if they are just chatting:
   - "query": comma-separated ingredient names or keywords (e.g., "paneer, tomato")
   - "cuisine": a single cuisine name if specified (e.g., "Indian", "Italian")
   - "category": a single category name if specified (e.g., "Vegetarian", "Chicken", "Dessert")

JSON Format:
{
  "reply": "Your response here...",
  "searchParams": { "query": "...", "cuisine": "...", "category": "..." } or null
}`;

        const contents = [];
        if (history && Array.isArray(history)) {
          history.slice(-8).forEach(msg => {
            contents.push({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text || '' }]
            });
          });
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const geminiRes = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              responseMimeType: "application/json"
            }
          },
          { timeout: 15000 }
        );

        const resText = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (resText) {
          const parsedGemini = JSON.parse(resText);
          let recipes = [];
          if (parsedGemini.searchParams) {
            const result = await performSearch({
              query: parsedGemini.searchParams.query || '',
              mode: 'ingredients',
              cuisine: parsedGemini.searchParams.cuisine || '',
              category: parsedGemini.searchParams.category || ''
            });
            recipes = result.recipes.slice(0, 6);
          }

          if (req.user) {
            db.run('INSERT INTO search_history (user_id, search_query) VALUES (?, ?)', [req.user.id, message]).catch(() => { });
          }

          let videos = [];
          if (!isGreeting) {
            if (recipes.length > 0) {
              youtubeQuery = `${recipes[0].name} recipe`;
            } else if (parsedGemini.searchParams && (parsedGemini.searchParams.query || parsedGemini.searchParams.cuisine || parsedGemini.searchParams.category)) {
              youtubeQuery = `how to cook ${parsedGemini.searchParams.query || parsedGemini.searchParams.cuisine || parsedGemini.searchParams.category}`;
            } else {
              youtubeQuery = message;
            }
            videos = await searchYouTube(youtubeQuery);
          }

          return res.json({ reply: parsedGemini.reply, recipes, videos });
        }
      } catch (geminiErr) {
        console.error('Gemini chat failed, falling back to local chat parser:', geminiErr.message);
      }
    }

    // Local parser fallback
    const { categories, cuisines } = await getFilterLists();
    const parsed = parseChatMessage(message, categories, cuisines);
    let recipes = [];

    if (parsed.query || parsed.cuisine || parsed.category) {
      const result = await performSearch({ query: parsed.query, mode: 'ingredients', cuisine: parsed.cuisine, category: parsed.category });
      recipes = result.recipes.slice(0, 6);
    }

    const reply = generateGeneralChatReply(message, parsed, recipes);

    if (req.user) {
      db.run('INSERT INTO search_history (user_id, search_query) VALUES (?, ?)', [req.user.id, message]).catch(() => { });
    }

    let videos = [];
    if (!isGreeting) {
      if (recipes.length > 0) {
        youtubeQuery = `${recipes[0].name} recipe`;
      } else if (parsed.query || parsed.cuisine || parsed.category) {
        youtubeQuery = `how to cook ${parsed.query || parsed.cuisine || parsed.category}`;
      } else {
        youtubeQuery = message;
      }
      videos = await searchYouTube(youtubeQuery);
    }

    res.json({ reply, recipes, videos });
  } catch (error) { next(error); }
});

function generateExpertResponse(message, recipeName, ingredients, snippets, localSubstitutes, searchSource) {
  const lower = message.toLowerCase();

  // 1. GREETINGS & INTRO
  if (lower.match(/\b(hi|hello|hey|greetings|hola|chef)\b/)) {
    return `👋 **Hello!** I am your Chef Assistant. I am here to help you cook **${recipeName}** step-by-step.\n\nYou can ask me: \n• *"What can I use instead of egg?"*\n• *"How do I know when this step is done?"*\n• *"What temperature should I cook this at?"*\n\nHow can I help you in your kitchen today?`;
  }

  // 2. DONE / COOKED CHECK
  if (lower.includes('done') || lower.includes('cooked') || lower.includes('ready') || lower.includes('finish')) {
    if (recipeName.toLowerCase().includes('chicken') || recipeName.toLowerCase().includes('meat') || recipeName.toLowerCase().includes('tikka')) {
      return `🍗 **How to check if the chicken/meat is done:**\n1. **Internal Temp:** If you have a meat thermometer, it should read **165°F (74°C)**.\n2. **Visual Check:** Cut into the thickest part. The juices should run completely clear (no pink or red color), and the meat should be opaque white throughout.\n3. **Texture:** It should feel firm to the touch but still tender.`;
    }
    if (recipeName.toLowerCase().includes('cake') || recipeName.toLowerCase().includes('bake') || recipeName.toLowerCase().includes('muffin') || recipeName.toLowerCase().includes('pancake')) {
      return `🍰 **How to check if your baking is done:**\n1. **Toothpick Test:** Insert a toothpick into the center of the cake. If it comes out clean or with a few moist crumbs (no wet batter), it is ready!\n2. **Springback:** Gently press the center of the cake with your finger. It should spring back lightly.\n3. **Edges:** The edges should start pulling away slightly from the sides of the pan.`;
    }
    if (recipeName.toLowerCase().includes('rice') || recipeName.toLowerCase().includes('biryani') || recipeName.toLowerCase().includes('pasta')) {
      return `🍚 **How to check if the rice/pasta is done:**\n1. **Rice:** All liquid should be completely absorbed. Taste a grain—it should be soft and tender, not crunchy. Fluff it with a fork.\n2. **Pasta:** Test a piece—it should be cooked 'al dente' (firm to the bite but cooked through).`;
    }
    return `🍳 **How to check if it's done:**\n1. **Taste Test:** Take a small portion and test the texture and seasoning. It should be tender and fully seasoned.\n2. **Visual cues:** Check if the vegetables are fork-tender and the sauce has thickened to coat the back of a spoon.\n3. **Aroma:** A rich, complete aroma usually indicates that the ingredients have fully married together!`;
  }

  // 3. TEMP / HEAT LEVEL
  if (lower.includes('temp') || lower.includes('heat') || lower.includes('temperature') || lower.includes('degree') || lower.includes('cook at')) {
    if (recipeName.toLowerCase().includes('cake') || recipeName.toLowerCase().includes('bake') || recipeName.toLowerCase().includes('muffin') || recipeName.toLowerCase().includes('samosa') || recipeName.toLowerCase().includes('cookie')) {
      return `🌡️ **Cooking Temperature:**\n* **Baking:** Bake in a preheated oven at **350°F (175°C)**. This is the universal standard for even baking.\n* **Frying (like Samosa):** Fry in oil heated to **325°F - 350°F (160°C - 175°C)** over medium-low heat. Frying too hot will make the outside cook too fast while the inside stays raw!`;
    }
    return `🔥 **Heat Recommendation:**\n* **Sautéing/Pan-frying:** Sauté over **medium heat**. This browns the food beautifully without burning.\n* **Simmering sauces/curries:** Once it boils, reduce heat to **low/medium-low** and simmer with a lid on to let the flavors develop.`;
  }

  // 4. FREEZE / STORAGE
  if (lower.includes('freeze') || lower.includes('store') || lower.includes('leftover') || lower.includes('fridge')) {
    return `❄️ **Storage & Freezing Tips:**\n1. **Cool Down:** Allow the cooked food to cool completely to room temperature before packing.\n2. **Airtight Container:** Store in airtight containers in the fridge for up to **3-4 days**.\n3. **Freezing:** You can freeze this dish for up to **2-3 months**. Thaw overnight in the fridge and reheat thoroughly on the stove or in the oven.`;
  }

  // 5. INGREDIENTS SUBSTITUTES
  let matchedIngredient = null;
  for (const ing in localSubstitutes) {
    if (lower.includes(ing)) {
      matchedIngredient = ing;
      break;
    }
  }

  if (matchedIngredient) {
    let reply = `🍳 **Chef Assistant:**\nBased on my culinary database, the best substitute for **${matchedIngredient}** in "${recipeName}" is: **${localSubstitutes[matchedIngredient]}**.\n\n`;
    if (snippets && snippets.length > 0) {
      reply += `🌐 **Live Web Search Findings (via ${searchSource}):**\n`;
      snippets.forEach((s) => {
        const cleanSnippet = s.replace(/^[A-Za-z]{3}\s+\d{1,2},\s+\d{4}\s+·\s+/, '').trim();
        reply += `• ${cleanSnippet}\n\n`;
      });
      reply += `*Chef's Tip:* Substitutes might alter the moisture balance slightly. Adjust your cooking time accordingly!`;
    } else {
      reply += `*Chef's Tip:* You can swap this ingredient in equal measures (1:1 ratio) for most cooking methods.`;
    }
    return reply;
  }

  // 6. DEFAULT FALLBACK SYNTHESIZER
  if (snippets && snippets.length > 0) {
    let reply = `🍳 **Chef Assistant:**\nI performed a live search regarding your question: "${message}". Here is my synthesized chef advice based on search findings (via ${searchSource}):\n\n`;
    snippets.forEach((s) => {
      const cleanSnippet = s.replace(/^[A-Za-z]{3}\s+\d{1,2},\s+\d{4}\s+·\s+/, '').trim();
      reply += `✨ ${cleanSnippet}\n\n`;
    });
    reply += `Let me know if you need any other cooking tips or step-by-step help!`;
    return reply;
  }

  return `🍳 **Chef Assistant:**\nI am here to help you cook **${recipeName}**! \n\nI can suggest substitutes (e.g. for eggs, onions, milk), explain cooking times, temperatures, and tell you how to check if a step is done. \n\nCould you clarify your question, or ask about a specific ingredient or cooking step?`;
}

app.post('/api/chat/cooking', optionalAuth, async (req, res, next) => {
  try {
    const { message, recipeName, ingredients, instructions, currentStepIndex, history } = req.body;
    const cleanMessage = clean(message || '');
    if (!cleanMessage) return res.status(400).json({ message: 'Type a message first' });
    if (cleanMessage.length > 300) return res.status(400).json({ message: 'Message is too long' });

    // 2. Check if GEMINI_API_KEY is present
    if (process.env.GEMINI_API_KEY) {
      try {
        const systemInstruction = `You are a culinary expert assistant helping a user who is currently cooking the recipe "${recipeName}".
Ingredients for this recipe: ${JSON.stringify(ingredients || [])}.
Instructions / cooking steps: ${instructions || 'No instructions provided.'}
The user is currently at step index ${currentStepIndex !== undefined ? currentStepIndex : 'unknown'} (0-indexed).
Please help the user. If they are missing an ingredient, suggest alternative substitutes. If you need details, explain based on instructions. You must respond ONLY in English. Do not write or reply in any other language under any circumstances.`;

        const contents = [];
        if (history && Array.isArray(history)) {
          history.slice(-8).forEach(msg => {
            contents.push({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text || '' }]
            });
          });
        }

        contents.push({
          role: 'user',
          parts: [{ text: cleanMessage }]
        });

        const geminiRes = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            }
          },
          { timeout: 20000 }
        );

        const reply = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return res.json({ reply });
        }
      } catch (err) {
        console.error('Gemini API call failed, falling back to custom search:', err.message);
      }
    }

    // 3. Fallback: Local database and Web Search scraping
    let localSubstituteReply = '';
    const lowerMsg = cleanMessage.toLowerCase();

    const localSubstitutes = {
      butter: "coconut oil, margarine, olive oil, or applesauce",
      egg: "applesauce, mashed banana, 1 tbsp flaxseed meal + 3 tbsp water, yogurt, or silken tofu",
      eggs: "applesauce, mashed banana, 1 tbsp flaxseed meal + 3 tbsp water, yogurt, or silken tofu",
      buttermilk: "milk mixed with 1 tablespoon of lemon juice or white vinegar",
      milk: "soy milk, almond milk, oat milk, or coconut milk",
      cream: "milk mixed with melted butter, half-and-half, or coconut cream",
      'heavy cream': "milk mixed with melted butter, half-and-half, or coconut cream",
      flour: "gluten-free flour blend, oat flour, or almond flour",
      sugar: "coconut sugar, honey, maple syrup, or white sugar with a bit of molasses",
      'brown sugar': "white sugar mixed with a splash of molasses, or coconut sugar",
      yogurt: "sour cream, Greek yogurt, or coconut yogurt",
      paneer: "extra firm tofu, halloumi, or firm cottage cheese (drained)",
      'red onions': "shallots (closest raw taste), yellow onion (soaked in cold water for 10 mins to reduce bite), or white onion",
      'red onion': "shallots (closest raw taste), yellow onion (soaked in cold water for 10 mins to reduce bite), or white onion",
      onions: "yellow onions, white onions, shallots, leeks, or green onions",
      onion: "yellow onion, white onion, shallot, leek, or green onion",
      garlic: "garlic powder (1/8 tsp per clove), garlic chives, or a pinch of asafoetida (hing)",
      ginger: "ground ginger powder (1/4 tsp per tbsp fresh), or galangal",
      'soy sauce': "tamari, liquid aminos, or coconut aminos",
      lemon: "lime juice, apple cider vinegar, or white wine",
      'lemon juice': "lime juice, apple cider vinegar, or white wine",
      'tomato paste': "tomato sauce (reduce liquid), canned tomatoes, or ketchup",
      vanilla: "maple syrup, honey, or almond extract (use half)",
      'baking powder': "baking soda mixed with cream of tartar",
      'baking soda': "baking powder (use 3x the amount, may affect taste slightly)",
      yeast: "baking powder mixed with an acid like lemon juice",
      cornstarch: "arrowroot powder, tapioca starch, or wheat flour",
      cheese: "nutritional yeast, vegan cheese, or crumbled firm tofu"
    };

    let matchedIngredient = null;
    for (const ing in localSubstitutes) {
      if (lowerMsg.includes(ing)) {
        matchedIngredient = ing;
        localSubstituteReply = `🔍 **Local Substitution Registry:**\nFor **${ing}** in cooking, a great substitute is: **${localSubstitutes[ing]}**.`;
        break;
      }
    }

    let searchSnippets = [];
    let searchSource = '';

    let searchTerm = `substitute for ${matchedIngredient || cleanMessage} in ${recipeName} in English`;
    if (lowerMsg.includes('substitute') || lowerMsg.includes('instead') || lowerMsg.includes('replace')) {
      searchTerm = cleanMessage + ' in English';
    }

    // Try Yahoo Search first
    try {
      const yahooUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(searchTerm)}`;
      const response = await axios.get(yahooUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 12000
      });
      const html = response.data;
      const regex = /<div[^>]*class="[^"]*compText[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
      let match;
      while ((match = regex.exec(html)) !== null && searchSnippets.length < 3) {
        let snippetText = match[1]
          .replace(/<[^>]*>/g, '') // remove HTML tags
          .replace(/\s+/g, ' ')    // clean whitespace
          .trim();
        snippetText = decodeHtmlEntities(snippetText);
        if (snippetText) {
          searchSnippets.push(snippetText);
        }
      }
      if (searchSnippets.length > 0) {
        searchSource = 'Yahoo Search';
      }
    } catch (yahooErr) {
      console.error('Yahoo search scraping failed:', yahooErr.message);
    }

    // Fallback to DuckDuckGo if Yahoo returned nothing
    if (searchSnippets.length === 0) {
      try {
        const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchTerm)}`;
        const response = await axios.get(ddgUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 12000
        });
        const html = response.data;
        const regex = /class="result__snippet"[^>]*>([\s\S]*?)<\/(?:a|span|div)>/g;
        let match;
        while ((match = regex.exec(html)) !== null && searchSnippets.length < 3) {
          let snippetText = match[1]
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          snippetText = decodeHtmlEntities(snippetText);
          if (snippetText) {
            searchSnippets.push(snippetText);
          }
        }
        if (searchSnippets.length > 0) {
          searchSource = 'DuckDuckGo Search';
        }
      } catch (ddgErr) {
        console.error('DuckDuckGo search scraping failed:', ddgErr.message);
      }
    }
    const finalReply = generateExpertResponse(cleanMessage, recipeName, ingredients, searchSnippets, localSubstitutes, searchSource);

    res.json({ reply: finalReply });
  } catch (error) {
    next(error);
  }
});

// "Surprise Me" – returns one random recipe. Tries TheMealDB's random
// endpoint first (skipping excluded categories), and falls back to a random
// pick from our local Indian recipes if TheMealDB is unavailable, so the
// button always works even offline from TheMealDB.
app.get('/api/recipes/random', async (req, res, next) => {
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const data = await mealDb('random.php').catch(() => null);
      const meal = data?.meals?.[0];
      if (meal && !EXCLUDED_CATEGORIES.has((meal.strCategory || '').toLowerCase())) {
        return res.json(mapMeal(meal, 0, [], 'mealdb'));
      }
    }
    const fallback = LOCAL_INDIAN_RECIPES[Math.floor(Math.random() * LOCAL_INDIAN_RECIPES.length)];
    res.json(mapMeal(fallback, 0, [], 'local'));
  } catch (error) { next(error); }
});

app.get('/api/recipes/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    if (aiRecipeCache.has(id)) {
      const meal = aiRecipeCache.get(id);
      return res.json(mapMeal(meal, 0, [], 'ai'));
    }
    const localMeal = LOCAL_INDIAN_RECIPES.find(m => m.idMeal === id);
    if (localMeal) {
      return res.json(mapMeal(localMeal, 0, [], 'local'));
    }
    const meal = await lookupMeal(id);
    if (!meal || EXCLUDED_CATEGORIES.has((meal.strCategory || '').toLowerCase())) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(mapMeal(meal, 0, [], 'mealdb'));
  } catch (error) { next(error); }
});

app.post('/api/favorites', auth, async (req, res, next) => {
  try {
    const recipe = req.body;
    await db.run('INSERT OR IGNORE INTO favorites (user_id, recipe_id, recipe_name, recipe_image) VALUES (?, ?, ?, ?)', [req.user.id, recipe.id, clean(recipe.name), recipe.image || '']);
    res.status(201).json({ message: 'Saved to favorites' });
  } catch (error) { next(error); }
});
app.get('/api/favorites', auth, async (req, res, next) => {
  try { res.json(await db.all('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC', [req.user.id])); } catch (error) { next(error); }
});
app.delete('/api/favorites/:id', auth, async (req, res, next) => {
  try { await db.run('DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?', [req.user.id, req.params.id]); res.json({ message: 'Removed from favorites' }); } catch (error) { next(error); }
});

app.post('/api/history', auth, async (req, res, next) => {
  try {
    const search = clean(req.body.search_query || req.body.query || '');
    if (search) await db.run('INSERT INTO search_history (user_id, search_query) VALUES (?, ?)', [req.user.id, search]);
    res.status(201).json({ message: 'History saved' });
  } catch (error) { next(error); }
});
app.get('/api/history', auth, async (req, res, next) => {
  try { res.json(await db.all('SELECT * FROM search_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [req.user.id])); } catch (error) { next(error); }
});

app.use((error, req, res, _next) => {
  if (error instanceof z.ZodError) return res.status(400).json({ message: error.issues[0]?.message || 'Validation failed' });
  const status = error.response?.status || 500;
  const message = status === 500 ? 'Something went wrong. Please try again.' : error.message;
  res.status(status).json({ message });
});

app.listen(PORT, () => console.log(`RasoiSathi API running on http://localhost:${PORT}`));
