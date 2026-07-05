# RasoiSathi AI

Smart recipe recommendation app built with Angular 21, Node.js, Express, SQLite, JWT authentication, and the free TheMealDB API.

## Features

- User registration and login with JWT
- Strong password validation
- Search recipes by ingredients or recipe name
- Filter by cuisine and category
- Recipe match percentage algorithm
- Recipe details with image, ingredients, measurements, and instructions
- Save and remove favorite recipes
- Search history for logged-in users
- Profile update and password change
- **Chat Assistant** — a conversational way to ask for recipes (see below)
- Responsive Angular Material UI with a simple, uncluttered design
- SQLite database with schema included

## Chat Assistant (new)

A `/chat` page lets the user type a normal sentence instead of filling the search form, for example:

- `I have tomato, onion and paneer`
- `suggest an Indian dessert`
- `something Italian with mushroom`

**How it works (rule-based, no paid AI model):**

1. The backend keeps a small in-memory list of TheMealDB's known categories (e.g. `Dessert`, `Vegetarian`) and cuisines (e.g. `Indian`, `Italian`), fetched once and cached.
2. It checks the typed sentence for any of those exact words.
3. It removes a large list of common filler/question words from what's left (`I`, `have`, `please`, `recipe`, `tonight`, `what`, `hungry`, contractions like `I'm`/`don't`, etc.).
4. Whatever plain words remain (3+ letters) are treated as ingredients.
5. If nothing usable is found (e.g. the message was just "hello"), the assistant asks for more detail instead of running a random search.
6. The parsed `{ ingredients, cuisine, category }` is passed into the **same search function** used by the normal Search page, so chat results are always consistent with manual search results.
7. The assistant replies with a short sentence plus up to 6 matching recipe cards, ranked by how many of the typed ingredients each recipe actually contains.

This keeps the feature fully explainable — it's straightforward string parsing plus the existing ingredient-match algorithm, not a black-box AI call.

The chat endpoint works for guests too. If the user is logged in, each chat message is also saved to their search history.

## Vegetarian-friendly catalogue

Beef recipes are filtered out everywhere in this app: the category dropdown, ingredient/name/cuisine search results, chat results, and even direct recipe-detail links. This is done in one place on the backend (`EXCLUDED_CATEGORIES` in `server/index.js`), so it can't be bypassed from the frontend.

## Better ingredient matching

TheMealDB's `filter.php` endpoint only accepts one ingredient per call. Earlier versions of this app only searched using the *first* ingredient typed, so results could miss recipes that matched better on the second or third ingredient. The search (and chat) now look up each of the first 3 typed ingredients separately, merge the results, and rank recipes that match more ingredients higher — before computing the final match percentage.

## Free Recipe API

This project uses TheMealDB only. It does not use Spoonacular, Groq, or paid API keys.

The backend calls:

- `search.php?s=` for recipe name search
- `lookup.php?i=` for details
- `filter.php?i=` for ingredient search
- `filter.php?c=` for category filter
- `filter.php?a=` for cuisine filter
- `list.php?c=list` and `list.php?a=list` for dropdown filters (cached in memory after the first call)

## Recommendation Logic

When a user enters ingredients such as `tomato,onion,paneer`, the backend fetches candidate meals from TheMealDB, opens each recipe detail, counts matched ingredients, and sorts by:

```text
Match % = (Matched Ingredients / Total User Ingredients) * 100
```

This is simple, explainable, and suitable for an examiner because it does not depend on a paid AI model. The Chat Assistant reuses this exact same function.

## Run Locally

```bash
npm install
npm start
```

Open:

- Frontend: http://localhost:4200
- Backend health check: http://localhost:4000/api/health

For separate terminals:

```bash
npm run api
npm run client
```

## Test Account Flow

1. Register with a password like `Recipe@123`
2. Search ingredients: `tomato,onion`
3. Open a recipe details page
4. Save a favorite
5. Open Favorites and Profile
6. Open **Chat** and type: `I have tomato, onion and paneer`

## Backend API Documentation

### Auth

`POST /api/auth/register`

```json
{ "name": "Nirali", "email": "nirali@example.com", "password": "Recipe@123" }
```

`POST /api/auth/login`

