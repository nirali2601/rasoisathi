# Deploying RasoiSathi AI

This project consists of an Angular frontend and an Express backend API with a SQLite database. 
Since the backend uses a local SQLite database, deploying the entire app as a single service on Vercel is not supported (due to its serverless nature and read-only ephemeral file system).

The recommended architecture is:
1. **Backend (Express + SQLite):** Deployed on **Render** (free tier).
2. **Frontend (Angular):** Deployed on **GitHub Pages** (or optionally **Vercel** pointing to the Render API).

---

## Step 1: Deploy Backend to Render

1. Sign in to [Render](https://render.com/).
2. Click **New** → **Web Service**.
3. Connect your GitHub repository (`github.com/nirali2601/rasoisathi`).
4. Configure the Web Service settings:
   - **Name:** `rasoisathi` (so the URL becomes `https://rasoisathi.onrender.com`)
   - **Region:** Choose the region closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave blank (it is at the repo root)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run api`
   - **Instance Type:** `Free`
5. Set Environment Variables under the **Environment** tab:
   - `JWT_SECRET` → *A long, secure random string (e.g. your own custom secret key)*
   - `NODE_ENV` → `production`
   - `CLIENT_URL` → `https://nirali2601.github.io` (or your Vercel URL if deploying there)
6. Click **Deploy Web Service**.

> [!WARNING]
> **Free-tier ephemeral storage:** SQLite writes data to a local file (`server/data/rasoisathi.sqlite`). Render's free tier has an ephemeral file system, meaning the database resets when the web service spins down, restarts, or is redeployed. For a placement-demo project, this is usually acceptable.

---

## Step 2: Deploy Frontend to GitHub Pages

GitHub Pages doesn't automatically route requests for single-page applications. Follow these steps to configure and build the frontend correctly:

1. Install the GitHub Pages deployment tool locally in the project root:
   ```bash
   npm install -D angular-cli-ghpages
   ```

2. Build the production application with the base URL configured for your GitHub Pages repository subfolder (`/rasoisathi/`):
   ```bash
   npx ng build --configuration production --base-href /rasoisathi/
   ```

3. Duplicate the main `index.html` to `404.html` so that direct navigation and page reloads route correctly:
   ```bash
   cp dist/rasoisathi-ai/browser/index.html dist/rasoisathi-ai/browser/404.html
   ```

4. Deploy the build outputs to the `gh-pages` branch of your repository:
   ```bash
   npx angular-cli-ghpages --dir=dist/rasoisathi-ai/browser
   ```

5. Go to your GitHub Repository → **Settings** → **Pages**:
   - Under **Build and deployment**, ensure the **Source** is set to **Deploy from a branch**.
   - Under **Branch**, select `gh-pages` and `/ (root)`.
   - Click **Save**.

Your frontend will be live at `https://nirali2601.github.io/rasoisathi/`.

---

## Step 3: Alternative Frontend Deployment (Vercel)

If you prefer to deploy the frontend to **Vercel** instead of GitHub Pages:

1. Import your repository in the Vercel dashboard.
2. In the Project Settings:
   - **Framework Preset:** `Other` (or Angular, but ensure output paths are configured correctly)
   - **Root Directory:** Leave blank (or root)
   - **Build Command:** `ng build` (will default base href to `/`)
   - **Output Directory:** `dist/rasoisathi-ai/browser`
3. Click **Deploy**.
4. In your Render Web Service environment variables, update `CLIENT_URL` to match your Vercel URL.
