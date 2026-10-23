/* =====================================================
   LAEL IQ - AUTH SYSTEM
===================================================== */

(function () {

    "use strict";


    const USER_KEY = "laelAuthUser";
    const USERS_KEY = "laelRegisteredUsers";


    /* =====================================================
       STORAGE
    ===================================================== */

    function getUsers() {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(USERS_KEY) || "[]"
                );

            return Array.isArray(data)
                ? data
                : [];

        } catch (e) {

            return [];

        }

    }


    function saveUsers(users) {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

    }


    function getCurrentUser() {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(USER_KEY) || "null"
                );

            if (
                data &&
                typeof data === "object" &&
                data.loggedIn === true
            ) {

                return data;

            }

            return null;

        } catch (e) {

            return null;

        }

    }


    function loginUser(user) {

        const sessionUser = {

            id: user.id,

            name: user.name,

            phone: user.phone,

            email: user.email,

            loggedIn: true

        };


        localStorage.setItem(
            USER_KEY,
            JSON.stringify(sessionUser)
        );

    }


    function logoutUser() {

        /*
         * نحذف جلسة تسجيل الدخول فقط
         */

        localStorage.removeItem(
            USER_KEY
        );


        /*
         * نحذف المفاتيح القديمة
         * حتى ما يرجع النظام يعتبر المستخدم
         * مسجل دخول.
         */

        localStorage.removeItem("laelUser");
        localStorage.removeItem("laelCurrentUser");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("user");
        localStorage.removeItem("current_user");
        localStorage.removeItem("logged_user");
        localStorage.removeItem("loggedIn");


        if (
            window.LAEL_updateNavbar
        ) {

            window.LAEL_updateNavbar();

        }


        /*
         * نرجع للرئيسية
         */

        window.location.href =
            "index.html";

    }


    /* =====================================================
       UPDATE ACCOUNT PAGE
    ===================================================== */

    function updateAccountPage() {

        const authSection =
            document.getElementById("authSection");

        const accountSection =
            document.getElementById("accountSection");


        if (!authSection || !accountSection) {
            return;
        }


        const user =
            getCurrentUser();


        if (user) {

            authSection.classList.add("hidden");

            accountSection.classList.remove("hidden");


            const name =
                document.getElementById("accountName");

            const email =
                document.getElementById("accountEmail");

            const initial =
                document.getElementById("accountInitial");


            if (name) {

                name.textContent =
                    user.name || "المستخدم";

            }


            if (email) {

                email.textContent =
                    user.email || "";

            }


            if (initial) {

                initial.textContent =
                    (user.name || "م")
                    .trim()
                    .charAt(0)
                    .toUpperCase();

            }

        } else {

            authSection.classList.remove("hidden");

            accountSection.classList.add("hidden");

        }

    }


    /* =====================================================
       TABS
    ===================================================== */

    function setupTabs() {

        const loginTab =
            document.getElementById("loginTab");

        const registerTab =
            document.getElementById("registerTab");

        const loginForm =
            document.getElementById("loginForm");

        const registerForm =
            document.getElementById("registerForm");


        if (
            !loginTab ||
            !registerTab ||
            !loginForm ||
            !registerForm
        ) {

            return;

        }


        loginTab.addEventListener(
            "click",
            function () {

                loginTab.classList.add("active");

                registerTab.classList.remove("active");

                loginForm.classList.remove("hidden");

                registerForm.classList.add("hidden");

            }
        );


        registerTab.addEventListener(
            "click",
            function () {

                registerTab.classList.add("active");

                loginTab.classList.remove("active");

                registerForm.classList.remove("hidden");

                loginForm.classList.add("hidden");

            }
        );

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    function setupLogin() {

        const form =
            document.getElementById("loginForm");


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();


                const email =
                    document
                        .getElementById("loginEmail")
                        ?.value
                        .trim()
                        .toLowerCase();


                const password =
                    document
                        .getElementById("loginPassword")
                        ?.value;


                const message =
                    document.getElementById(
                        "loginMessage"
                    );


                const users =
                    getUsers();


                const user =
                    users.find(function (item) {

                        return (
                            item.email === email &&
                            item.password === password
                        );

                    });


                if (!user) {

                    if (message) {

                        message.textContent =
                            "البريد الإلكتروني أو كلمة المرور غير صحيحة";

                    }

                    return;

                }


                loginUser(user);


                if (message) {

                    message.textContent =
                        "تم تسجيل الدخول بنجاح ✓";

                }


                /*
                 * تحديث النافبار فوراً
                 */

                if (
                    window.LAEL_updateNavbar
                ) {

                    window.LAEL_updateNavbar();

                }


                /*
                 * فتح صفحة الحساب
                 */

                setTimeout(function () {

                    window.location.href =
                        "account.html";

                }, 300);

            }
        );

    }


    /* =====================================================
       REGISTER
    ===================================================== */

    function setupRegister() {

        const form =
            document.getElementById(
                "registerForm"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();


                const name =
                    document
                        .getElementById("registerName")
                        ?.value
                        .trim();


                const phone =
                    document
                        .getElementById("registerPhone")
                        ?.value
                        .trim();


                const email =
                    document
                        .getElementById("registerEmail")
                        ?.value
                        .trim()
                        .toLowerCase();


                const password =
                    document
                        .getElementById("registerPassword")
                        ?.value;


                const confirmPassword =
                    document
                        .getElementById(
                            "registerPasswordConfirm"
                        )
                        ?.value;


                const message =
                    document.getElementById(
                        "registerMessage"
                    );


                if (
                    password !==
                    confirmPassword
                ) {

                    if (message) {

                        message.textContent =
                            "كلمتا المرور غير متطابقتين";

                    }

                    return;

                }


                const users =
                    getUsers();


                const exists =
                    users.some(function (user) {

                        return user.email === email;

                    });


                if (exists) {

                    if (message) {

                        message.textContent =
                            "هذا البريد الإلكتروني مسجل مسبقاً";

                    }

                    return;

                }


                const user = {

                    id:
                        "USER-" +
                        Date.now(),

                    name: name,

                    phone: phone,

                    email: email,

                    password: password

                };


                users.push(user);

                saveUsers(users);


                /*
                 * تسجيل دخول مباشر بعد إنشاء الحساب
                 */

                loginUser(user);


                if (message) {

                    message.textContent =
                        "تم إنشاء الحساب بنجاح ✓";

                }


                if (
                    window.LAEL_updateNavbar
                ) {

                    window.LAEL_updateNavbar();

                }


                setTimeout(function () {

                    window.location.href =
                        "account.html";

                }, 300);

            }
        );

    }


    /* =====================================================
       ACCOUNT EDIT
    ===================================================== */

    function setupAccountEdit() {

        const editButton = document.getElementById("editAccountButton");
        const form = document.getElementById("accountEditForm");
        const cancel = document.getElementById("cancelAccountEdit");

        if(!editButton || !form) return;

        function fill(){
            const user = getCurrentUser();
            if(!user) return;
            const name = document.getElementById("editName");
            const phone = document.getElementById("editPhone");
            const email = document.getElementById("editEmail");
            if(name) name.value = user.name || "";
            if(phone) phone.value = user.phone || "";
            if(email) email.value = user.email || "";
            const password = document.getElementById("editPassword");
            if(password) password.value = "";
        }

        editButton.addEventListener("click",function(){
            fill();
            form.classList.remove("hidden");
            editButton.style.display = "none";
        });

        cancel?.addEventListener("click",function(){
            form.classList.add("hidden");
            editButton.style.display = "";
        });

        form.addEventListener("submit",function(e){
            e.preventDefault();
            const current = getCurrentUser();
            if(!current) return;

            const name = document.getElementById("editName")?.value.trim() || "";
            const phone = document.getElementById("editPhone")?.value.trim() || "";
            const email = document.getElementById("editEmail")?.value.trim().toLowerCase() || "";
            const password = document.getElementById("editPassword")?.value || "";
            const message = document.getElementById("accountEditMessage");

            if(!name || !phone || !email){
                if(message) message.textContent = "يرجى إكمال جميع المعلومات المطلوبة";
                return;
            }

            const users = getUsers();
            const duplicate = users.some(u => u.id !== current.id && u.email === email);
            if(duplicate){
                if(message) message.textContent = "البريد الإلكتروني مستخدم لحساب آخر";
                return;
            }

            const index = users.findIndex(u => u.id === current.id);
            if(index < 0) return;

            users[index].name = name;
            users[index].phone = phone;
            users[index].email = email;
            if(password) users[index].password = password;
            saveUsers(users);

            const updated = {
                ...current,
                name,
                phone,
                email,
                loggedIn:true
            };
            localStorage.setItem(USER_KEY,JSON.stringify(updated));

            updateAccountPage();
            if(window.LAEL_updateNavbar) window.LAEL_updateNavbar();
            if(message) message.textContent = "تم حفظ معلومات الحساب بنجاح ✓";

            setTimeout(function(){
                form.classList.add("hidden");
                editButton.style.display = "";
            },500);
        });
    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    function setupLogout() {

        const button =
            document.getElementById(
                "logoutButton"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                logoutUser();

            }
        );

    }


    /* =====================================================
       INIT
    ===================================================== */

    function initAuth() {

        updateAccountPage();

        setupTabs();

        setupLogin();

        setupRegister();

        setupAccountEdit();

        setupLogout();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initAuth,
            { once: true }
        );

    } else {

        initAuth();

    }


    window.LAEL_logout =
        logoutUser;


    window.LAEL_getCurrentUser =
        getCurrentUser;

})();