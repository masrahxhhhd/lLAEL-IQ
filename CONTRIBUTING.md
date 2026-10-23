# 🤝 Contributing to LAEL IQ | المساهمة في لائل آي كيو

Thank you for your interest in contributing to **LAEL IQ**! We welcome contributions from everyone.

---

## 📋 How to Contribute

### 1. Fork the Repository

Click the **Fork** button at the top right of the repository page to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/your-username/LAEL-IQ-GLOW.git
cd LAEL-IQ-GLOW
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use a descriptive branch name:
- `feature/search-filters` — for new features
- `fix/cart-total-bug` — for bug fixes
- `docs/update-readme` — for documentation changes
- `style/button-hover-effect` — for styling changes

### 4. Make Your Changes

Edit the code, test it locally by opening `public/index.html` in your browser, and ensure everything works.

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add product search filters"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | CSS/styling changes (no logic change) |
| `refactor:` | Code restructuring (no feature/fix) |
| `chore:` | Maintenance tasks |

### 6. Push and Open a Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a **Pull Request** on GitHub against the `main` branch.

---

## 🎨 Code Style Guidelines

### General
- **No frameworks or libraries** — this project is pure HTML, CSS, and JavaScript.
- Keep code clean, readable, and well-organized.
- Use meaningful variable and function names.

### HTML
- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- Always include `dir="rtl"` and `lang="ar"` on Arabic pages.
- Use descriptive `alt` attributes on all images.

### CSS
- **RTL-first design** — all layouts should work right-to-left by default.
- Follow the existing black & gold color scheme:
  - Background: `#0a0a0a`, `#1a1a1a`
  - Gold: `#d4af37`, `#f4e5b2`
  - Text: `#ffffff`, `#cccccc`
- Use CSS custom properties (variables) defined in the project.
- Mobile-first responsive approach with `min-width` media queries.

### JavaScript
- Use vanilla JavaScript only — no jQuery, no React, no frameworks.
- Use `const` and `let` — never `var`.
- Use modern ES6+ features (arrow functions, template literals, destructuring).
- All data persistence goes through `localStorage`.

### Comments
- **Arabic comments are welcome!** 🇮🇶
- Write comments in whichever language you're most comfortable with.
- Use JSDoc-style comments for functions:

```javascript
/**
 * إضافة منتج إلى سلة التسوق
 * Add a product to the shopping cart
 * @param {string} productId - معرّف المنتج
 * @param {number} quantity - الكمية
 */
function addToCart(productId, quantity) {
    // ...
}
```

---

## 🐛 Reporting Bugs | الإبلاغ عن الأخطاء

Found a bug? Please [open an issue](../../issues/new?template=bug_report.md) with:

1. **Description** — what happened vs. what you expected
2. **Steps to reproduce** — how to trigger the bug
3. **Browser & OS** — which browser and operating system you're using
4. **Screenshots** — if applicable, attach screenshots

---

## 💡 Requesting Features | طلب ميزات جديدة

Have an idea? [Open an issue](../../issues/new) with the label `enhancement` and describe:

1. What feature you'd like to see
2. Why it would be useful
3. Any mockups or examples

---

## 📜 Code of Conduct

- Be respectful and inclusive.
- Welcome newcomers and help them get started.
- Focus on constructive feedback.
- Celebrate contributions of all sizes.

---

## 🙏 Thank You!

Every contribution — whether it's fixing a typo, improving a style, or adding a new feature — makes LAEL IQ better. **شكراً لمساهمتك!**

---

<div align="center">

**LAEL IQ** — من العراق إلى العالم

</div>
