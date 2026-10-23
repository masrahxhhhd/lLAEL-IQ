(function(){

"use strict";

/* =====================================================
   LAEL IQ - MAIN STORE SYSTEM
   CART + FAVORITES + SEARCH + PRODUCTS + CHECKOUT
===================================================== */

const CART_KEY = "laelCart";
const FAV_KEY = "laelFavorites";
const SELECTED_KEY = "selectedProduct";
const USER_KEY = "laelAuthUser";
const ORDERS_KEY = "laelOrders";
const PRODUCTS_KEY = "laelProducts";


/* =====================================================
   STORAGE
===================================================== */

function read(key,fallback){

    try{

        const value =
            JSON.parse(
                localStorage.getItem(key)
                || "null"
            );

        return value == null
            ? fallback
            : value;

    }catch(error){

        return fallback;

    }

}


function write(key,value){

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

}


/* =====================================================
   USER
===================================================== */

function getCurrentUser(){

    try{

        const user =
            JSON.parse(
                localStorage.getItem(USER_KEY)
                || "null"
            );

        if(
            user &&
            typeof user === "object" &&
            user.loggedIn === true
        ){

            return user;

        }

    }catch(error){}

    return null;

}


/* =====================================================
   PRODUCTS FROM ADMIN
===================================================== */

function getAdminProducts(){

    const products =
        read(
            PRODUCTS_KEY,
            []
        );

    return Array.isArray(products)
        ? products
        : [];

}


/* =====================================================
   CART
===================================================== */

let cart =
    Array.isArray(
        read(CART_KEY,[])
    )
    ? read(CART_KEY,[])
    : [];


let favorites =
    Array.isArray(
        read(FAV_KEY,[])
    )
    ? read(FAV_KEY,[])
        .map(normalizeProduct)
        .filter(Boolean)
    : [];


/* =====================================================
   HELPERS
===================================================== */

function priceNumber(value){

    return Number(
        String(value ?? "")
            .replace(/[^0-9]/g,"")
    ) || 0;

}


function formatPrice(value){

    return (
        Number(value || 0)
            .toLocaleString("en-US")
        +
        " IQD"
    );

}


function escapeHtml(value){

    return String(value ?? "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


/* =====================================================
   NORMALIZE PRODUCT
===================================================== */

function normalizeProduct(item){

    if(!item)
        return null;


    if(typeof item === "string"){

        return {

            id:"",
            name:item,
            description:"منتج من متجر LAEL IQ",
            price:"0 IQD",
            oldPrice:0,
            image:"",
            icon:"💻",
            stock:999999,
            category:"",
            brand:"",
            specs:"",
            isNew:false,
            isDiscount:false,
            isFeatured:false,
            status:"available"

        };

    }


    if(!item.name)
        return null;


    return {

        id:
            String(item.id || ""),


        name:
            String(item.name),


        description:
            String(
                item.description ||
                "منتج من متجر LAEL IQ"
            ),


        price:
            item.price !== undefined
                ? String(item.price)
                : "0 IQD",


        oldPrice:
            Number(item.oldPrice || 0),


        image:
            String(
                item.image ||
                ""
            ),


        icon:
            String(
                item.icon ||
                "💻"
            ),


        stock:
            Number(
                item.stock ?? 0
            ),


        category:
            String(
                item.category ||
                ""
            ),


        brand:
            String(
                item.brand ||
                ""
            ),


        specs:
            String(
                item.specs ||
                ""
            ),


        isNew:
            Boolean(item.isNew),


        isDiscount:
            Boolean(item.isDiscount),


        isFeatured:
            Boolean(item.isFeatured),


        status:
            String(
                item.status ||
                "available"
            )

    };

}


/* =====================================================
   PRODUCT FROM HTML CARD
===================================================== */

function productFromCard(card){

    if(!card)
        return null;


    const img =
        card.querySelector("img");


    return normalizeProduct({

        id:
            card.dataset.id ||
            "",


        name:
            card.dataset.name ||
            card.querySelector("h3,h4")
                ?.textContent
                .trim(),


        description:
            card.dataset.description ||
            card.querySelector("p")
                ?.textContent
                .trim(),


        price:
            card.dataset.price ||
            card.querySelector(".price")
                ?.textContent
                .trim(),


        image:
            card.dataset.image ||
            img?.getAttribute("src") ||
            "",


        icon:
            card.dataset.icon ||
            "💻",

        category:
            card.dataset.category ||
            "",

        brand:
            card.dataset.brand ||
            ""

    });

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(message){

    let box =
        document.querySelector(
            ".lael-message"
        );


    if(!box){

        box =
            document.createElement(
                "div"
            );

        box.className =
            "lael-message";

        document.body.appendChild(
            box
        );

    }


    box.textContent =
        message;


    box.classList.add(
        "show"
    );


    clearTimeout(
        box._timer
    );


    box._timer =
        setTimeout(
            function(){

                box.classList.remove(
                    "show"
                );

            },
            1900
        );

}


window.showMessage =
    showMessage;


/* =====================================================
   SAVE
===================================================== */

function saveCart(){

    write(
        CART_KEY,
        cart
    );

}


function saveFavorites(){

    write(
        FAV_KEY,
        favorites
    );

}


/* =====================================================
   CART COUNT
===================================================== */

function cartCount(){

    return cart.reduce(
        function(sum,item){

            return (
                sum +
                Math.max(
                    1,
                    Number(
                        item.quantity
                    ) || 1
                )
            );

        },
        0
    );

}


/* =====================================================
   COUNTERS
===================================================== */

function updateCounters(){

    const cartTotal =
        cartCount();


    const favoriteTotal =
        favorites.length;


    document
        .querySelectorAll(
            ".cart-btn,#cartButton"
        )
        .forEach(
            function(btn){

                let badge =
                    btn.querySelector(
                        ".cart-count"
                    );


                if(!badge){

                    badge =
                        document.createElement(
                            "span"
                        );

                    badge.className =
                        "cart-count";

                    btn.appendChild(
                        badge
                    );

                }


                badge.textContent =
                    cartTotal;


                badge.style.display =
                    cartTotal > 0
                        ? "flex"
                        : "none";

            }
        );


    document
        .querySelectorAll(
            ".favorite-nav-btn,#favoriteButton"
        )
        .forEach(
            function(btn){

                let badge =
                    btn.querySelector(
                        ".favorite-count"
                    );


                if(!badge){

                    badge =
                        document.createElement(
                            "span"
                        );

                    badge.className =
                        "favorite-count";

                    btn.appendChild(
                        badge
                    );

                }


                badge.textContent =
                    favoriteTotal;


                badge.style.display =
                    favoriteTotal > 0
                        ? "flex"
                        : "none";

            }
        );

}


/* =====================================================
   NAVIGATION
===================================================== */

function bindNavigation(){

    document
        .querySelectorAll(
            ".cart-btn,#cartButton"
        )
        .forEach(
            function(btn){

                if(btn.dataset.bound)
                    return;


                btn.dataset.bound =
                    "1";


                btn.addEventListener(
                    "click",
                    function(e){

                        e.preventDefault();

                        location.href =
                            "cart.html";

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".favorite-nav-btn,#favoriteButton"
        )
        .forEach(
            function(btn){

                if(btn.dataset.bound)
                    return;


                btn.dataset.bound =
                    "1";


                btn.addEventListener(
                    "click",
                    function(e){

                        e.preventDefault();

                        location.href =
                            "favorites.html";

                    }
                );

            }
        );

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(
    product,
    quantity
){

    product =
        normalizeProduct(
            product
        );


    if(!product)
        return;


    const qty =
        Math.max(
            1,
            Number(quantity) || 1
        );


    const existing =
        cart.find(
            function(item){

                return (
                    item.id &&
                    product.id &&
                    item.id === product.id
                ) ||
                (
                    !item.id &&
                    !product.id &&
                    item.name === product.name
                );

            }
        );


    if(existing){

        existing.quantity =
            Math.max(
                1,
                Number(
                    existing.quantity
                ) || 1
            ) + qty;


        existing.price =
            product.price;


        existing.image =
            product.image ||
            existing.image;


    }else{

        cart.push({

            ...product,

            quantity:qty

        });

    }


    saveCart();

    updateCounters();

    showMessage(
        "تمت إضافة المنتج إلى عربة التسوق 🛒"
    );

}


window.addToCart =
    addToCart;


/* =====================================================
   FAVORITES
===================================================== */

function isFavorite(product){

    return favorites.some(
        function(item){

            return (
                item.id &&
                product.id &&
                item.id === product.id
            ) ||
            (
                !item.id &&
                !product.id &&
                item.name === product.name
            );

        }
    );

}


function setFavoriteState(
    button,
    product
){

    if(
        !button ||
        !product
    )
        return;


    const active =
        isFavorite(
            product
        );


    button.classList.toggle(
        "active",
        active
    );


    button.setAttribute(
        "aria-pressed",
        active
            ? "true"
            : "false"
    );


    if(
        button.classList.contains(
            "product-favorite"
        ) ||
        button.classList.contains(
            "favorite-btn"
        )
    ){

        button.textContent =
            active
                ? "♥"
                : "♡";

    }

}


function toggleFavorite(
    product,
    button
){

    product =
        normalizeProduct(
            product
        );


    if(!product)
        return;


    const index =
        favorites.findIndex(
            function(item){

                return (
                    item.id &&
                    product.id &&
                    item.id === product.id
                ) ||
                (
                    !item.id &&
                    !product.id &&
                    item.name === product.name
                );

            }
        );


    if(index >= 0){

        favorites.splice(
            index,
            1
        );


        showMessage(
            "تم حذف المنتج من المفضلة"
        );

    }else{

        favorites.push(
            product
        );


        showMessage(
            "تمت إضافة المنتج إلى المفضلة ♡"
        );

    }


    saveFavorites();


    if(button){

        setFavoriteState(
            button,
            product
        );

    }


    updateCounters();

    renderFavoritesPage();

}


window.toggleFavorite =
    toggleFavorite;


/* =====================================================
   OPEN PRODUCT
===================================================== */

function openProduct(product){

    product =
        normalizeProduct(
            product
        );


    if(!product)
        return;


    write(
        SELECTED_KEY,
        product
    );


    location.href =
        "product.html";

}


/* =====================================================
   ADMIN PRODUCTS → STORE
===================================================== */

function renderAdminProducts(){

    const container = document.querySelector("#productsContainer");
    if(!container) return;

    const adminProducts = getAdminProducts()
        .map(normalizeProduct)
        .filter(Boolean);

    adminProducts.forEach(function(product){

        const safeId = String(product.id || "").replace(/[^a-zA-Z0-9_-]/g, "_");
        const existing = container.querySelector(`[data-admin-id="${safeId}"]`);
        if(existing) return;

        const card = document.createElement("article");
        card.className = "product";
        card.dataset.adminId = safeId;
        card.dataset.id = product.id;
        card.dataset.name = product.name;
        card.dataset.description = product.description;
        card.dataset.price = formatPrice(priceNumber(product.price));
        card.dataset.image = product.image;
        card.dataset.icon = product.icon || "💻";
        card.dataset.category = product.category || "";
        card.dataset.brand = product.brand || "";

        const badge = product.isNew
            ? "جديد"
            : product.isDiscount
                ? "خصم"
                : "";

        const imageHTML = product.image
            ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">`
            : `<div class="product-image-placeholder">${escapeHtml(product.icon || "💻")}</div>`;

        card.innerHTML = `
            ${badge ? `<label>${badge}</label>` : ""}
            <div class="product-image">
                ${imageHTML}
            </div>
            <h4>${escapeHtml(product.name)}</h4>
            <p>${escapeHtml(product.brand || product.description || product.category || "LAEL IQ")}</p>
            <div class="price">${formatPrice(priceNumber(product.price))}</div>
            <div class="product-actions">
                <button class="favorite-btn" type="button" aria-label="المفضلة">♡</button>
                <button class="add-cart" type="button" aria-label="إضافة للسلة">🛒</button>
                <button class="product-open" type="button" aria-label="فتح المنتج">↗</button>
            </div>
        `;

        container.appendChild(card);
    });

    setupHomeCards();
}


/* =====================================================
   PRODUCT EVENTS
===================================================== */

document.addEventListener(
    "click",
    function(e){

        const add =
            e.target.closest(
                ".product .add-cart"
            );


        if(add){

            e.preventDefault();
            e.stopPropagation();


            addToCart(
                productFromCard(
                    add.closest(
                        ".product"
                    )
                ),
                1
            );


            return;

        }


        const fav =
            e.target.closest(
                ".product .favorite-btn"
            );


        if(fav){

            e.preventDefault();
            e.stopPropagation();


            toggleFavorite(
                productFromCard(
                    fav.closest(
                        ".product"
                    )
                ),
                fav
            );


            return;

        }


        const open =
            e.target.closest(
                ".product .product-open"
            );


        if(open){

            e.preventDefault();
            e.stopPropagation();


            openProduct(
                productFromCard(
                    open.closest(
                        ".product"
                    )
                )
            );


            return;

        }


        const card =
            e.target.closest(
                ".product"
            );


        if(
            card &&
            !e.target.closest(
                "button,a,input"
            )
        ){

            openProduct(
                productFromCard(
                    card
                )
            );

        }

    }
);


/* =====================================================
   HOME CARDS
===================================================== */

function setupHomeCards(){

    document
        .querySelectorAll(
            ".product"
        )
        .forEach(
            function(card){

                const product =
                    productFromCard(
                        card
                    );


                if(product){

                    setFavoriteState(
                        card.querySelector(
                            ".favorite-btn"
                        ),
                        product
                    );

                }

            }
        );

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch(){

    const input = document.querySelector("#searchInput");
    const button = document.querySelector("#searchButton");
    const wrap = document.querySelector("#laelSearchWrap");
    const suggestions = document.querySelector("#searchSuggestions");
    const section = document.querySelector("#products");

    if(!input || !section || input.dataset.bound) return;

    input.dataset.bound = "1";

    function cards(){
        return Array.from(document.querySelectorAll("#products .product"));
    }

    function productMatches(card,q){
        const p = productFromCard(card);
        if(!p) return false;
        const hay = `${p.name} ${p.description} ${p.price} ${p.category} ${p.brand}`.toLowerCase();
        return hay.includes(q);
    }

    function getProducts(){
        return cards().map(productFromCard).filter(Boolean);
    }

    function closeSuggestions(){
        if(suggestions){
            suggestions.classList.remove("active");
            suggestions.innerHTML = "";
        }
    }

    function renderSuggestions(q){
        if(!suggestions) return;
        q = String(q || "").trim().toLowerCase();
        if(!q){ closeSuggestions(); return; }

        const results = getProducts()
            .filter(p => `${p.name} ${p.description} ${p.price} ${p.category} ${p.brand}`.toLowerCase().includes(q))
            .slice(0,6);

        suggestions.innerHTML = "";

        if(!results.length){
            suggestions.innerHTML = `<div class="no-result">لا توجد منتجات مطابقة للبحث</div>`;
            suggestions.classList.add("active");
            return;
        }

        results.forEach(function(product){
            const row = document.createElement("button");
            row.type = "button";
            row.className = "search-result";
            row.setAttribute("role","option");

            const icon = product.image
                ? `<img src="${escapeHtml(product.image)}" alt="" style="width:38px;height:38px;object-fit:contain;border-radius:6px;">`
                : `<span class="search-result-icon">${escapeHtml(product.icon || "💻")}</span>`;

            row.innerHTML = `
                ${icon}
                <span class="search-result-info">
                    <strong>${escapeHtml(product.name)}</strong>
                    <small>${escapeHtml(product.description || product.brand || "LAEL IQ")}</small>
                </span>
                <b>${formatPrice(priceNumber(product.price))}</b>
            `;

            row.addEventListener("click",function(e){
                e.preventDefault();
                e.stopPropagation();
                closeSuggestions();
                input.value = product.name;
                openProduct(product);
            });

            suggestions.appendChild(row);
        });

        suggestions.classList.add("active");
    }

    function apply(q,scroll){
        q = String(q || "").trim().toLowerCase();
        let count = 0;

        cards().forEach(function(card){
            const ok = !q || productMatches(card,q);
            card.style.display = ok ? "" : "none";
            if(ok && q) count++;
        });

        if(scroll && q){
            section.scrollIntoView({behavior:"smooth",block:"start"});
        }

        if(q && !count){
            showMessage("ما لقينا منتج مطابق للبحث 🔍");
        }
    }

    function submitSearch(){
        const q = input.value.trim();
        if(!q){
            cards().forEach(card => card.style.display = "");
            closeSuggestions();
            return;
        }

        const exact = getProducts().find(p => p.name.trim().toLowerCase() === q.toLowerCase());
        closeSuggestions();

        if(exact){
            openProduct(exact);
            return;
        }

        apply(q,true);
    }

    input.addEventListener("input",function(){
        const q = input.value.trim();
        if(!q){
            cards().forEach(card => card.style.display = "");
            closeSuggestions();
            return;
        }
        renderSuggestions(q);
    });

    input.addEventListener("focus",function(){
        if(input.value.trim()) renderSuggestions(input.value);
    });

    input.addEventListener("keydown",function(e){
        if(e.key === "Enter"){
            e.preventDefault();
            submitSearch();
        }
        if(e.key === "Escape") closeSuggestions();
    });

    button?.addEventListener("click",function(e){
        e.preventDefault();
        submitSearch();
    });

    document.addEventListener("click",function(e){
        if(wrap && !wrap.contains(e.target)) closeSuggestions();
    });
}


/* =====================================================
   CATEGORY FILTERS
===================================================== */


function isDiscountedProduct(product){
    if(!product) return false;
    if(product.isDiscount === true) return true;
    if(product.discount === true) return true;
    const oldPrice = Number(product.oldPrice) || 0;
    const price = Number(product.price) || 0;
    return oldPrice > price && oldPrice > 0;
}

function filterDiscountedProducts(scroll = true){
    const section = document.querySelector("#products");
    const cards = Array.from(document.querySelectorAll("#products .product"));
    let count = 0;

    cards.forEach(card => {
        const product = productFromCard(card);
        const ok = isDiscountedProduct(product) || card.querySelector("label")?.textContent.trim() === "خصم";
        card.style.display = ok ? "" : "none";
        if(ok) count++;
    });

    document.querySelectorAll("#categories .category").forEach(c => c.classList.remove("active"));

    if(scroll && section){
        section.scrollIntoView({behavior:"smooth", block:"start"});
    }

    if(!count) showMessage("ماكو منتجات عليها خصم حالياً");
}

function clearProductFilters(scroll = false){
    const section = document.querySelector("#products");
    document.querySelectorAll("#products .product").forEach(card => card.style.display = "");
    document.querySelectorAll("#categories .category").forEach(c => c.classList.remove("active"));
    if(scroll && section) section.scrollIntoView({behavior:"smooth", block:"start"});
}

function setupOffersNavigation(){
    const explore = document.getElementById("exploreButton");
    if(explore && !explore.dataset.flashBound){
        explore.dataset.flashBound = "1";
        explore.addEventListener("click", function(){
            explore.classList.remove("flash-click");
            void explore.offsetWidth;
            explore.classList.add("flash-click");
        });
    }

    const link = document.getElementById("offersNavLink");
    if(link && !link.dataset.bound){
        link.dataset.bound = "1";
        link.addEventListener("click", function(e){
            e.preventDefault();
            filterDiscountedProducts(true);
        });
    }

    const params = new URLSearchParams(window.location.search);
    if(params.get("offers") === "1"){
        setTimeout(() => filterDiscountedProducts(false), 50);
    }
}


/* =====================================================
   CUSTOM CATEGORIES (من لوحة الإدارة)
===================================================== */

const CATEGORIES_KEY = "laelCategories";

function getCustomCategories(){
    try{
        const list = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || "[]");
        return Array.isArray(list) ? list.filter(c => c && c.id && c.name) : [];
    }catch(e){
        return [];
    }
}

function renderCustomCategories(){
    const wrap = document.querySelector("#categories .categories");
    if(!wrap) return;

    wrap.querySelectorAll(".category[data-custom]").forEach(el => el.remove());

    getCustomCategories().forEach(function(cat){
        const card = document.createElement("div");
        card.className = "category";
        card.dataset.custom = "1";
        card.dataset.filter = "custom:" + cat.id;

        const icon = document.createElement("div");
        icon.className = "category-icon";
        icon.textContent = cat.icon || "📦";

        const title = document.createElement("h4");
        title.textContent = cat.name;

        const desc = document.createElement("p");
        desc.textContent = cat.desc || "";

        card.append(icon, title, desc);
        wrap.appendChild(card);
    });
}

function setupCategoryFilters(){

    renderCustomCategories();

    const section = document.querySelector("#products");
    const categories = document.querySelectorAll("#categories .category");

    if(!section || !categories.length) return;

    function cards(){
        return Array.from(document.querySelectorAll("#products .product"));
    }

    function detectCategory(product){
        const customMatch = getCustomCategories().find(c => c.name === String(product.category || "").trim());
        if(customMatch) return "custom:" + customMatch.id;

        const explicit = String(product.category || "").toLowerCase().trim();
        if(explicit){
            if(/laptop|notebook|لابتوب|لاب توب|لاب توبات/.test(explicit)) return "laptop";
            if(/pc|computer|desktop|تجميع|كمبيوتر/.test(explicit)) return "pc";
            if(/gpu|graphics|video|كرت|كروت|بطاقة/.test(explicit)) return "gpu";
            if(/monitor|screen|display|شاشة|شاشات/.test(explicit)) return "monitor";
            if(/accessor|keyboard|mouse|headset|إكسسوار|اكسسوار|كيبورد|ماوس|سماعة/.test(explicit)) return "accessories";
            if(/network|router|wifi|شبك|راوتر/.test(explicit)) return "network";
        }

        const text = `${product.name} ${product.description} ${product.brand}`.toLowerCase();

        if(/laptop|notebook|rog strix|macbook|thinkpad|لابتوب|لاب توب/.test(text)) return "laptop";
        if(/rtx|gtx|radeon|geforce|graphics|gpu|كرت شاشة|كروت الشاشة/.test(text)) return "gpu";
        if(/monitor|ultragear|screen|display|شاشة|شاشات/.test(text)) return "monitor";
        if(/pc build|gaming pc|desktop|computer|تجميعة|تجميعات|كمبيوتر/.test(text)) return "pc";
        if(/router|switch|network|wifi|شبك|راوتر|شبكات/.test(text)) return "network";
        if(/keyboard|mouse|headset|headphone|cooler|accessor|hyperx|logitech|كيبورد|ماوس|سماعة|إكسسوار|اكسسوار/.test(text)) return "accessories";

        return "";
    }

    function filterByCategory(category, scroll){

        let count = 0;

        cards().forEach(function(card){
            const product = productFromCard(card);
            const ok = product && detectCategory(product) === category;
            card.style.display = ok ? "" : "none";
            if(ok) count++;
        });

        categories.forEach(function(card){
            card.classList.toggle("active", card.dataset.filter === category);
        });

        if(scroll){
            section.scrollIntoView({
                behavior:"smooth",
                block:"start"
            });
        }

        if(!count){
            showMessage("ماكو منتجات حالياً ضمن هاي الفئة");
        }
    }

    categories.forEach(function(categoryCard){
        if(categoryCard.dataset.bound) return;
        categoryCard.dataset.bound = "1";

        categoryCard.addEventListener("click",function(){
            const filter = categoryCard.dataset.filter;
            if(filter) filterByCategory(filter,true);
        });
    });

    window.LAEL_filterCategory = filterByCategory;
}


/* =====================================================
   NEWSLETTER
===================================================== */

function setupNewsletter(){

    const box = document.querySelector(".newsletter");
    if(!box || box.dataset.bound) return;

    const input = box.querySelector("input[type='email']");
    const button = box.querySelector("button");
    if(!input || !button) return;

    box.dataset.bound = "1";

    button.addEventListener("click",function(){

        const email = input.value.trim().toLowerCase();

        if(!email){
            showMessage("يرجى إدخال البريد الإلكتروني");
            input.focus();
            return;
        }

        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if(!valid){
            showMessage("البريد الإلكتروني غير صحيح");
            input.focus();
            return;
        }

        let subscribers = read("laelNewsletter",[]);
        if(!Array.isArray(subscribers)) subscribers = [];

        if(subscribers.includes(email)){
            showMessage("هذا البريد مشترك مسبقاً ❤️");
            return;
        }

        subscribers.push(email);
        write("laelNewsletter",subscribers);
        input.value = "";
        showMessage("تم الاشتراك بنجاح، شكراً لك ❤️");
    });

    input.addEventListener("keydown",function(e){
        if(e.key === "Enter"){
            e.preventDefault();
            button.click();
        }
    });
}


/* =====================================================
   PRODUCT PAGE
===================================================== */

function setupProductPage(){

    if(
        !document.querySelector(
            ".product-details"
        )
    )
        return;


    const selected =
        normalizeProduct(
            read(
                SELECTED_KEY,
                null
            )
        );


    if(!selected)
        return;


    const title =
        document.querySelector(
            ".product-title"
        );


    const desc =
        document.querySelector(
            ".product-description"
        );


    const price =
        document.querySelector(
            ".product-price"
        );


    const img =
        document.querySelector(
            "#productImage"
        );


    const ph =
        document.querySelector(
            "#productImagePlaceholder"
        );


    if(title)
        title.textContent =
            selected.name;


    if(desc)
        desc.textContent =
            selected.description;


    if(price)
        price.textContent =
            formatPrice(
                priceNumber(
                    selected.price
                )
            );


    if(
        img &&
        selected.image
    ){

        img.src =
            selected.image;

        img.style.display =
            "block";


        if(ph)
            ph.style.display =
                "none";

    }else if(ph){

        ph.textContent =
            selected.icon;

        ph.style.display =
            "flex";

    }


    let qty = 1;


    const qEl =
        document.querySelector(
            "#productQuantity"
        );


    function sync(){

        if(qEl)
            qEl.textContent =
                qty;

    }


    document
        .querySelector(
            "#quantityMinus"
        )
        ?.addEventListener(
            "click",
            function(){

                qty =
                    Math.max(
                        1,
                        qty - 1
                    );

                sync();

            }
        );


    document
        .querySelector(
            "#quantityPlus"
        )
        ?.addEventListener(
            "click",
            function(){

                qty++;

                sync();

            }
        );


    document
        .querySelector(
            "#addProductCart"
        )
        ?.addEventListener(
            "click",
            function(){

                addToCart(
                    selected,
                    qty
                );

            }
        );


    document
        .querySelector(
            "#buyNow"
        )
        ?.addEventListener(
            "click",
            function(){

                addToCart(
                    selected,
                    qty
                );

                location.href =
                    "cart.html";

            }
        );


    const fav =
        document.querySelector(
            "#productFavorite"
        );


    setFavoriteState(
        fav,
        selected
    );


    fav?.addEventListener(
        "click",
        function(){

            toggleFavorite(
                selected,
                fav
            );

        }
    );

}


/* =====================================================
   FAVORITES PAGE
===================================================== */

function renderFavoritesPage(){

    const grid =
        document.querySelector(
            "#favoritesGrid"
        );


    const empty =
        document.querySelector(
            "#favoritesEmpty"
        );


    if(
        !grid ||
        !empty
    )
        return;


    grid.innerHTML =
        "";


    if(!favorites.length){

        grid.style.display =
            "none";

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";

    grid.style.display =
        "grid";


    favorites.forEach(
        function(item,index){

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "favorite-card";


            const visual =
                item.image

                    ? `
                        <img
                            src="${escapeHtml(
                                item.image
                            )}"
                            alt="${escapeHtml(
                                item.name
                            )}"
                        >
                    `

                    : `
                        <span>
                            ${escapeHtml(
                                item.icon
                            )}
                        </span>
                    `;


            card.innerHTML = `

                <div class="favorite-card-image">
                    ${visual}
                </div>

                <div class="favorite-card-body">

                    <span class="favorite-card-brand">
                        LAEL IQ
                    </span>

                    <h3>
                        ${escapeHtml(
                            item.name
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            item.description
                        )}
                    </p>

                    <strong>
                        ${formatPrice(
                            priceNumber(
                                item.price
                            )
                        )}
                    </strong>

                    <div class="favorite-card-actions">

                        <button
                            type="button"
                            class="fav-add"
                        >
                            🛒 إضافة للسلة
                        </button>

                        <button
                            type="button"
                            class="fav-remove"
                        >
                            حذف ♥
                        </button>

                    </div>

                </div>

            `;


            card
                .querySelector(
                    ".fav-add"
                )
                .addEventListener(
                    "click",
                    function(e){

                        e.stopPropagation();

                        addToCart(
                            item,
                            1
                        );

                    }
                );


            card
                .querySelector(
                    ".fav-remove"
                )
                .addEventListener(
                    "click",
                    function(e){

                        e.stopPropagation();

                        favorites.splice(
                            index,
                            1
                        );

                        saveFavorites();

                        updateCounters();

                        renderFavoritesPage();

                        showMessage(
                            "تم حذف المنتج من المفضلة"
                        );

                    }
                );


            card.addEventListener(
                "click",
                function(e){

                    if(
                        !e.target.closest(
                            "button"
                        )
                    ){

                        openProduct(
                            item
                        );

                    }

                }
            );


            grid.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   CART TOTALS
===================================================== */

function cartTotals(){

    let subtotal = 0;
    let count = 0;


    cart.forEach(
        function(item){

            const q =
                Math.max(
                    1,
                    Number(
                        item.quantity
                    ) || 1
                );


            subtotal +=
                priceNumber(
                    item.price
                ) * q;


            count += q;

        }
    );


    const shipping =
        subtotal > 0 &&
        subtotal < 350000
            ? 10000
            : 0;


    return {

        subtotal:subtotal,

        shipping:shipping,

        discount:0,

        total:
            subtotal +
            shipping,

        count:count

    };

}


/* =====================================================
   CART PAGE
===================================================== */

function renderCart(){

    const itemsEl =
        document.querySelector(
            "#cartItems"
        );


    const content =
        document.querySelector(
            "#cartContent"
        );


    const empty =
        document.querySelector(
            "#emptyCart"
        );


    if(
        !itemsEl ||
        !content ||
        !empty
    )
        return;


    if(!cart.length){

        content.style.display =
            "none";

        empty.style.display =
            "block";

        updateCounters();

        return;

    }


    content.style.display =
        "grid";

    empty.style.display =
        "none";


    itemsEl.innerHTML =
        "";


    cart.forEach(
        function(item,index){

            const q =
                Math.max(
                    1,
                    Number(
                        item.quantity
                    ) || 1
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cart-item";


            const visual =
                item.image

                    ? `
                        <img
                            src="${escapeHtml(
                                item.image
                            )}"
                            alt=""
                        >
                    `

                    : escapeHtml(
                        item.icon
                    );


            row.innerHTML = `

                <div class="cart-item-image">
                    ${visual}
                </div>

                <div class="cart-item-info">

                    <h3>
                        ${escapeHtml(
                            item.name
                        )}
                    </h3>

                    <p>
                        ${formatPrice(
                            priceNumber(
                                item.price
                            )
                        )}
                    </p>

                </div>

                <div class="cart-quantity">

                    <button
                        type="button"
                        data-minus
                    >
                        −
                    </button>

                    <strong>
                        ${q}
                    </strong>

                    <button
                        type="button"
                        data-plus
                    >
                        +
                    </button>

                </div>

                <div class="cart-item-total">

                    ${formatPrice(
                        priceNumber(
                            item.price
                        ) * q
                    )}

                </div>

                <button
                    type="button"
                    class="remove-item"
                >
                    ×
                </button>

            `;


            row
                .querySelector(
                    "[data-minus]"
                )
                .addEventListener(
                    "click",
                    function(){

                        changeQuantity(
                            index,
                            -1
                        );

                    }
                );


            row
                .querySelector(
                    "[data-plus]"
                )
                .addEventListener(
                    "click",
                    function(){

                        changeQuantity(
                            index,
                            1
                        );

                    }
                );


            row
                .querySelector(
                    ".remove-item"
                )
                .addEventListener(
                    "click",
                    function(){

                        removeItem(
                            index
                        );

                    }
                );


            itemsEl.appendChild(
                row
            );

        }
    );


    const t =
        cartTotals();


    function set(id,value){

        const el =
            document.querySelector(
                id
            );

        if(el)
            el.textContent =
                value;

    }


    set(
        "#subtotal",
        formatPrice(
            t.subtotal
        )
    );


    set(
        "#shipping",
        t.shipping
            ? formatPrice(
                t.shipping
            )
            : "مجاني"
    );


    set(
        "#discount",
        formatPrice(0)
    );


    set(
        "#total",
        formatPrice(
            t.total
        )
    );


    set(
        "#cartItemsCount",
        `${t.count} منتجات`
    );


    updateCounters();

}


function changeQuantity(
    index,
    amount
){

    if(!cart[index])
        return;


    cart[index].quantity =
        Math.max(
            1,
            (
                Number(
                    cart[index].quantity
                ) || 1
            ) + amount
        );


    saveCart();

    renderCart();

}


function removeItem(index){

    if(!cart[index])
        return;


    cart.splice(
        index,
        1
    );


    saveCart();

    renderCart();


    showMessage(
        "تم حذف المنتج من السلة"
    );

}


function goToCheckout(){

    if(!cart.length){

        showMessage(
            "السلة فارغة"
        );

        return;

    }


    location.href =
        "checkout.html";

}


window.changeQuantity =
    changeQuantity;

window.removeItem =
    removeItem;

window.goToCheckout =
    goToCheckout;


/* =====================================================
   CHECKOUT
===================================================== */

function renderCheckout(){

    const content =
        document.querySelector(
            "#checkoutContent"
        );


    const empty =
        document.querySelector(
            "#checkoutEmpty"
        );


    const items =
        document.querySelector(
            "#checkoutItems"
        );


    if(
        !content ||
        !empty ||
        !items
    )
        return;


    if(!cart.length){

        content.style.display =
            "none";

        empty.style.display =
            "block";

        return;

    }


    content.style.display =
        "grid";

    empty.style.display =
        "none";


    items.innerHTML =
        "";


    cart.forEach(
        function(item){

            const q =
                Math.max(
                    1,
                    Number(
                        item.quantity
                    ) || 1
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "checkout-product";


            const visual =
                item.image

                    ? `
                        <img
                            src="${escapeHtml(
                                item.image
                            )}"
                            alt=""
                        >
                    `

                    : escapeHtml(
                        item.icon
                    );


            row.innerHTML = `

                <div class="checkout-product-icon">
                    ${visual}
                </div>

                <div class="checkout-product-info">

                    <strong>
                        ${escapeHtml(
                            item.name
                        )}
                    </strong>

                    <small>
                        الكمية: ${q}
                    </small>

                </div>

                <span>
                    ${formatPrice(
                        priceNumber(
                            item.price
                        ) * q
                    )}
                </span>

            `;


            items.appendChild(
                row
            );

        }
    );


    const t =
        cartTotals();


    function set(id,value){

        const el =
            document.querySelector(
                id
            );

        if(el)
            el.textContent =
                value;

    }


    set(
        "#checkoutSubtotal",
        formatPrice(
            t.subtotal
        )
    );


    set(
        "#checkoutShipping",
        t.shipping
            ? formatPrice(
                t.shipping
            )
            : "مجاني"
    );


    set(
        "#checkoutTotal",
        formatPrice(
            t.total
        )
    );


    fillCheckoutUser();

}


/* =====================================================
   CHECKOUT USER
===================================================== */

function fillCheckoutUser(){

    const user =
        getCurrentUser();


    if(!user)
        return;


    const name =
        document.querySelector(
            "#customerName"
        );


    const phone =
        document.querySelector(
            "#customerPhone"
        );


    if(
        name &&
        !name.value
    ){

        name.value =
            user.name ||
            "";

    }


    if(
        phone &&
        !phone.value
    ){

        phone.value =
            user.phone ||
            "";

    }

}


/* =====================================================
   STOCK CONTROL
===================================================== */

function syncProductStockFromOrder(order, restore){

    if(!order || !Array.isArray(order.products)) return;

    const products = read(PRODUCTS_KEY, []);
    if(!Array.isArray(products) || !products.length) return;

    order.products.forEach(function(item){

        const product = products.find(function(p){
            return item.id && p.id
                ? String(p.id) === String(item.id)
                : String(p.name || "") === String(item.name || "");
        });

        if(!product) return;

        const quantity = Math.max(1, Number(item.quantity) || 1);
        const current = Math.max(0, Number(product.stock) || 0);

        product.stock = restore
            ? current + quantity
            : Math.max(0, current - quantity);

        if(!restore && product.stock <= 0){
            product.status = "out";
        } else if(product.status === "out" && product.stock > 0){
            product.status = product.stock <= 3 ? "limited" : "available";
        }

        product.updatedAt = new Date().toISOString();

    });

    write(PRODUCTS_KEY, products);

}


function validateCartStock(){

    const products = read(PRODUCTS_KEY, []);
    if(!Array.isArray(products) || !products.length) return true;

    for(const item of cart){

        if(!item.id) continue;

        const product = products.find(function(p){
            return String(p.id) === String(item.id);
        });

        if(!product) continue;

        const available = Math.max(0, Number(product.stock) || 0);
        const wanted = Math.max(1, Number(item.quantity) || 1);

        if(available < wanted){
            showMessage(
                `الكمية المتوفرة من ${item.name} هي ${available} فقط`
            );
            return false;
        }

    }

    return true;
}


/* =====================================================
   CONFIRM ORDER
===================================================== */

function confirmOrder(){

    if(!cart.length){

        return showMessage(
            "السلة فارغة"
        );

    }


    const get =
        function(id){

            return (
                document
                    .querySelector(id)
                    ?.value
                    .trim()
                ||
                ""
            );

        };


    const name =
        get("#customerName");


    const phone =
        get("#customerPhone");


    const city =
        document
            .querySelector(
                "#customerCity"
            )
            ?.value
        ||
        "";


    const area =
        get("#customerArea");


    const address =
        get("#customerAddress");


    const note =
        get("#customerNote");


    if(!name)
        return showMessage(
            "يرجى إدخال الاسم الكامل"
        );


    if(!phone)
        return showMessage(
            "يرجى إدخال رقم الهاتف"
        );


    if(!city)
        return showMessage(
            "يرجى اختيار المحافظة"
        );


    if(!area)
        return showMessage(
            "يرجى إدخال المنطقة"
        );


    if(!address)
        return showMessage(
            "يرجى إدخال العنوان بالتفصيل"
        );


    if(!validateCartStock()) return;

    const t = cartTotals();

    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        )?.value ||
        "cash";

    if(payment === "transfer"){
        const pendingCheckout = {
            customer:{name,phone,city,area,address,note},
            products: cart,
            subtotal:t.subtotal,
            shipping:t.shipping,
            total:t.total,
            createdAt:new Date().toISOString()
        };
        localStorage.setItem("laelPendingCheckout", JSON.stringify(pendingCheckout));
        location.href = "payment.html";
        return;
    }


    const currentUser =
        getCurrentUser();


    const order = {

        id:
            "LAEL-" +
            Date.now(),


        userId:
            currentUser?.id ||
            null,


        customer:{

            name:name,

            phone:phone,

            city:city,

            area:area,

            address:address,

            note:note

        },


        payment:payment,


        products:
            cart.map(
                function(item){

                    return {

                        id:
                            item.id ||
                            "",

                        name:
                            item.name,

                        price:
                            item.price,

                        quantity:
                            Number(
                                item.quantity
                            ) || 1,

                        image:
                            item.image ||
                            ""

                    };

                }
            ),


        subtotal:
            t.subtotal,


        shipping:
            t.shipping,


        total:
            t.total,


        status:
            "قيد المراجعة",


        date:
            new Date().toISOString()

    };


    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );


    let orders =
        read(
            ORDERS_KEY,
            []
        );


    if(!Array.isArray(orders))
        orders = [];


    orders.unshift(
        order
    );


    write(
        ORDERS_KEY,
        orders
    );

    syncProductStockFromOrder(order, false);


    cart = [];


    saveCart();

    updateCounters();


    location.href =
        "order-success.html";

}


window.confirmOrder =
    confirmOrder;


/* =====================================================
   USER ORDERS
===================================================== */

function getUserOrders(){

    const user =
        getCurrentUser();


    if(!user)
        return [];


    const orders =
        read(
            ORDERS_KEY,
            []
        );


    if(
        !Array.isArray(
            orders
        )
    )
        return [];


    return orders.filter(
        function(order){

            return (
                order &&
                order.userId ===
                user.id
            );

        }
    );

}


window.LAEL_getUserOrders =
    getUserOrders;


/* =====================================================
   ACCOUNT
===================================================== */

function updateAccountUI(){

    const accountLink =
        document.querySelector(
            "#accountLink"
        );


    const accountText =
        document.querySelector(
            "#accountText"
        );


    if(
        !accountLink ||
        !accountText
    )
        return;


    const user =
        getCurrentUser();


    if(user){

        accountText.textContent =
            "حسابي";

        accountLink.href =
            "account.html";

        accountLink.classList.add(
            "logged-in"
        );

    }else{

        accountText.textContent =
            "تسجيل الدخول";

        accountLink.href =
            "account.html";

        accountLink.classList.remove(
            "logged-in"
        );

    }

}


/* =====================================================
   INIT
===================================================== */

function init(){

    bindNavigation();

    updateCounters();

    updateAccountUI();

    /*
       أولاً نضيف منتجات الإدارة
    */

    renderAdminProducts();

    /*
       بعدها نجهز بطاقات المنتجات
    */

    setupHomeCards();

    setupSearch();
    setupCategoryFilters();
    setupNewsletter();
    setupOffersNavigation();

    setupProductPage();

    renderFavoritesPage();

    renderCart();

    renderCheckout();

}


/* =====================================================
   START
===================================================== */

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        init,
        {
            once:true
        }
    );

}else{

    init();

}


/* =====================================================
   إذا أضيف منتج من صفحة الإدارة
===================================================== */

window.addEventListener(
    "storage",
    function(event){

        if(event.key === CATEGORIES_KEY){
            renderCustomCategories();
            setupCategoryFilters();
        }

        if(
            event.key ===
            PRODUCTS_KEY
        ){

            renderAdminProducts();

            setupHomeCards();

        }


        updateAccountUI();

        renderCheckout();

        updateCounters();

    }
);

})();
