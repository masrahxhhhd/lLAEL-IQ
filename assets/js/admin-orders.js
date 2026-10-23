(function(){
"use strict";

const ORDERS_KEY="laelOrders";
const PRODUCTS_KEY="laelProducts";
const USERS_KEY="laelRegisteredUsers";
const STATUSES=["قيد المراجعة","قيد التجهيز","تم الشحن","تم التسليم","ملغي"];

if(sessionStorage.getItem("laelAdminLoggedIn")!=="true"){
    location.replace("login.html");
    return;
}

function read(key,fallback){
    try{
        const value=JSON.parse(localStorage.getItem(key)||"null");
        return value==null?fallback:value;
    }catch(e){return fallback;}
}
function write(key,value){localStorage.setItem(key,JSON.stringify(value));}
function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}
function money(v){return (Number(v)||0).toLocaleString("en-US")+" IQD";}
function date(v){try{return new Date(v).toLocaleString("ar-IQ",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"});}catch(e){return String(v||"");}}
function statusClass(s){
    if(s.includes("ملغي")) return "cancelled";
    if(s.includes("تسليم")) return "completed";
    if(s.includes("شحن")) return "shipping";
    if(s.includes("تجهيز")) return "processing";
    return "pending";
}

function products(){return read(PRODUCTS_KEY,[]).filter(Boolean);}
function orders(){return read(ORDERS_KEY,[]).filter(Boolean);}

function restoreStock(order){
    if(order.stockRestored) return;
    const list=products();
    order.products?.forEach(item=>{
        const p=list.find(x=>item.id&&x.id?String(x.id)===String(item.id):String(x.name||"")===String(item.name||""));
        if(!p) return;
        p.stock=Math.max(0,Number(p.stock)||0)+Math.max(1,Number(item.quantity)||1);
        if(p.stock>0) p.status=p.stock<=3?"limited":"available";
        p.updatedAt=new Date().toISOString();
    });
    write(PRODUCTS_KEY,list);
    order.stockRestored=true;
}

function deductStock(order){
    if(!order.stockRestored) return;
    const list=products();
    order.products?.forEach(item=>{
        const p=list.find(x=>item.id&&x.id?String(x.id)===String(item.id):String(x.name||"")===String(item.name||""));
        if(!p) return;
        p.stock=Math.max(0,(Number(p.stock)||0)-Math.max(1,Number(item.quantity)||1));
        if(p.stock<=0) p.status="out";
        else p.status=p.stock<=3?"limited":"available";
        p.updatedAt=new Date().toISOString();
    });
    write(PRODUCTS_KEY,list);
    order.stockRestored=false;
}

function updateStatus(id,newStatus){
    const list=orders();
    const order=list.find(x=>String(x.id)===String(id));
    if(!order) return;
    const old=String(order.status||"قيد المراجعة");
    if(old===newStatus) return;

    if(newStatus==="ملغي" && old!=="ملغي") restoreStock(order);
    if(old==="ملغي" && newStatus!=="ملغي") deductStock(order);

    order.status=newStatus;
    order.updatedAt=new Date().toISOString();
    write(ORDERS_KEY,list);
    render();
}

function deleteOrder(id){
    if(!confirm("حذف هذا الطلب نهائياً؟")) return;
    const list=orders();
    const index=list.findIndex(x=>String(x.id)===String(id));
    if(index<0) return;
    const order=list[index];
    if(String(order.status||"")==="ملغي" && order.stockRestored){}
    list.splice(index,1);
    write(ORDERS_KEY,list);
    render();
}

function orderProductsHTML(order){
    return (order.products||[]).map(item=>`<div class="item"><div class="item-name">${esc(item.name||"منتج")}</div><div>الكمية: ${Math.max(1,Number(item.quantity)||1)}</div><strong>${money((Number(String(item.price||0).replace(/[^0-9]/g,""))||0)*(Math.max(1,Number(item.quantity)||1)) )}</strong></div>`).join("");
}

function render(){
    const container=document.getElementById("ordersList");
    const search=(document.getElementById("orderSearch")?.value||"").trim().toLowerCase();
    const customerParam=new URLSearchParams(location.search).get("customer")||"";
    const filter=document.getElementById("statusFilter")?.value||"all";
    const all=orders();
    const filtered=all.filter(o=>{
        const hay=`${o.id||""} ${o.customer?.name||""} ${o.customer?.phone||""} ${o.customer?.city||""} ${o.customer?.area||""}`.toLowerCase();
        return (!search||hay.includes(search)) && (!customerParam||String(o.userId||"")===String(customerParam)) && (filter==="all"||String(o.status||"قيد المراجعة")==filter);
    });

    document.getElementById("allCount").textContent=all.length;
    document.getElementById("pendingCount").textContent=all.filter(o=>String(o.status||"")==="قيد المراجعة").length;
    document.getElementById("shippingCount").textContent=all.filter(o=>String(o.status||"")==="تم الشحن").length;
    document.getElementById("doneCount").textContent=all.filter(o=>String(o.status||"")==="تم التسليم").length;

    if(!filtered.length){
        container.innerHTML=`<div class="empty">📦<h2>لا توجد طلبات</h2><p>لا توجد طلبات مطابقة للبحث الحالي.</p></div>`;
        return;
    }

    container.innerHTML=filtered.map(order=>{
        const status=String(order.status||"قيد المراجعة");
        const customer=order.customer||{};
        const payment=order.payment==="transfer"?"تحويل إلكتروني":"الدفع عند الاستلام";
        return `<article class="order-card">
            <div class="order-top">
                <div><small>رقم الطلب</small><h3>${esc(order.id||"LAEL-ORDER")}</h3></div>
                <select class="status-select ${statusClass(status)}" data-id="${esc(order.id)}">
                    ${STATUSES.map(s=>`<option value="${esc(s)}" ${s===status?"selected":""}>${s}</option>`).join("")}
                </select>
            </div>
            <div class="customer">
                <div><small>العميل</small><strong>${esc(customer.name||"غير مسجل")}</strong></div>
                <div><small>الهاتف</small><strong>${esc(customer.phone||"-")}</strong></div>
                <div><small>المحافظة</small><strong>${esc(customer.city||"-")}</strong></div>
                <div><small>المنطقة</small><strong>${esc(customer.area||"-")}</strong></div>
                <div class="wide"><small>العنوان</small><strong>${esc(customer.address||"-")}</strong></div>
                ${customer.note?`<div class="wide"><small>ملاحظة</small><strong>${esc(customer.note)}</strong></div>`:""}
            </div>
            <div class="products"><h4>المنتجات</h4>${orderProductsHTML(order)||"<div class=item>لا توجد تفاصيل</div>"}</div>
            <div class="order-bottom"><div><small>التاريخ</small><strong>${esc(date(order.date))}</strong></div><div><small>الدفع</small><strong>${payment}</strong></div><div><small>المجموع</small><strong class="gold">${money(order.total)}</strong></div><button class="delete" data-delete="${esc(order.id)}">حذف الطلب</button></div>
        </article>`;
    }).join("");

    container.querySelectorAll(".status-select").forEach(el=>el.addEventListener("change",()=>updateStatus(el.dataset.id,el.value)));
    container.querySelectorAll("[data-delete]").forEach(el=>el.addEventListener("click",()=>deleteOrder(el.dataset.delete)));
}

document.getElementById("logoutButton")?.addEventListener("click",()=>{sessionStorage.removeItem("laelAdminLoggedIn");location.replace("login.html")});
document.getElementById("orderSearch")?.addEventListener("input",render);
document.getElementById("statusFilter")?.addEventListener("change",render);
window.addEventListener("storage",render);
render();
})();
