<div align="center">

# ✨ LAEL IQ ✨

### 🇮🇶 From Iraq To The World | من العراق إلى العالم

**Iraqi Luxury E-Commerce Platform**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

---

*متجر إلكتروني عراقي فاخر بتصميم أسود وذهبي متناسق، واجهة عربية أصيلة تدعم RTL بالكامل، ويعمل بنظام حفظ محلي localStorage متكامل دون أي اعتمادات خارجية.*

</div>

---

![LAEL IQ Screenshot](assets/images/hero.jpg)

---

## ✨ المميزات | Features

| Feature | Description |
|---|---|
| 🛍️ **كتالوج المنتجات (Catalog)** | عرض أنيق للمنتجات مع التصفية بالفئات والبحث الفوري |
| 🛒 **سلة التسوق (Shopping Cart)** | إدارة كميات المنتجات واحتساب التكاليف والخصومات فورياً |
| ❤️ **قائمة المفضلة (Wishlist)** | حفظ المنتجات والرجوع إليها في أي وقت |
| 💳 **نظام الدفع (Checkout)** | دعم الدفع عند الاستلام، والتحويل، وتجهيز الدفع الإلكتروني |
| 📦 **تتبع الطلبات (Orders)** | عرض سجل الطلبات وحالات الشحن والتوصيل للمستخدم |
| 🔐 **حسابات المستخدمين (Auth)** | تسجيل الدخول، إنشاء حساب، وإدارة الملف الشخصي |
| 🛠️ **لوحة تحكم الأدمن (Dashboard)** | إحصائيات المبيعات، إجمالي الطلبات، والمنتجات الأكثر طلباً |
| 📊 **إدارة المخزون (Inventory)** | متابعة الكميات المتاحة والتنبيه عند نفاد المخزون |
| 📂 **إدارة التصنيفات (Categories)** | إضافة وتعديل وحذف فئات وتصنيفات المنتجات |
| 🏷️ **العروض والخصومات (Offers)** | تعيين خصومات وعروض ترويجية وأسعار خاصة |
| 📱 **متجاوب بالكامل (Responsive)** | تصميم متناسق ومتقن لكافة الشاشات (الهواتف، الأجهزة اللوحية، الكمبيوتر) |
| 🌍 **واجهة عربية RTL** | تجربة مستخدم عربية كاملة بخط Cairo الفاخر |
| ✨ **تأثيرات الإضاءة الذهبية (Glow Effect)** | هالة مضيئة راقية تعكس هوية العلامة التجارية |

---

## 🛠️ التقنيات | Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | بنية الصفحات الدلالية للمتجر ولوحة التحكم |
| **CSS3** | التنسيق الفاخر، تأثيرات التوهج الذهبي، التوافقية والتجاوب مع الشاشات |
| **Vanilla JavaScript** | منطق المتجر، إدارة السلة والمفضلة، الحسابات والطلبات |
| **localStorage** | حفظ بيانات المنتجات، السلة، المفضلة، المستخدمين والطلبات محلياً |
| **Google Fonts (Cairo)** | خط عربي حديث وأنيق |

> **بدون أي اعتمادات خارجية (Zero Dependencies)** — افتح المتجر فوراً في أي متصفح!

---

## 📁 هيكل المشروع | Project Architecture

