const products = [
  {id:1,name:"Nike Air Max Plus TN Napoli",category:"calcados",price:210.00,desc:"Nike Air Max Plus TN • colorway Napoli",sizes:["38","39","40","41","42","43","44","45"],images:["tn-napoli.jpg","tn-preto-branco.jpg"],colors:["Napoli","Preto/Branco"]},
  {id:2,name:"Dreams Logo Tee",category:"camisetas",price:79.90,desc:"Camiseta regular • logo frontal"},
  {id:3,name:"Rush Heavy Hoodie",category:"moletons",price:169.90,desc:"Moletom pesado • capuz • unissex"},
  {id:4,name:"Night RUSH Hoodie",category:"moletons",price:179.90,desc:"Moletom preto • detalhes roxos"},
  {id:5,name:"DR Cap",category:"acessorios",price:59.90,desc:"Boné 6 gomos • bordado DR"},
  {id:6,name:"Dreams Socks",category:"acessorios",price:39.90,desc:"Meia cano médio • logo Dreams RUSH"}
];

let cart = JSON.parse(localStorage.getItem("dreamsRushCart") || "[]");
const checkoutState = { customer:{}, shipping:null, payment:null };
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const save = () => localStorage.setItem("dreamsRushCart",JSON.stringify(cart));
const subtotal = () => cart.reduce((sum,i)=>{const p=products.find(x=>x.id===i.id);return sum+(p?p.price*i.qty:0)},0);

function openProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  const modal=document.getElementById("productModal");
  const hasImages=Array.isArray(p.images)&&p.images.length;
  const sizes=p.sizes||["P","M","G","GG"];
  const imageMarkup=hasImages
    ? `<img id="modalProductImage" src="${p.images[0]}" alt="${p.name}">`
    : `<div class="blob"></div><div class="mini-logo">DR</div>`;
  const colorMarkup=p.colors?.length ? `<p class="field-label">Cor</p><div class="color-options" id="modalColors">${p.colors.map((c,i)=>`<button class="color-choice ${i===0?"active":""}" type="button" data-index="${i}">${c}</button>`).join("")}</div>` : "";
  document.getElementById("productModalContent").innerHTML=`
    <div class="product-modal-layout">
      <div class="product-modal-media">${imageMarkup}</div>
      <div class="product-modal-info">
        <p class="eyebrow">CATÁLOGO / DROP 01</p><h2 class="product-modal-title">${p.name}</h2>
        <p class="muted-copy">${p.desc}</p><div class="price big-price">${money(p.price)}</div>
        ${colorMarkup}
        <p class="field-label">Tamanho</p><div class="size-options" id="modalSizes">${sizes.map((size,i)=>`<button class="filter size-choice ${i===0?"active":""}" type="button" data-size="${size}">${size}</button>`).join("")}</div>
        <button class="primary-btn full" type="button" onclick="addToCart(${p.id}); closeProduct();">ADICIONAR AO CARRINHO</button>
      </div>
    </div>`;
  document.querySelectorAll("#modalSizes .size-choice").forEach(b=>b.onclick=()=>{document.querySelectorAll("#modalSizes .size-choice").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
  if(hasImages){
    document.querySelectorAll("#modalColors .color-choice").forEach(b=>b.onclick=()=>{
      document.querySelectorAll("#modalColors .color-choice").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      document.getElementById("modalProductImage").src=p.images[Number(b.dataset.index)];
    });
  }
  modal.classList.add("show");
}
function closeProduct(){document.getElementById("productModal").classList.remove("show")}

function renderProducts(filter="todos"){
  const grid=document.getElementById("productGrid"); grid.innerHTML="";
  products.filter(p=>filter==="todos"||p.category===filter).forEach(p=>{
    const media=p.images?.length ? `<img src="${p.images[0]}" alt="${p.name}" loading="lazy">` : `<div class="blob"></div><div class="mini-logo">DR</div>`;
    grid.innerHTML+=`<article class="product"><div class="product-img">${media}</div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="price">${money(p.price)}</div><button class="add" onclick="openProduct(${p.id})">VER PRODUTO</button></div></article>`;
  });
}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});save();renderCart();openCart()}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);save();renderCart()}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);save();renderCart()}
function renderCart(){
  const box=document.getElementById("cartItems");let count=0;
  if(!cart.length)box.innerHTML='<div class="empty-cart"><strong>Seu carrinho está vazio.</strong><span>Adicione produtos para continuar.</span></div>';
  else{box.innerHTML="";cart.forEach(i=>{const p=products.find(x=>x.id===i.id);if(!p)return;count+=i.qty;box.innerHTML+=`<div class="cart-item"><div class="cart-thumb">DR</div><div class="cart-item-main"><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div><button class="remove" onclick="removeFromCart(${p.id})">✕</button></div>`})}
  document.getElementById("cartTotal").textContent=money(subtotal());document.getElementById("cartCount").textContent=count;
}
function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("overlay").classList.remove("show")}

