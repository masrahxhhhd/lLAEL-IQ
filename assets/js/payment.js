"use strict";

/*
  LAEL IQ payment frontend.
  Real charging is intentionally delegated to the server/payment gateway.
  No card data is stored in localStorage.
*/

(function(){
    const pending = JSON.parse(localStorage.getItem("laelPendingCheckout") || "null");
    const form = document.getElementById("paymentForm");
    const totalEl = document.getElementById("paymentTotal");
    const errorEl = document.getElementById("paymentError");
    const payButton = document.getElementById("payButton");

    if(!pending || !Array.isArray(pending.products) || !pending.products.length){
        if(form) form.style.display = "none";
        if(errorEl){
            errorEl.textContent = "لا توجد عملية دفع معلقة. ارجع إلى السلة وابدأ إتمام الطلب من جديد.";
            errorEl.classList.add("show");
        }
        return;
    }

    totalEl.textContent = `${Number(pending.total || 0).toLocaleString("en-US")} IQD`;

    const digitsOnly = value => String(value || "").replace(/\D/g, "");

    document.getElementById("cardNumber").addEventListener("input", e => {
        const digits = digitsOnly(e.target.value).slice(0,16);
        e.target.value = digits.replace(/(.{4})/g, "$1 ").trim();
    });

    ["cvv","expiryMonth","expiryYear"].forEach(id => {
        document.getElementById(id).addEventListener("input", e => {
            e.target.value = digitsOnly(e.target.value);
        });
    });

    function showError(message){
        errorEl.textContent = message;
        errorEl.classList.add("show");
    }

    form.addEventListener("submit", async e => {
        e.preventDefault();
        errorEl.classList.remove("show");

        const cardNumber = digitsOnly(document.getElementById("cardNumber").value);
        const cardName = document.getElementById("cardName").value.trim();
        const cvv = digitsOnly(document.getElementById("cvv").value);
        const expiryMonth = digitsOnly(document.getElementById("expiryMonth").value);
        const expiryYear = digitsOnly(document.getElementById("expiryYear").value);

        if(cardNumber.length < 13 || cardNumber.length > 19) return showError("رقم البطاقة غير صحيح");
        if(!cardName) return showError("يرجى إدخال اسم حامل البطاقة");
        if(cvv.length < 3 || cvv.length > 4) return showError("رمز CVV غير صحيح");
        if(Number(expiryMonth) < 1 || Number(expiryMonth) > 12) return showError("شهر الانتهاء غير صحيح");
        if(expiryYear.length !== 4) return showError("سنة الانتهاء غير صحيحة");

        payButton.disabled = true;
        payButton.textContent = "جارٍ التحقق من الدفع...";

        try{
            /*
              The server must receive the card through a PCI-compliant payment provider.
              Never store the raw card number/CVV in your database.
            */
            const response = await fetch("/api/payments/charge", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    amount:Number(pending.total || 0),
                    currency:"IQD",
                    customer:pending.customer,
                    card:{
                        number:cardNumber,
                        name:cardName,
                        cvv:cvv,
                        expiryMonth:expiryMonth,
                        expiryYear:expiryYear
                    },
                    items:pending.products
                })
            });

            const result = await response.json().catch(() => ({}));

            if(!response.ok || result.success !== true){
                if(result.code === "INSUFFICIENT_FUNDS"){
                    showError("لا يوجد رصيد كافي لإتمام عملية الدفع");
                }else if(result.code === "CARD_DECLINED"){
                    showError("تم رفض البطاقة من مزود الدفع");
                }else{
                    showError(result.message || "تعذر إتمام عملية الدفع حالياً");
                }
                payButton.disabled = false;
                payButton.textContent = "دفع المبلغ الآن";
                return;
            }

            const order = {
                id:result.orderId || ("LAEL-" + Date.now()),
                customer:pending.customer,
                products:pending.products,
                subtotal:pending.subtotal,
                shipping:pending.shipping,
                total:pending.total,
                payment:"transfer",
                status:"مدفوع",
                transactionId:result.transactionId || null,
                date:new Date().toISOString()
            };

            localStorage.setItem("lastOrder", JSON.stringify(order));
            localStorage.removeItem("laelPendingCheckout");
            localStorage.removeItem("laelCart");
            window.location.href = "order-success.html";
        }catch(error){
            showError("بوابة الدفع غير مربوطة بالسيرفر حالياً. هذه الصفحة جاهزة للربط بنقطة /api/payments/charge.");
            payButton.disabled = false;
            payButton.textContent = "دفع المبلغ الآن";
        }
    });
})();
