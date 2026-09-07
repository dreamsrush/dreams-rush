const products = [
  {id:1,name:"Oversized Purple",category:"camisetas",price:89.90,desc:"Camiseta oversized • algodão premium"},
  {id:2,name:"Dreams Logo Tee",category:"camisetas",price:79.90,desc:"Camiseta regular • logo frontal"},
  {id:3,name:"Rush Heavy Hoodie",category:"moletons",price:169.90,desc:"Moletom pesado • capuz • unissex"},
  {id:4,name:"Night RUSH Hoodie",category:"moletons",price:179.90,desc:"Moletom preto • detalhes roxos"},
  {id:5,name:"DR Cap",category:"acessorios",price:59.90,desc:"Boné 6 gomos • bordado DR"},
  {id:6,name:"Dreams Socks",category:"acessorios",price:39.90,desc:"Meia cano médio • logo Dreams RUSH"}
];

let cart = JSON.parse(localStorage.getItem("dreamsRushCart") || "[]");

const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const save = () => localStorage.setItem("dreamsRushCart",JSON.stringify(cart));

function openProduct(id){
  const p=products.find(x=>x.id===id);
  if(!p) return;
  const modal=document.getElementById("productModal");
  document.getElementById("productModalContent").innerHTML=`
    <div class="product-modal-layout">
      <div class="product-modal-media"><div class="blob"></div><div class="mini-logo">DR</div></div>
      <div class="product-modal-info">
        <p class="eyebrow">CATÁLOGO / DROP 01</p>
        <h2 style="font-family:Anton;margin:0;font-size:42px;line-height:.95">${p.name}</h2>
        <p style="color:var(--muted);font-size:12px;line-height:1.6">${p.desc}</p>
        <div class="price" style="font-size:18px">${money(p.price)}</div>
        <div class="size-options" style="display:flex;gap:6px;margin-top:14px;flex-wrap:wrap">
          ${["P","M","G","GG"].map((size,i)=>`<button class="filter size-choice ${i===1?"active":""}" type="button">${size}</button>`).join("")}
        </div>
        <button class="primary-btn full" type="button" onclick="addToCart(${p.id}); closeProduct();">ADICIONAR AO CARRINHO</button>
      </div>
    </div>`;
  modal.classList.add("show");
}
function closeProduct(){document.getElementById("productModal").classList.remove("show");}

function renderProducts(filter="todos"){
  const grid=document.getElementById("productGrid");
  grid.innerHTML="";
  products.filter(p=>filter==="todos"||p.category===filter).forEach(p=>{
    grid.innerHTML += `
      <article class="product">
        <div class="product-img"><div class="blob"></div><div class="mini-logo">DR</div></div>
        <div class="product-info">
          <h3>${p.name}</h3><p>${p.desc}</p>
          <div class="price">${money(p.price)}</div>
          <button class="add" onclick="openProduct(${p.id})">VER PRODUTO</button>
        </div>
      </article>`;
  });
}

function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  save(); renderCart(); openCart();
}
function removeFromCart(id){
  cart=cart.filter(x=>x.id!==id); save(); renderCart();
}
function renderCart(){
  const box=document.getElementById("cartItems");
  let total=0,count=0;
  if(!cart.length) box.innerHTML='<p style="color:#777">Seu carrinho está vazio.</p>';
  else {
    box.innerHTML="";
    cart.forEach(i=>{
      const p=products.find(x=>x.id===i.id); total+=p.price*i.qty; count+=i.qty;
      box.innerHTML += `<div class="cart-item">
        <div class="cart-thumb">DR</div>
        <div><h4>${p.name}</h4><p>${i.qty} × ${money(p.price)}</p></div>
        <button class="remove" onclick="removeFromCart(${p.id})">✕</button>
      </div>`;
    });
  }
  document.getElementById("cartTotal").textContent=money(total);
  document.getElementById("cartCount").textContent=count;
}
function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
document.getElementById("openCart").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;

document.querySelectorAll(".filter").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active"); renderProducts(btn.dataset.filter);
});

document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length){alert("Seu carrinho está vazio.");return}
  closeCart(); document.getElementById("checkoutModal").classList.add("show");
};
document.getElementById("closeModal").onclick=()=>document.getElementById("checkoutModal").classList.remove("show");
document.getElementById("closeProduct").onclick=closeProduct;

document.getElementById("checkoutForm").onsubmit=e=>{
  e.preventDefault();
  const order="DR-"+Date.now().toString().slice(-7);
  document.getElementById("orderResult").innerHTML=`Pedido <strong>${order}</strong> criado em modo demonstração.<br>Para transformar este checkout em pagamento real, conecte um provedor no backend.`;
  cart=[]; save(); renderCart();
};

document.getElementById("newsletterForm").onsubmit=e=>{
  e.preventDefault();
  document.getElementById("newsletterMsg").textContent="Você entrou na lista do próximo drop. 👾";
  e.target.reset();
};
renderProducts(); renderCart();
