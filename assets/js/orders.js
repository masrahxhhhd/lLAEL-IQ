/* =====================================================
   LAEL IQ - ORDERS SYSTEM
   Orders Page
===================================================== */

(function () {

    "use strict";


    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const USER_KEY = "laelAuthUser";
    const ORDERS_KEY = "laelOrders";


    /* =====================================================
       GET CURRENT USER
    ===================================================== */

    function getCurrentUser() {

        try {

            const user = JSON.parse(
                localStorage.getItem(USER_KEY) || "null"
            );

            if (
                user &&
                typeof user === "object" &&
                user.loggedIn === true
            ) {

                return user;

            }

        } catch (error) {

            console.error(
                "LAEL IQ: خطأ في قراءة المستخدم",
                error
            );

        }

        return null;

    }


    /* =====================================================
       GET ALL ORDERS
    ===================================================== */

    function getOrders() {

        try {

            const orders = JSON.parse(
                localStorage.getItem(ORDERS_KEY) || "[]"
            );

            return Array.isArray(orders)
                ? orders
                : [];

        } catch (error) {

            console.error(
                "LAEL IQ: خطأ في قراءة الطلبات",
                error
            );

            return [];

        }

    }


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(value) {

        const number = Number(value) || 0;

        return (
            number.toLocaleString("en-US") +
            " IQD"
        );

    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(date) {

        if (!date) {

            return "تاريخ غير معروف";

        }

        try {

            return new Date(date).toLocaleString(
                "ar-IQ",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        } catch (error) {

            return String(date);

        }

    }


    /* =====================================================
       ESCAPE HTML
       حماية النصوص القادمة من LocalStorage
    ===================================================== */

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       PRICE FROM PRODUCT
    ===================================================== */

    function getProductPrice(value) {

        return Number(
            String(value ?? "")
                .replace(/[^0-9]/g, "")
        ) || 0;

    }


    /* =====================================================
       ORDER STATUS
    ===================================================== */

    function getOrderStatus(order) {

        if (
            order &&
            order.status
        ) {

            return String(order.status);

        }

        return "قيد المراجعة";

    }


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    function getStatusClass(status) {

        const value =
            String(status || "")
                .trim()
                .toLowerCase();

        if (
            value.includes("مكتمل") ||
            value.includes("تم التسليم") ||
            value.includes("delivered") ||
            value.includes("completed")
        ) {

            return "status-completed";

        }

        if (
            value.includes("ملغي") ||
            value.includes("ملغى") ||
            value.includes("cancel") ||
            value.includes("رفض")
        ) {

            return "status-cancelled";

        }

        if (
            value.includes("تجهيز") ||
            value.includes("processing")
        ) {

            return "status-processing";

        }

        if (
            value.includes("شحن") ||
            value.includes("طريق") ||
            value.includes("shipping") ||
            value.includes("shipped")
        ) {

            return "status-shipping";

        }

        return "status-pending";

    }


    /* =====================================================
       PRODUCT HTML
    ===================================================== */

    function createProductHTML(product) {

        if (!product) {

            return "";

        }


        const name =
            escapeHtml(
                product.name || "منتج"
            );


        const quantity =
            Math.max(
                1,
                Number(product.quantity) || 1
            );


        const unitPrice =
            getProductPrice(
                product.price
            );


        const totalPrice =
            unitPrice * quantity;


        let imageHTML;


        if (product.image) {

            imageHTML = `
                <img
                    src="${escapeHtml(product.image)}"
                    alt="${name}"
                    loading="lazy"
                    onerror="this.style.display='none';this.parentElement.classList.add('image-error');"
                >
            `;

        } else {

            imageHTML = `
                <span class="order-product-placeholder">
                    💻
                </span>
            `;

        }


        return `

            <div class="order-product">

                <div class="order-product-image">

                    ${imageHTML}

                </div>


                <div class="order-product-info">

                    <strong>
                        ${name}
                    </strong>

                    <small>
                        الكمية:
                        ${quantity}
                    </small>

                </div>


                <div class="order-product-price">

                    ${formatPrice(totalPrice)}

                </div>

            </div>

        `;

    }


    /* =====================================================
       CREATE ORDER CARD
    ===================================================== */

    function createOrderCard(order) {

        const card =
            document.createElement("article");


        card.className =
            "order-card";


        const products =
            Array.isArray(order.products)
                ? order.products
                : [];


        const status =
            getOrderStatus(order);


        const statusClass =
            getStatusClass(status);


        const productsHTML =
            products.length

                ? products
                    .map(createProductHTML)
                    .join("")

                : `

                    <div class="order-no-products">

                        لا توجد تفاصيل للمنتجات

                    </div>

                `;


        const orderId =
            escapeHtml(
                order.id || "LAEL-ORDER"
            );


        const orderDate =
            formatDate(order.date);


        const payment =
            order.payment === "transfer"

                ? "🏦 تحويل إلكتروني"

                : "💵 الدفع عند الاستلام";


        const total =
            formatPrice(order.total);


        card.innerHTML = `

            <!-- ORDER HEADER -->

            <div class="order-header">

                <div class="order-number">

                    <span>
                        رقم الطلب
                    </span>

                    <strong>
                        ${orderId}
                    </strong>

                </div>


                <div class="order-status ${statusClass}">

                    <span class="status-dot"></span>

                    ${escapeHtml(status)}

                </div>

            </div>


            <!-- ORDER INFO -->

            <div class="order-meta">

                <div class="order-meta-item">

                    <span class="meta-icon">
                        📅
                    </span>

                    <div>

                        <small>
                            تاريخ الطلب
                        </small>

                        <strong>
                            ${escapeHtml(orderDate)}
                        </strong>

                    </div>

                </div>


                <div class="order-meta-item">

                    <span class="meta-icon">
                        💳
                    </span>

                    <div>

                        <small>
                            طريقة الدفع
                        </small>

                        <strong>
                            ${payment}
                        </strong>

                    </div>

                </div>

            </div>


            <!-- PRODUCTS -->

            <div class="order-products-section">

                <div class="order-section-title">

                    <div>

                        <span>
                            المنتجات
                        </span>

                        <small>
                            ${products.length}
                            ${products.length === 1 ? "منتج" : "منتجات"}
                        </small>

                    </div>

                </div>


                <div class="order-products">

                    ${productsHTML}

                </div>

            </div>


            <!-- ORDER FOOTER -->

            <div class="order-footer">

                <div>

                    <span>
                        المجموع النهائي
                    </span>

                    <strong>
                        ${total}
                    </strong>

                </div>


                <div class="order-footer-icon">

                    ✓

                </div>

            </div>

        `;


        return card;

    }


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    function showEmptyState() {

        const container =
            document.getElementById(
                "ordersContainer"
            );


        const empty =
            document.getElementById(
                "ordersEmpty"
            );


        if (!container || !empty) {

            return;

        }


        container.innerHTML = "";


        empty.style.display =
            "block";

    }


    /* =====================================================
       LOGIN REQUIRED
    ===================================================== */

    function showLoginRequired() {

        const container =
            document.getElementById(
                "ordersContainer"
            );


        const empty =
            document.getElementById(
                "ordersEmpty"
            );


        if (!container || !empty) {

            return;

        }


        empty.style.display =
            "none";


        container.innerHTML = `

            <div class="orders-login-box">

                <div class="orders-login-icon">
                    🔐
                </div>

                <h2>
                    سجل دخولك أولاً
                </h2>

                <p>
                    يجب تسجيل الدخول حتى تتمكن
                    من مشاهدة طلباتك.
                </p>

                <a href="account.html">
                    تسجيل الدخول
                </a>

            </div>

        `;

    }


    /* =====================================================
       RENDER ORDERS
    ===================================================== */

    function renderOrders() {

        const container =
            document.getElementById(
                "ordersContainer"
            );


        const empty =
            document.getElementById(
                "ordersEmpty"
            );


        if (!container || !empty) {

            return;

        }


        const user =
            getCurrentUser();


        /* -----------------------------------------------
           USER NOT LOGGED IN
        ------------------------------------------------ */

        if (!user) {

            showLoginRequired();

            return;

        }


        /* -----------------------------------------------
           GET ORDERS
        ------------------------------------------------ */

        const allOrders =
            getOrders();


        /* -----------------------------------------------
           ONLY THIS USER ORDERS
        ------------------------------------------------ */

        const userOrders =
            allOrders.filter(
                function (order) {

                    return (
                        order &&
                        String(order.userId || "") ===
                        String(user.id || "")
                    );

                }
            );


        /* -----------------------------------------------
           NO ORDERS
        ------------------------------------------------ */

        if (!userOrders.length) {

            showEmptyState();

            return;

        }


        /* -----------------------------------------------
           HIDE EMPTY
        ------------------------------------------------ */

        empty.style.display =
            "none";


        container.innerHTML =
            "";


        /* -----------------------------------------------
           NEWEST FIRST
        ------------------------------------------------ */

        userOrders.sort(
            function (a, b) {

                return (
                    new Date(b.date || 0) -
                    new Date(a.date || 0)
                );

            }
        );


        /* -----------------------------------------------
           RENDER
        ------------------------------------------------ */

        userOrders.forEach(
            function (order) {

                container.appendChild(
                    createOrderCard(order)
                );

            }
        );

    }


    /* =====================================================
       UPDATE WHEN STORAGE CHANGES
    ===================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key === ORDERS_KEY ||
                event.key === USER_KEY
            ) {

                renderOrders();

            }

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initOrders() {

        renderOrders();

    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initOrders,
            { once: true }
        );

    } else {

        initOrders();

    }


    /* =====================================================
       GLOBAL FUNCTION
    ===================================================== */

    window.LAEL_renderOrders =
        renderOrders;


})();