# 📋 Changelog | سجل التغييرات

All notable changes to the **LAEL IQ** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2024-01-01

### 🎉 Initial Release | الإصدار الأول

The first public release of LAEL IQ — a luxury Iraqi e-commerce platform.

### ✨ Added | المميزات المضافة

#### Storefront | واجهة المتجر
- **Homepage** with hero section, featured products, and category showcase
- **Product Catalog** with grid view, search, and category filtering
- **Product Details** page with image gallery, pricing in IQD, and add-to-cart
- **Shopping Cart** with quantity management, price calculation, and item removal
- **Favorites / Wishlist** to save products for later
- **Checkout System** with three payment methods:
  - 💵 Cash on Delivery (الدفع عند الاستلام)
  - 💳 Card Payment (frontend ready, backend pending)
  - 🏦 Bank Transfer (frontend ready, backend pending)
- **Order History** with status tracking (pending → processing → shipped → delivered)
- **User Authentication** — registration, login, profile management
- **Responsive Design** — mobile, tablet, and desktop layouts

#### Admin Panel | لوحة التحكم
- **Admin Dashboard** with sales overview and statistics
- **Product Management** — add, edit, delete products with images and pricing
- **Category Management** — create and organize product categories
- **Order Management** — view, update status, and manage customer orders
- **Offers & Discounts** — create promotional pricing and discount campaigns
- **Inventory Management** — stock tracking with low-stock alerts

#### Design & UX | التصميم وتجربة المستخدم
- **Black & Gold** luxury color scheme throughout
- **RTL Arabic Interface** — full right-to-left layout and Arabic typography
- **Golden Glow Effects** — signature hover animations and visual accents
- **Google Fonts Cairo** — Arabic-optimized font rendering
- **Smooth Transitions** — page elements with elegant animation effects

#### Technical | التقنيات
- Pure **HTML5**, **CSS3**, and **Vanilla JavaScript** — zero dependencies
- **localStorage** persistence for all data (products, users, cart, orders)
- **No build step** required — open and run
- Payment API integration point ready at `POST /api/payments/charge`

---

<div align="center">

**LAEL IQ** — صُنع بـ ❤️ في العراق

</div>
