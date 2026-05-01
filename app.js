// ================================================
//  ShopWave — app.js
// ================================================

// ---- DANE PRODUKTÓW ----
const products = [
  { id: 1, name: 'Plecak miejski',        emoji: '🎒', price: 249,  category: 'Akcesoria' },
  { id: 2, name: 'Słuchawki bezprzewodowe', emoji: '🎧', price: 399, category: 'Elektronika' },
  { id: 3, name: 'Sneakersy Classic',     emoji: '👟', price: 329,  category: 'Obuwie' },
  { id: 4, name: 'Kurtka zimowa',         emoji: '🧥', price: 549,  category: 'Odzież' },
  { id: 5, name: 'Zegarek sportowy',      emoji: '⌚', price: 899,  category: 'Akcesoria' },
  { id: 6, name: 'Książka o JS',          emoji: '📗', price:  89,  category: 'Książki' },
  { id: 7, name: 'Kubek termiczny',       emoji: '☕', price:  79,  category: 'Dom' },
  { id: 8, name: 'Mata do jogi',          emoji: '🧘', price: 159,  category: 'Sport' },
];

// ---- STAN KOSZYKA ----
let cart = [];

// ---- RENDEROWANIE PRODUKTÓW ----
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  products.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="product-card__img">${p.emoji}</div>
      <div class="product-card__body">
        <p class="product-card__category">${p.category}</p>
        <p class="product-card__name">${p.name}</p>
        <p class="product-card__price">${p.price.toFixed(2).replace('.', ',')} zł</p>
        <button class="product-card__add" data-id="${p.id}">Dodaj do koszyka</button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Obsługa przycisków
  grid.querySelectorAll('.product-card__add').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      addToCart(id, btn);
    });
  });
}

// ---- KOSZYK ----
function addToCart(id, btn) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  flashBtn(btn);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCart();
}

function updateCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Licznik na ikonie
  const badge = document.getElementById('cartCount');
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);

  // Lista w modalu
  const itemsEl  = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl  = document.getElementById('cartTotal');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Koszyk jest pusty.</p>';
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'flex';
  totalEl.textContent = total.toFixed(2).replace('.', ',') + ' zł';

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item__emoji">${item.emoji}</span>
      <div class="cart-item__info">
        <p class="cart-item__name">${item.name}</p>
        <p class="cart-item__price">${(item.price * item.qty).toFixed(2).replace('.', ',')} zł</p>
      </div>
      <div class="cart-item__qty">
        <button onclick="changeQty(${item.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, +1)">+</button>
      </div>
    </div>
  `).join('');
}

function flashBtn(btn) {
  btn.textContent = '✓ Dodano!';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = 'Dodaj do koszyka';
    btn.classList.remove('added');
  }, 1200);
}

// ---- MODAL KOSZYKA ----
const cartOverlay = document.getElementById('cartOverlay');
document.getElementById('cartBtn').addEventListener('click',  () => cartOverlay.classList.add('open'));
document.getElementById('cartClose').addEventListener('click', () => cartOverlay.classList.remove('open'));
cartOverlay.addEventListener('click', e => {
  if (e.target === cartOverlay) cartOverlay.classList.remove('open');
});

// ---- START ----
renderProducts();
