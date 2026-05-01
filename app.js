// ================================================
//  ShopWave — app.js (Student A)
//  Lista zakupów + zapis do localStorage
// ================================================

const CART_KEY = 'shopwave_cart';

// ---- PRODUKTY ----
const products = [
  { id: 1, name: 'Plecak miejski',           emoji: '🎒', price: 249, category: 'Akcesoria' },
  { id: 2, name: 'Słuchawki bezprzewodowe',  emoji: '🎧', price: 399, category: 'Elektronika' },
  { id: 3, name: 'Sneakersy Classic',        emoji: '👟', price: 329, category: 'Obuwie' },
  { id: 4, name: 'Kurtka zimowa',            emoji: '🧥', price: 549, category: 'Odzież' },
  { id: 5, name: 'Zegarek sportowy',         emoji: '⌚', price: 899, category: 'Akcesoria' },
  { id: 6, name: 'Książka o JavaScript',     emoji: '📗', price:  89, category: 'Książki' },
  { id: 7, name: 'Kubek termiczny',          emoji: '☕', price:  79, category: 'Dom' },
  { id: 8, name: 'Mata do jogi',             emoji: '🧘', price: 159, category: 'Sport' },
];

// ---- POMOCNICZE: localStorage ----
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const product = products.find(p => p.id === productId);
  const existing = cart.find(i => i.id === productId);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// ---- AKTUALIZACJA LICZNIKA W HEADERZE ----
function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
}

// ---- RENDEROWANIE PRODUKTÓW ----
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

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

  grid.querySelectorAll('.product-card__add').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      addToCart(id);
      updateCartBadge();
      flashBtn(btn);
    });
  });
}

function flashBtn(btn) {
  btn.textContent = '✓ Dodano!';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = 'Dodaj do koszyka';
    btn.classList.remove('added');
  }, 1200);
}

// ---- START ----
renderProducts();
updateCartBadge();