# The Mysterious Jacobian Conjecture — Interactive Journal Article

An interactive publication explaining the **Jacobian Conjecture**—one of algebraic geometry's most famous unsolved problems formulated by Ott-Heinrich Keller in 1936.

Styled like a modern interactive scientific journal (Distill.pub / Quanta Magazine), with KaTeX math rendering, interactive 2D grid transformation visualizers, real-time matrix determinant inspectors, counterexample analysis (Sergey Pinchuk 1994), degree reduction sandboxes, and an interactive quiz.

---

## 🚀 How to Host on GitHub Pages (Free)

### Method 1: Automatic Deployment via GitHub Actions (Recommended)

1. Create a new repository on GitHub (e.g. `jacobian-conjecture`).
2. Push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Jacobian Conjecture Interactive Journal"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```
3. Enable GitHub Pages:
   - Go to your GitHub repository **Settings** -> **Pages**.
   - Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. That's it! GitHub Actions will automatically build and deploy your site to:
   `https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`

---

### Method 2: Manual Deployment via `npm run deploy`

If you prefer deploying directly from your local terminal:

1. Ensure your repository remote is configured on GitHub.
2. Run:
   ```bash
   npm run deploy
   ```
3. In GitHub Repository **Settings** -> **Pages**, select **Deploy from a branch** and pick `gh-pages` branch.

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## 📚 References & Bibliography

- **Keller, O.-H. (1936)**. "Ganze Cremona-Transformationen". *Monatshefte für Mathematik und Physik*.
- **Bass, H., Connell, E. H., & Wright, D. (1982)**. "The Jacobian conjecture: reduction of degree and formal expansion of the inverse". *Bulletin of the AMS*.
- **Pinchuk, S. (1994)**. "A counterexample to the real Jacobian conjecture". *Mathematische Zeitschrift*.
- **Belov-Kanel, A., & Kontsevich, M. (2007)**. "The Jacobian conjecture is stably equivalent to the Dixmier conjecture". *Moscow Mathematical Journal*.
- [Wikipedia: Jacobian Conjecture](https://en.wikipedia.org/wiki/Jacobian_conjecture)