document.getElementById("openCart").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
document.querySelectorAll(".filter").forEach(btn=>btn.onclick=()=>{if(!btn.dataset.filter)return;document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderProducts(btn.dataset.filter)});
document.getElementById("closeProduct").onclick=closeProduct;

document.getElementById("checkoutBtn").onclick=()=>{if(!cart.length){alert("Seu carrinho está vazio.");return}closeCart();openCheckout()};
document.getElementById("closeModal").onclick=()=>document.getElementById("checkoutModal").classList.remove("show");

function openCheckout(){
  document.getElementById("checkoutModal").classList.add("show");
  showCheckoutStep(1);
  document.getElementById("checkoutSummary").innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div><span>${i.qty}× ${p.name}</span><strong>${money(p.price*i.qty)}</strong></div>`}).join("");
  document.getElementById("checkoutSubtotal").textContent=money(subtotal());
  document.getElementById("checkoutShipping").textContent="A calcular";
  document.getElementById("checkoutGrandTotal").textContent=money(subtotal());
}
function showCheckoutStep(step){document.querySelectorAll(".checkout-step").forEach(s=>s.classList.remove("active"));document.getElementById(`checkoutStep${step}`).classList.add("active");document.querySelectorAll(".step-dot").forEach((d,i)=>d.classList.toggle("active",i<step));document.getElementById("orderResult").innerHTML=""}

function onlyDigits(v){return v.replace(/\D/g,"")}
function setShipping(){
  const value=subtotal();
  checkoutState.shipping = value>=199 ? {name:"Frete grátis",price:0} : {name:"Entrega padrão",price:19.90};
  document.getElementById("checkoutShipping").textContent=checkoutState.shipping.price?money(checkoutState.shipping.price):"GRÁTIS";
  document.getElementById("checkoutGrandTotal").textContent=money(value+checkoutState.shipping.price);
}

document.getElementById("checkoutForm").onsubmit=async e=>{
  e.preventDefault();
  const cep=onlyDigits(document.getElementById("customerCep").value);
  if(cep.length!==8){alert("Digite um CEP válido com 8 números.");return}
  checkoutState.customer={name:document.getElementById("customerName").value.trim(),email:document.getElementById("customerEmail").value.trim(),cep,address:document.getElementById("customerAddress").value.trim(),number:document.getElementById("customerNumber").value.trim(),complement:document.getElementById("customerComplement").value.trim()};
  const btn=document.getElementById("continueToPayment");btn.disabled=true;btn.textContent="CONSULTANDO CEP...";
  try{
    const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`);const data=await r.json();
    if(data.erro)throw new Error("CEP não encontrado");
    document.getElementById("customerAddress").value=data.logradouro||checkoutState.customer.address;
    document.getElementById("customerAddressExtra").textContent=[data.bairro,data.localidade,data.uf].filter(Boolean).join(" • ");
  }catch(err){document.getElementById("customerAddressExtra").textContent="CEP salvo. Confirme o endereço antes de continuar."}
  finally{btn.disabled=false;btn.textContent="CONTINUAR PARA PAGAMENTO →"}
  checkoutState.customer.address=document.getElementById("customerAddress").value.trim();
  setShipping();
  document.getElementById("paymentCustomerName").textContent=checkoutState.customer.name;
  document.getElementById("paymentEmail").textContent=checkoutState.customer.email;
  document.getElementById("paymentAddress").textContent=`${checkoutState.customer.address}, ${checkoutState.customer.number} — CEP ${checkoutState.customer.cep}`;
  showCheckoutStep(2);
};

document.getElementById("backToData").onclick=()=>showCheckoutStep(1);
document.getElementById("paymentForm").onsubmit=e=>{e.preventDefault();checkoutState.payment=new FormData(e.target).get("payment");showCheckoutStep(3);document.getElementById("paymentMethodLabel").textContent=checkoutState.payment==="pix"?"Pix":"Cartão";document.getElementById("finalTotal").textContent=document.getElementById("checkoutGrandTotal").textContent};
document.getElementById("backToPayment").onclick=()=>showCheckoutStep(2);
document.getElementById("finishCheckout").onclick=()=>{document.getElementById("orderResult").innerHTML='<div class="success-box"><strong>Checkout preparado!</strong><p>O pedido e os dados já estão organizados. A próxima etapa é conectar o provedor de pagamento para gerar o Pix ou processar o cartão de forma segura.</p></div>';};

document.getElementById("customerCep").addEventListener("input",e=>{let v=onlyDigits(e.target.value).slice(0,8);e.target.value=v.length>5?v.slice(0,5)+"-"+v.slice(5):v});
document.getElementById("newsletterForm").onsubmit=e=>{e.preventDefault();document.getElementById("newsletterMsg").textContent="Você entrou na lista do próximo drop. 👾";e.target.reset()};

renderProducts();renderCart();