```json
{ "email": "nirali@example.com", "password": "Recipe@123" }
```

`GET /api/auth/profile` requires `Authorization: Bearer TOKEN`.

`PUT /api/auth/profile` requires token.

```json
{ "name": "New Name" }
```

`PUT /api/auth/password` requires token.

```json
{ "currentPassword": "Recipe@123", "newPassword": "NewRecipe@123" }
```

### Recipes

`POST /api/recipes/search`

```json
{ "query": "tomato,onion", "mode": "ingredients", "cuisine": "Indian", "category": "Vegetarian" }
```

`GET /api/recipes/:id`

`GET /api/recipes/categories`

`GET /api/recipes/cuisines`

### Chat

`POST /api/chat` — no token required, but if a token is sent, the message is saved to that user's search history.

```json
{ "message": "I have tomato, onion and paneer" }
```

Response:

```json
{ "reply": "Based on ingredients tomato, onion, paneer, here are 6 recipes. \"Paneer Tikka\" is the closest match at 100% ingredients matched.", "recipes": [ ] }
```

### Favorites

All favorites routes require a JWT token.

`POST /api/favorites`

```json
{ "id": "52772", "name": "Teriyaki Chicken", "image": "https://..." }
```

`GET /api/favorites`

`DELETE /api/favorites/:id`

### Search History

`POST /api/history`

```json
{ "search_query": "tomato,onion" }
```

`GET /api/history`

## SQLite Schema

See `server/schema.sql`.

Tables:

- `users`
- `favorites`
- `search_history`

The database file is created automatically at `server/data/rasoisathi.sqlite`.

## Project Structure

```text
server/
  db.js
  index.js
  schema.sql
src/app/
  core/
    guards/
    interceptors/
    services/
    stores/
  features/
    auth/
    chat/            <- new: Chat Assistant page
    favorites/
    home/
    not-found/
    profile/
    recipe-details/
    recipe-search/
  models/
src/environments/
```

## Troubleshooting

**`npm install` fails while building `sqlite3`**
This package compiles a small native module the first time it installs. If your machine has no internet access to GitHub during install, or you're on Windows without build tools, the compile step can fail. Fixes, in order of ease:

- Re-run `npm install` on a normal internet connection (most common fix — it downloads a prebuilt binary and does not need to compile anything).
- On Windows, install the "Desktop development with C++" workload from Visual Studio Build Tools, then re-run `npm install`.
- Make sure you're on Node.js 18 or newer (`node -v`).

**Production build (`npm run build`) fails with a "font inlining" or `403` error**
This happens only if the machine building the app cannot reach `fonts.googleapis.com` (for example, a restricted college lab network). Font inlining at build time has already been switched off in `angular.json` (`optimization.fonts: false`) so this should no longer occur; the fonts still load normally from Google Fonts in the browser at runtime. If you ever see this again, it means the build machine has no internet access at all — connect to the internet and rebuild.

**Search or Chat returns no recipes / a network error**
TheMealDB is a public, free API with no key, but it occasionally rate-limits or is briefly unreachable. Reload the page or search again after a few seconds. Check `http://localhost:4000/api/health` to confirm the backend itself is running.

**"Login required" errors on Favorites/Profile/Chat history**
These routes need a JWT. Log in first — the token is stored in the browser's `localStorage` and attached automatically to every request afterwards by `auth.interceptor.ts`.

**Chat gives a "did not catch any ingredients" reply**
This is intentional — it means the message didn't contain a recognizable ingredient, cuisine, or category (e.g. just "hi" or "thanks"). Rephrase with an ingredient, cuisine, or category, e.g. "chicken and rice" or "Mexican food".

## Examiner Explanation

RasoiSathi AI is a full-stack recipe recommendation app. Angular handles UI, routes, forms, guards, and state with Signals. Express handles secure APIs, JWT auth, SQLite storage, and TheMealDB integration. The recommendation score is calculated by comparing user-entered ingredients with ingredients found in each recipe, then sorting the highest match first. The Chat Assistant is a thin, rule-based layer on top of the same search function — it looks for known category/cuisine words in the sentence and treats the remaining words as ingredients, so it can be explained line-by-line without referencing any AI model.
