const P=[
{id:1,n:"Dreams Oversized Purple",c:"tee",p:89.9,d:"Camiseta oversized • algodão premium"},
{id:2,n:"DR Logo Tee",c:"tee",p:79.9,d:"Camiseta regular • logo frontal"},
{id:3,n:"Rush Heavy Hoodie",c:"hoodie",p:169.9,d:"Moletom pesado • capuz • unissex"},
{id:4,n:"Night Rush Hoodie",c:"hoodie",p:179.9,d:"Moletom preto • detalhes roxos"},
{id:5,n:"DR Signature Cap",c:"accessory",p:59.9,d:"Boné 6 gomos • bordado DR"},
{id:6,n:"Dreams Socks",c:"accessory",p:39.9,d:"Meia cano médio • logo Dreams RUSH"}];
let cart=JSON.parse(localStorage.getItem("dr_cart")||"[]");
const $=id=>document.getElementById(id), brl=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function render(cat="all"){ $("products").innerHTML=P.filter(x=>cat==="all"||x.c===cat).map(x=>`<article class="card"><div class="pic"><div class="shirt"></div><span>DR</span></div><div class="info"><h3>${x.n}</h3><p>${x.d}</p><div class="price">${brl(x.p)}</div><button class="add" onclick="detail(${x.id})">VER PRODUTO</button></div></article>`).join("")}
function save(){localStorage.setItem("dr_cart",JSON.stringify(cart))}
function renderCart(){let total=0,n=0;if(!cart.length){$("items").innerHTML='<div class="empty">Seu carrinho está vazio.</div>'}else{$("items").innerHTML=cart.map(i=>{let p=P.find(x=>x.id===i.id);total+=p.p*i.q;n+=i.q;return `<div class="item"><div class="thumb">DR</div><div><h4>${p.n}</h4><p>${i.q} × ${brl(p.p)}</p></div><button onclick="removeItem(${p.id})">×</button></div>`}).join("")}$("total").textContent=brl(total);$("count").textContent=n}
function add(id){let x=cart.find(i=>i.id===id);x?x.q++:cart.push({id,q:1});save();renderCart();closeModal();openDrawer()}
function removeItem(id){cart=cart.filter(x=>x.id!==id);save();renderCart()}
function detail(id){let p=P.find(x=>x.id===id);$("productDetail").innerHTML=`<div class="detail"><div class="detail-pic">DR</div><div><small>CATÁLOGO / DROP 01</small><h2>${p.n}</h2><p>${p.d}</p><h3>${brl(p.p)}</h3><div class="sizes">${["P","M","G","GG"].map(s=>`<button onclick="this.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('sel'));this.classList.add('sel')">${s}</button>`).join("")}</div><button class="btn wide" onclick="add(${p.id})">ADICIONAR AO CARRINHO</button></div></div>`;$("productModal").classList.add("show")}
function closeModal(){$("productModal").classList.remove("show")}
function openDrawer(){$("drawer").classList.add("open");$("shade").classList.add("show")}
function closeDrawer(){$("drawer").classList.remove("open");$("shade").classList.remove("show")}
document.querySelectorAll(".filters button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.cat)});
$("cartOpen").onclick=openDrawer;$("cartClose").onclick=closeDrawer;$("shade").onclick=closeDrawer;$("modalClose").onclick=closeModal;
$("checkout").onclick=()=>{if(!cart.length){alert("Carrinho vazio.");return}closeDrawer();$("checkoutModal").classList.add("show")};
$("checkoutClose").onclick=()=>$("checkoutModal").classList.remove("show");
$("checkoutForm").onsubmit=e=>{e.preventDefault();let code="DR-"+Date.now().toString().slice(-7);$("order").innerHTML=`Pedido <b>${code}</b> criado em modo demonstração.<br>Para cobrar de verdade, conecte Mercado Pago/Stripe ou outro provedor através de um backend seguro.`;cart=[];save();renderCart()};
$("news").onsubmit=e=>{e.preventDefault();$("newsMsg").textContent="Você entrou na lista do próximo drop.";e.target.reset()};
render();renderCart();