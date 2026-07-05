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

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:4200' }));
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

function mapMeal(meal, matchPercent = 0, matchedIngredients = []) {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
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
  const data = await mealDb('lookup.php', { i: id });
  return data.meals?.[0] || null;
}

function computeMatch(meal, userIngredients) {
  const searchable = [
    meal.strMeal,
    meal.strCategory,
    meal.strArea,
    meal.strInstructions,
    ...Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`])
  ].join(' ').toLowerCase();
  const matched = userIngredients.filter((ingredient) => searchable.includes(ingredient.toLowerCase()));
  return {
    matched,
    percent: userIngredients.length ? Math.round((matched.length / userIngredients.length) * 100) : 0
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

// Shared search logic used by both the search box (/api/recipes/search)
// and the chat assistant (/api/chat), so both features behave the same way.
async function performSearch({ query, mode, cuisine, category }) {
  const cleanQuery = clean(query || '');
  const cleanCuisine = clean(cuisine || '');
  const cleanCategory = clean(category || '');
  const userIngredients = cleanQuery.split(',').map((x) => clean(x).toLowerCase()).filter(Boolean);
  let basics = [];

  if (mode === 'name' && cleanQuery) {
    basics = (await mealDb('search.php', { s: cleanQuery })).meals || [];
  } else if (cleanCategory) {
    basics = (await mealDb('filter.php', { c: cleanCategory })).meals || [];
  } else if (cleanCuisine) {
    basics = (await mealDb('filter.php', { a: cleanCuisine })).meals || [];
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
    basics = (await mealDb('search.php', { s: '' })).meals || [];
  }

  const detailMeals = (await Promise.all(basics.slice(0, 24).map((meal) => lookupMeal(meal.idMeal)))).filter(Boolean);
  let recipes = detailMeals.map((meal) => {
    const match = computeMatch(meal, userIngredients);
    return mapMeal(meal, match.percent, match.matched);
  });
  recipes = recipes.filter((recipe) => !EXCLUDED_CATEGORIES.has(recipe.category.toLowerCase()));
  if (cleanCuisine) recipes = recipes.filter((recipe) => recipe.cuisine.toLowerCase() === cleanCuisine.toLowerCase());
  if (cleanCategory) recipes = recipes.filter((recipe) => recipe.category.toLowerCase() === cleanCategory.toLowerCase());
  recipes.sort((a, b) => b.matchPercent - a.matchPercent || a.name.localeCompare(b.name));
  return { query: cleanQuery, recipes };
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
    const all = (await mealDb('list.php', { c: 'list' })).meals?.map((x) => x.strCategory) || [];
    filterCache.categories = all.filter((item) => !EXCLUDED_CATEGORIES.has(item.toLowerCase()));
  }
  if (!filterCache.cuisines) {
    filterCache.cuisines = (await mealDb('list.php', { a: 'list' })).meals?.map((x) => x.strArea) || [];
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
// Simple, explainable rule-based parsing (no paid AI model):
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

app.post('/api/chat', optionalAuth, async (req, res, next) => {
  try {
    const message = clean(req.body.message || '');
    if (!message) return res.status(400).json({ message: 'Type a message first' });
    if (message.length > 300) return res.status(400).json({ message: 'Message is too long' });

    const { categories, cuisines } = await getFilterLists();
    const parsed = parseChatMessage(message, categories, cuisines);

    if (!parsed.query && !parsed.cuisine && !parsed.category) {
      const reply = 'I did not catch any ingredients, cuisine, or category in that message. Try something like "tomato, onion and paneer", "Indian dessert", or "Italian with mushroom".';
      if (req.user) db.run('INSERT INTO search_history (user_id, search_query) VALUES (?, ?)', [req.user.id, message]).catch(() => {});
      return res.json({ reply, recipes: [] });
    }

    const result = await performSearch({ query: parsed.query, mode: 'ingredients', cuisine: parsed.cuisine, category: parsed.category });
    const recipes = result.recipes.slice(0, 6);
    const reply = buildChatReply({ query: parsed.query, cuisine: parsed.cuisine, category: parsed.category, recipes });

    if (req.user) {
      db.run('INSERT INTO search_history (user_id, search_query) VALUES (?, ?)', [req.user.id, message]).catch(() => {});
    }

    res.json({ reply, recipes });
  } catch (error) { next(error); }
});
app.get('/api/recipes/:id', async (req, res, next) => {
  try {
    const meal = await lookupMeal(req.params.id);
    if (!meal || EXCLUDED_CATEGORIES.has((meal.strCategory || '').toLowerCase())) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(mapMeal(meal));
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
