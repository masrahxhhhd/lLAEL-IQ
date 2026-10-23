# 🚀 Setup & Deployment Guide | دليل التثبيت والنشر

---

## 📋 Prerequisites | المتطلبات

| Requirement | Details |
|---|---|
| **Modern Web Browser** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Text Editor** (optional) | VS Code, Sublime Text, or any editor of your choice |

> **That's it!** LAEL IQ is a pure HTML/CSS/JS project — no Node.js, no package managers, no build tools required.

---

## 💻 Local Development | التطوير المحلي

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/your-username/LAEL-IQ-GLOW.git
cd LAEL-IQ-GLOW
```

2. **Open the storefront**

Simply open `public/index.html` in your browser:

```bash
# Windows
start public/index.html

# macOS
open public/index.html

# Linux
xdg-open public/index.html
```

3. **That's it!** The store is running. 🎉

### Using a Local Server (Optional)

For a more realistic development experience, you can use a simple HTTP server:

**Python:**
```bash
# Python 3
python -m http.server 8000

# Then visit http://localhost:8000/public/index.html
```

**VS Code:**
Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `public/index.html`, and select "Open with Live Server".

**Node.js (if available):**
```bash
npx serve .
# Then visit http://localhost:3000/public/index.html
```

---

## 🔐 Admin Access | الوصول للوحة التحكم

### Accessing the Admin Panel

1. Navigate to `admin/login.html`
2. Enter the default password:

| Field | Value |
|---|---|
| **Password** | `LAEL-ADMIN` |

3. You'll be redirected to `admin/dashboard.html`

### Admin Capabilities

Once logged in, you can:

- 📊 View sales dashboard and statistics
- 📦 Add, edit, and delete products
- 📂 Manage product categories
- 📋 View and update order statuses
- 🏷️ Create offers and discounts
- 📊 Monitor inventory and stock levels

> ⚠️ **Security:** Change the default admin password immediately after first login. The password is stored in localStorage — for production use, implement proper server-side authentication.

---

## 🌐 GitHub Pages Deployment | النشر على GitHub Pages

Deploy LAEL IQ for free using GitHub Pages:

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial release of LAEL IQ"
git branch -M main
git remote add origin https://github.com/your-username/LAEL-IQ-GLOW.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Click **Save**

### Step 3: Access Your Site

Your site will be live at:

```
https://your-username.github.io/LAEL-IQ-GLOW/public/index.html
```

> **Tip:** It may take 1–2 minutes for the site to become available after enabling Pages.

### Setting the Root Page

To make `public/index.html` the landing page, create an `index.html` at the repository root that redirects:

```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=public/index.html">
</head>
<body>
    <p>Redirecting to <a href="public/index.html">LAEL IQ</a>...</p>
</body>
</html>
```

---

## 🌍 Custom Domain Setup | إعداد النطاق المخصص

### Step 1: Buy a Domain

Purchase a domain from any registrar (e.g., Namecheap, GoDaddy, Google Domains).

Suggested domains:
- `laeliq.com`
- `lael-iq.com`
- `laeliq.store`

### Step 2: Configure DNS

Add the following DNS records at your domain registrar:

**For apex domain (e.g., `laeliq.com`):**

| Type | Name | Value |
|---|---|---|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |

**For subdomain (e.g., `www.laeliq.com`):**

| Type | Name | Value |
|---|---|---|
| CNAME | www | `your-username.github.io` |

### Step 3: Configure in GitHub

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `laeliq.com`)
3. Click **Save**
4. ✅ Check **Enforce HTTPS** (after DNS propagation)

### Step 4: Add CNAME File

Create a `CNAME` file in the repository root:

```
laeliq.com
```

> DNS propagation may take up to 24–48 hours.

---

## 📁 Project File Overview

| Directory | Purpose |
|---|---|
| `public/` | All customer-facing storefront pages |
| `admin/` | Admin panel pages |
| `assets/css/` | Stylesheets (main, admin, animations) |
| `assets/js/` | JavaScript modules (app, cart, auth, etc.) |
| `assets/images/` | Product images and UI assets |
| `docs/` | Documentation (API reference, this guide) |
| `.github/` | GitHub templates (issue templates) |

---

## 🔧 Troubleshooting | استكشاف الأخطاء

### Page not loading?
- Ensure you're opening `public/index.html`, not just the folder
- Try using a local HTTP server instead of `file://` protocol
- Check the browser console (F12) for errors

### Data not persisting?
- LAEL IQ uses `localStorage` — ensure it's not disabled in your browser
- Private/incognito mode may clear localStorage on close
- Check if storage quota is exceeded (typically 5–10 MB)

### Admin login not working?
- Default password is `LAEL-ADMIN` (case-sensitive)
- Clear localStorage and try again: open browser console and run `localStorage.clear()`
- Re-open `admin/login.html`

### Styles look broken?
- Ensure all CSS files are present in `assets/css/`
- Check that file paths are correct (case-sensitive on some servers)
- Try hard-refreshing: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (macOS)

---

<div align="center">

**LAEL IQ** — من العراق إلى العالم

</div>
