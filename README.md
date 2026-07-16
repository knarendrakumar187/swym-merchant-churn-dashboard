# Merchant Churn Risk Dashboard

A simple dashboard that flags e-commerce SaaS merchants at risk of churning and recommends a next step for each one.

See [spec.md](./spec.md) for full requirements and [progress.md](./progress.md) for build status.

## Run locally

```bash
node verify-phase4.js
```

Runs 30 automated checks (risk tiers, recommendations, filter, sort).

### Option A — VS Code Live Server

1. Open this folder in VS Code / Cursor.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html` → **Open with Live Server**.
4. The page opens at `http://127.0.0.1:5500` (port may vary).

### Option B — npx serve

```bash
npx serve .
```

Open the URL printed in the terminal (usually `http://localhost:3000`).

### Option C — Python (if installed)

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy to GitHub Pages

Static site — deploy directly from the `main` branch (no build step).

### One-time setup

1. Open repo **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **`main`** and folder **`/ (root)`**.
4. Click **Save**. The site is live in ~1–2 minutes at the URL below.

> **Note:** GitHub Actions deployment requires a PAT with `workflow` scope. Branch deploy is used for this project instead.

## Project structure

```
sywm/
├── index.html
├── css/styles.css
├── js/
│   ├── data.js      # Mock merchant data
│   ├── risk.js      # Risk scoring + recommendations
│   └── app.js       # UI logic
├── spec.md
├── progress.md
└── README.md
```

## Live demo

**https://knarendrakumar187.github.io/swym-merchant-churn-dashboard/**

*(Enable Pages under Settings → Pages → branch `main` / `(root)` if you see a 404.)*
