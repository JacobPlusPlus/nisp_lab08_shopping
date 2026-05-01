// ================================================
//  ShopWave — koszyk.js (Student B)
//  Odczyt z localStorage + usuwanie + suma
// ================================================

const CART_KEY = 'shopwave_cart';

// ---- POMOCNICZE: localStorage ----
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ---- AKTUALIZACJA LICZNIKA W HEADERZE ----
function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
}

// ---- USUWANIE PRODUKTU ----
function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
  updateCartBadge();
}

// ---- WYLICZANIE SUMY ----
function calcTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// ---- RENDEROWANIE KOSZYKA ----
function renderCart() {
  const grid = document.getElementById('koszykGrid');
  const totalEl = document.getElementById('totalPrice');
  const summary = document.getElementById('cartSummary');
  if (!grid) return;

  const cart = getCart();
  grid.innerHTML = '';

  if (cart.length === 0) {
    grid.innerHTML = '<p class="cart-empty">Twój koszyk jest pusty. <a href="index.html">Wróć do sklepu</a></p>';
    if (summary) summary.style.display = 'none';
    return;
  }

  cart.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-card__img">${item.emoji}</div>
      <div class="product-card__body">
        <p class="product-card__category">${item.category}</p>
        <p class="product-card__name">${item.name}</p>
        <p class="product-card__price">${item.price.toFixed(2).replace('.', ',')} zł</p>
        <p class="product-card__qty">Ilość: <strong>${item.qty}</strong></p>
        <p class="product-card__subtotal">Razem: <strong>${(item.price * item.qty).toFixed(2).replace('.', ',')} zł</strong></p>
        <button class="product-card__add remove-btn" data-id="${item.id}">🗑 Usuń</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(Number(btn.dataset.id));
    });
  });

  if (totalEl) totalEl.textContent = calcTotal(cart).toFixed(2).replace('.', ',') + ' zł';
  if (summary) summary.style.display = 'block';
}

// ---- START ----
renderCart();
updateCartBadge();