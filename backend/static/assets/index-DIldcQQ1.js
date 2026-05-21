var f=Object.defineProperty;var m=(n,t,e)=>t in n?f(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var i=(n,t,e)=>m(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function e(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=e(a);fetch(a.href,r)}})();class g{async get(t){const e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}`);return await e.json()}async post(t,e){const s=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!s.ok)throw new Error(`HTTP ${s.status}`);return await s.json()}async patch(t,e){const s=await fetch(t,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!s.ok)throw new Error(`HTTP ${s.status}`);return await s.json()}async delete(t){const e=await fetch(t,{method:"DELETE"});if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.status!==204?await e.json():null}}const o=new g;class p{constructor(){this.baseUrl="http://localhost:3000"}getStocks(){return`${this.baseUrl}/api/accounts`}getStockById(t){return`${this.baseUrl}/api/accounts/${t}`}createStock(){return`${this.baseUrl}/api/accounts`}removeStockById(t){return`${this.baseUrl}/api/accounts/${t}`}updateStockById(t){return`${this.baseUrl}/api/accounts/${t}`}}const d=new p;class b{constructor(t){this.parent=t}getHTML(t){const e=t.accountNumber;return`
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
        `}addListeners(t,e){const s=document.getElementById(`click-card-${t.id}`);s&&s.addEventListener("click",e)}render(t,e){const s=this.getHTML(t);this.parent.insertAdjacentHTML("beforeend",s),this.addListeners(t,e)}}class v{constructor(t){this.parent=t}getDaysLeft(t){if(!t||t==="—")return null;const[e,s]=t.split("/");if(!e||!s)return null;const a=new Date,r=new Date(2e3+parseInt(s),parseInt(e),0);r.setHours(0,0,0,0),a.setHours(0,0,0,0);const c=r-a;return Math.ceil(c/(1e3*60*60*24))}getExpiryWarning(t){const e=this.getDaysLeft(t);return e===null?"":e<0?`<div class="alert alert-danger mt-3" role="alert">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Срок действия карты истёк ${Math.abs(e)} дней назад!</strong>
                        <br>Обратитесь в банк для перевыпуска.
                    </div>`:e===0?`<div class="alert alert-warning mt-3" role="alert">
                        <i class="fas fa-hourglass-end"></i>
                        <strong>Срок действия истекает сегодня!</strong>
                        <br>Рекомендуем заказать новую карту.
                    </div>`:e<=30?`<div class="alert alert-warning mt-3" role="alert">
                        <i class="fas fa-hourglass-half"></i>
                        <strong>Срок действия истекает через ${e} дней!</strong>
                        <br>Скоро потребуется перевыпуск.
                    </div>`:e<=90?`<div class="alert alert-info mt-3" role="alert">
                        <i class="fas fa-clock"></i>
                        Срок действия действителен ещё ${e} дней (около ${Math.ceil(e/30)} месяцев).
                    </div>`:`<div class="alert alert-success mt-3" role="alert">
                        <i class="fas fa-check-circle"></i>
                        Срок действия действителен ещё ${e} дней.
                    </div>`}getHTML(t){return`
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
                        <tr><td><i class="far fa-calendar-alt"></i> Срок действия</td><td>${t.expiry||"—"}</td></tr>
                    </table>
                    ${this.getExpiryWarning(t.expiry)}
                </div>
            </div>
        `}render(t){const e=this.getHTML(t);this.parent.insertAdjacentHTML("beforeend",e)}}class l{constructor(t="toastContainer"){this.container=document.getElementById(t),this.container||(this.container=document.createElement("div"),this.container.id=t,this.container.className="toast-container-custom",document.body.appendChild(this.container))}getHTML(t,e,s="success"){let a="fa-check-circle",r="bg-success";return s==="danger"?(a="fa-exclamation-circle",r="bg-danger"):s==="primary"?(a="fa-info-circle",r="bg-primary"):s==="warning"&&(a="fa-exclamation-triangle",r="bg-warning"),`
            <div class="toast align-items-center text-white ${r} border-0 mb-3 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="3500" style="border-radius: 16px;">
                <div class="d-flex align-items-center p-2">
                    <i class="fas ${a} me-2 fs-5"></i>
                    <div class="toast-body flex-grow-1">
                        <strong>${t}</strong><br>${e}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `}show(t,e,s="success"){const a=this.getHTML(t,e,s);this.container.insertAdjacentHTML("beforeend",a);const r=this.container.lastElementChild;new bootstrap.Toast(r,{autohide:!0,delay:3500}).show(),r.addEventListener("hidden.bs.toast",()=>r.remove())}}class y{constructor(t,e,s=null){i(this,"clickBack",()=>{new u(this.parent).render()});this.parent=t,this.id=e,this.toast=s||new l}async getData(){try{return await o.get(d.getStockById(this.id))}catch{return this.toast.show("Ошибка","Счёт не найден","danger"),null}}get pageRoot(){return document.getElementById("product-page")}getHTML(){return'<div id="product-page" class="animated-page py-3"></div>'}async render(){this.parent.innerHTML="";const t=this.getHTML();this.parent.insertAdjacentHTML("beforeend",t),this.pageRoot.insertAdjacentHTML("afterbegin",'<button class="back-button" id="back-button"><i class="fas fa-chevron-left"></i> Назад к счетам</button>'),document.getElementById("back-button").addEventListener("click",this.clickBack);const s=await this.getData();s?new v(this.pageRoot).render(s):this.pageRoot.insertAdjacentHTML("beforeend",'<div class="alert alert-danger">Счёт не найден</div>')}}class u{constructor(t){i(this,"clickCard",t=>{const e=t.target.closest("button").dataset.id;new y(this.parent,e,this.toast).render()});this.parent=t,this.toast=new l,this.accounts=[]}async loadAccounts(t=""){try{let e=d.getStocks();t&&(e+=`?title=${encodeURIComponent(t)}`);const s=await o.get(e);this.accounts=s,this.renderAccounts()}catch{this.toast.show("Ошибка","Не удалось загрузить счета","danger")}}renderAccounts(){const t=this.pageRoot;t.innerHTML="",this.accounts.forEach(e=>{new b(t).render(e,this.clickCard)})}get pageRoot(){return document.getElementById("accountsList")}getHTML(){return`
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
        `}async addAccount(){const t=prompt("Введите название счёта");if(!t)return;const e=parseFloat(prompt("Введите баланс"));if(isNaN(e))return;const s=prompt("Тип (Дебетовая/Кредитная/Накопительный)"),a=prompt("Номер счёта")||"0000 0000 0000 0000",r=prompt("Срок действия (MM/YY)")||"01/30",c={accountName:t,accountNumber:a,balance:e,type:s,expiry:r};try{await o.post(d.createStock(),c),this.toast.show("Успех",`Счёт "${c.accountName}" создан`,"success"),await this.loadAccounts()}catch{this.toast.show("Ошибка","Не удалось создать счёт","danger")}}async render(){this.parent.innerHTML="";const t=this.getHTML();this.parent.insertAdjacentHTML("beforeend",t),document.getElementById("searchBtn").addEventListener("click",()=>{const e=document.getElementById("searchInput").value;this.loadAccounts(e)}),document.getElementById("addAccountBtn").addEventListener("click",()=>this.addAccount()),await this.loadAccounts()}}const w=document.getElementById("root"),L=new u(w);L.render();