```
LAEL-IQ/
├── index.html                  # 🚀 صفحة التوجيه السريع للمتجر
├── public/                     # 🛍️ واجهة المتجر للعملاء (Storefront)
│   ├── index.html              # الصفحة الرئيسية
│   ├── product.html            # صفحة تفاصيل المنتج
│   ├── cart.html               # سلة المشتريات
│   ├── checkout.html           # إتمام الشراء والدفع
│   ├── payment.html            # صفحة الدفع الإلكتروني بالبطاقة
│   ├── order-success.html      # تأكيد نجاح الطلب
│   ├── orders.html             # طلباتي وتتبع مسار الطلب
│   ├── favorites.html          # قائمة المفضلة
│   ├── account.html            # الملف الشخصي وإدارة الحساب
│   └── login.html              # تسجيل الدخول وإنشاء حساب
├── admin/                      # 🔐 لوحة الإدارة والتحكم (Admin Panel)
│   ├── index.html              # لوحة التحكم والإحصائيات (Dashboard)
│   ├── login.html              # تسجيل دخول المسؤول
│   ├── products.html           # قائمة المنتجات والتحكم بها
│   ├── product.html            # إضافة وتعديل منتج
│   ├── orders.html             # إدارة وتحديث حالات الطلبات
│   ├── customers.html          # قائمة العملاء وسجل تعاملاتهم
│   ├── categories.html         # إدارة فئات وتصنيفات المتجر
│   ├── offers.html             # إدارة العروض والخصومات
│   ├── inventory.html          # إدارة ومتابعة المخزون
│   └── settings.html           # إعدادات المتجر وبيانات الاتصال
├── assets/                     # 🎨 الموارد الثابتة (Assets)
│   ├── css/
│   │   ├── style.css           # أنماط المتجر الأساسية
│   │   ├── auth.css            # أنماط صفحات الدخول والحساب
│   │   ├── glow.css            # طبقة التوهج الذهبي الفاخر
│   │   └── admin.css           # أنماط لوحة الإدارة
│   ├── js/
│   │   ├── app.js              # المحرك الأساسي للمتجر والسلة والمنتجات
│   │   ├── auth.js             # نظام الحسابات والمصادقة
│   │   ├── navbar.js           # مكون شريط التنقل والعدادات
│   │   ├── orders.js           # منطق صفحة الطلبات وتتبعها
│   │   ├── payment.js          # منطق صفحة الدفع الإلكتروني
│   │   └── admin-orders.js     # منطق إدارة الطلبات في لوحة الإدارة
│   └── images/
│       └── hero.jpg            # صورة البانر الترويجي للمتجر
├── docs/                       # 📚 التوثيق الفني
│   ├── API.md                  # توثيق نقاط اتصال بوابة الدفع (API)
│   └── SETUP.md                # دليل التشغيل والنشر
├── .github/                    # ⚙️ قوالب وإعدادات جيت هاب
│   └── ISSUE_TEMPLATE/
│       └── bug_report.md       # قالب الإبلاغ عن المشاكل
├── README.md                   # التوثيق الرئيسي للمشروع
├── LICENSE                     # ترخيص المشروع (MIT)
├── CONTRIBUTING.md              # إرشادات المساهمة والتطوير
├── CHANGELOG.md                 # سجل التحديثات والتغييرات
└── .gitignore                  # ملف استثناءات Git
```

---

## 🚀 التشغيل السريع | Quick Start

### 1. استنساخ المستودع (Clone)

```bash
git clone https://github.com/masrahxhhhd/lLAEL-IQ.git
cd lLAEL-IQ
```

### 2. فتح المتجر (Run Storefront)

يمكنك تشغيله بفتح `index.html` أو `public/index.html` مباشرة في المتصفح:

```bash
# على ويندوز
start index.html

# أو تشغيل خادم محلي خفيف
npx serve .
```

### 3. الدخول للوحة التحكم (Admin Access)

انتقل إلى `admin/login.html`:

| الحقل | القيمة الافتراضية |
|---|---|
| **كلمة المرور** | `LAEL-ADMIN` |

> ⚠️ يُنصح بتغيير كلمة المرور الافتراضية من صفحة الإعدادات (`admin/settings.html`).

---

## 💳 تكامل الدفع | Payment Integration

يدعم المتجر ثلاثة خيارات دفع:
1. **الدفع عند الاستلام (Cash On Delivery)** — يعمل بالكامل ومربوط بالنظام.
2. **التحويل الإلكتروني** — ينقل العميل تلقائياً إلى صفحة الدفع `payment.html`.
3. **الدفع بالبطاقات المصرفية** — الواجهة جاهزة ومؤمنة، ومجهزة للربط مع السيرفر عبر:
   ```http
   POST /api/payments/charge
   ```

للمزيد من التفاصيل حول صياغة الطلب واستجابة السيرفر، راجع [وثيقة الدفع API.md](docs/API.md).

---

## 📄 الرخصة | License

هذا المشروع مرخص تحت رخصة **MIT** — راجع ملف [LICENSE](LICENSE) لمزيد من التفاصيل.

---

<div align="center">

**LAEL IQ** — صُنع بـ ❤️ في العراق  
*Crafted with excellence from Iraq to the World*

</div>
