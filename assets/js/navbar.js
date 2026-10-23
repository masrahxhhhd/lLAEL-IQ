/* =====================================================
   LAEL IQ - NAVBAR SYSTEM
   CART + FAVORITES + ACCOUNT
===================================================== */

(function () {

    "use strict";

    const CART_KEY = "laelCart";
    const FAVORITES_KEY = "laelFavorites";
    const USER_KEY = "laelAuthUser";


    /* =====================================================
       CART
    ===================================================== */

    function getCart() {

        try {

            const data = JSON.parse(
                localStorage.getItem(CART_KEY) || "[]"
            );

            return Array.isArray(data) ? data : [];

        } catch (e) {

            return [];

        }

    }


    function getCartCount() {

        return getCart().reduce(function (total, item) {

            const quantity =
                Number(item?.quantity) || 1;

            return total + Math.max(1, quantity);

        }, 0);

    }


    /* =====================================================
       FAVORITES
    ===================================================== */

    function getFavorites() {

        try {

            const data = JSON.parse(
                localStorage.getItem(FAVORITES_KEY) || "[]"
            );

            return Array.isArray(data) ? data : [];

        } catch (e) {

            return [];

        }

    }


    function getFavoriteCount() {

        return getFavorites().length;

    }


    /* =====================================================
       ACCOUNT
    ===================================================== */

    function getLoggedUser() {

        try {

            const raw =
                localStorage.getItem(USER_KEY);

            if (!raw) {
                return null;
            }

            const user = JSON.parse(raw);

            if (
                user &&
                typeof user === "object" &&
                user.loggedIn === true
            ) {

                return user;

            }

            return null;

        } catch (e) {

            return null;

        }

    }


    /* =====================================================
       UPDATE CART + FAVORITES
    ===================================================== */

    function updateCounters() {

        const cartCount =
            document.getElementById("cartCount");

        const favoriteCount =
            document.getElementById("favoriteCount");


        const cartTotal =
            getCartCount();

        const favoriteTotal =
            getFavoriteCount();


        if (cartCount) {

            cartCount.textContent = cartTotal;

            cartCount.classList.toggle("show", cartTotal > 0);
            cartCount.style.display = cartTotal > 0 ? "flex" : "none";

        }


        if (favoriteCount) {

            favoriteCount.textContent =
                favoriteTotal;

            favoriteCount.classList.toggle("show", favoriteTotal > 0);
            favoriteCount.style.display = favoriteTotal > 0 ? "flex" : "none";

        }

    }


    /* =====================================================
       UPDATE ACCOUNT
    ===================================================== */

    function updateAccount() {

        const accountLink =
            document.getElementById("accountLink");

        const accountText =
            document.getElementById("accountText");

        if (!accountLink) {
            return;
        }

        const user = getLoggedUser();

        accountLink.href = user ? "account.html" : "login.html";
        accountLink.classList.toggle("logged-in", !!user);

        if (accountText) {
            accountText.textContent = user ? "حسابي" : "تسجيل الدخول";
        }

    }


    /* =====================================================
       UPDATE EVERYTHING
    ===================================================== */

    function updateNavbar() {

        updateCounters();

        updateAccount();

    }


    /* =====================================================
       INIT
    ===================================================== */

    function init() {

        updateNavbar();


        window.addEventListener(
            "storage",
            updateNavbar
        );


        /*
         * مهم:
         * إذا تغير تسجيل الدخول من نفس الصفحة
         * راح يتحدث خلال 300ms.
         */

        setInterval(
            updateNavbar,
            300
        );

    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            { once: true }
        );

    } else {

        init();

    }


    window.LAEL_updateNavbar =
        updateNavbar;

})();