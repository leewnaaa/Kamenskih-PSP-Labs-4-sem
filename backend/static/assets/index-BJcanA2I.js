var h=Object.defineProperty;var m=(c,t,e)=>t in c?h(c,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):c[t]=e;var o=(c,t,e)=>m(c,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=e(a);fetch(a.href,n)}})();class p{async get(t){const e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}`);return await e.json()}async post(t,e){const s=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!s.ok)throw new Error(`HTTP ${s.status}`);return await s.json()}async patch(t,e){const s=await fetch(t,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!s.ok)throw new Error(`HTTP ${s.status}`);return await s.json()}async delete(t){const e=await fetch(t,{method:"DELETE"});if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.status!==204?await e.json():null}}const i=new p;class f{constructor(){this.baseUrl="http://localhost:3000"}getStocks(){return`${this.baseUrl}/api/accounts`}getStockById(t){return`${this.baseUrl}/api/accounts/${t}`}createStock(){return`${this.baseUrl}/api/accounts`}removeStockById(t){return`${this.baseUrl}/api/accounts/${t}`}updateStockById(t){return`${this.baseUrl}/api/accounts/${t}`}}const d=new f;class g{constructor(t){this.parent=t}getHTML(t){const e=t.accountNumber;return`
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="account-card">
                    <div class="card-header-red">
                        <i class="fas fa-credit-card me-1"></i> ${t.accountName}
                    </div>
                    <div class="card-body-custom">
                        <small class="text-muted">Баланс</small>
                        <div class="account-balance">${t.balance.toLocaleString()} ₽</div>
                        <div class="account-number"><i class="far fa-credit-card"></i> ${e}</div>
                        <div class="mt-2"><small>Срок действия: ${t.expiry||"—"}</small></div>
                    </div>
                    <div class="card-footer-custom">
                        <button class="btn btn-alfa w-100" id="click-card-${t.id}" data-id="${t.id}">
                            <i class="fas fa-arrow-right me-1"></i> Подробнее
                        </button>
                    </div>
                </div>
            </div>
        `}addListeners(t,e){const s=document.getElementById(`click-card-${t.id}`);s&&s.addEventListener("click",e)}render(t,e){const s=this.getHTML(t);this.parent.insertAdjacentHTML("beforeend",s),this.addListeners(t,e)}}class b{constructor(t,e){this.parent=t,this.toast=e}getHTML(t){return`
            <div class="detail-card">
                <div class="detail-header">
                    <i class="fas fa-university fa-2x"></i>
                    <h3 class="mt-2">${t.accountName}</h3>
                </div>
                <div class="detail-body">
                    <table class="table table-borderless">
                        <tr><td><i class="fas fa-id-card"></i> Номер счёта</td><td><strong>${t.accountNumber}</strong></td></tr>
                        <tr><td><i class="fas fa-ruble-sign"></i> Баланс</td><td><strong class="text-danger fs-4">${t.balance.toLocaleString()} ₽</strong></td></tr>
                        <tr><td><i class="fas fa-chart-line"></i> Тип</td><td>${t.type}</td></tr>
                        ${t.creditLimit?`<tr><td><i class="fas fa-credit-card"></i> Кредитный лимит</td><td>${t.creditLimit}</td></tr>`:""}
                        ${t.percent?`<tr><td><i class="fas fa-percent"></i> Ставка</td><td>${t.percent}</td></tr>`:""}
                        <tr><td><i class="far fa-calendar-alt"></i> Срок действия</td><td>${t.expiry}</td></tr>
                    </table>
                </div>
            </div>
        `}render(t){const e=this.getHTML(t);this.parent.insertAdjacentHTML("beforeend",e)}}class l{constructor(t="toastContainer"){this.container=document.getElementById(t),this.container||(this.container=document.createElement("div"),this.container.id=t,this.container.className="toast-container-custom",document.body.appendChild(this.container))}getHTML(t,e,s="success"){let a="fa-check-circle",n="bg-success";return s==="danger"?(a="fa-exclamation-circle",n="bg-danger"):s==="primary"?(a="fa-info-circle",n="bg-primary"):s==="warning"&&(a="fa-exclamation-triangle",n="bg-warning"),`
            <div class="toast align-items-center text-white ${n} border-0 mb-3 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="3500" style="border-radius: 16px;">
                <div class="d-flex align-items-center p-2">
                    <i class="fas ${a} me-2 fs-5"></i>
                    <div class="toast-body flex-grow-1">
                        <strong>${t}</strong><br>${e}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `}show(t,e,s="success"){const a=this.getHTML(t,e,s);this.container.insertAdjacentHTML("beforeend",a);const n=this.container.lastElementChild;new bootstrap.Toast(n,{autohide:!0,delay:3500}).show(),n.addEventListener("hidden.bs.toast",()=>n.remove())}}class v{constructor(t,e,s=null){o(this,"clickBack",()=>{new u(this.parent).render()});this.parent=t,this.id=e,this.toast=s||new l}async getData(){try{return await i.get(d.getStockById(this.id))}catch{return this.toast.show("Ошибка","Счёт не найден","danger"),null}}get pageRoot(){return document.getElementById("product-page")}getHTML(){return'<div id="product-page" class="animated-page py-3"></div>'}async render(){this.parent.innerHTML="";const t=this.getHTML();this.parent.insertAdjacentHTML("beforeend",t),this.pageRoot.insertAdjacentHTML("afterbegin",'<button class="back-button" id="back-button"><i class="fas fa-chevron-left"></i> Назад к счетам</button>'),document.getElementById("back-button").addEventListener("click",this.clickBack);const s=await this.getData();s?new b(this.pageRoot).render(s):this.pageRoot.insertAdjacentHTML("beforeend",'<div class="alert alert-danger">Счёт не найден</div>')}}class u{constructor(t){o(this,"clickCard",t=>{const e=t.target.closest("button").dataset.id;new v(this.parent,e,this.toast).render()});this.parent=t,this.toast=new l,this.accounts=[]}async loadAccounts(t=""){try{let e=d.getStocks();t&&(e+=`?title=${encodeURIComponent(t)}`);const s=await i.get(e);this.accounts=s,this.renderAccounts()}catch{this.toast.show("Ошибка","Не удалось загрузить счета","danger")}}renderAccounts(){const t=this.pageRoot;t.innerHTML="",this.accounts.forEach(e=>{new g(t).render(e,this.clickCard)})}get pageRoot(){return document.getElementById("accountsList")}getHTML(){return`
            <div id="main-page">
                <h2 class="mb-3">Мои счета</h2>
                <div class="row mb-3 align-items-end">
                    <div class="col-md-6">
                        <input type="text" id="searchInput" class="form-control" placeholder="Поиск по названию счёта">
                    </div>
                    <div class="col-md-3">
                        <button id="searchBtn" class="btn btn-outline-secondary w-100">Найти</button>
                    </div>
                    <div class="col-md-3">
                        <button id="addAccountBtn" class="btn btn-alfa w-100">+ Добавить счёт</button>
                    </div>
                </div>
                <div class="row g-4 animated-page" id="accountsList"></div>
            </div>
        `}async addAccount(){const t=prompt("Введите название счёта");if(!t)return;const e=parseFloat(prompt("Введите баланс"));if(isNaN(e))return;const s=prompt("Тип (Дебетовая/Кредитная/Накопительный)"),a=prompt("Номер счёта")||"0000 0000 0000 0000",n=prompt("Срок действия (MM/YY)")||"01/30",r={accountName:t,accountNumber:a,balance:e,type:s,expiry:n};try{await i.post(d.createStock(),r),this.toast.show("Успех",`Счёт "${r.accountName}" создан`,"success"),await this.loadAccounts()}catch{this.toast.show("Ошибка","Не удалось создать счёт","danger")}}async render(){this.parent.innerHTML="";const t=this.getHTML();this.parent.insertAdjacentHTML("beforeend",t),document.getElementById("searchBtn").addEventListener("click",()=>{const e=document.getElementById("searchInput").value;this.loadAccounts(e)}),document.getElementById("addAccountBtn").addEventListener("click",()=>this.addAccount()),await this.loadAccounts()}}const y=document.getElementById("root"),w=new u(y);w.render();
