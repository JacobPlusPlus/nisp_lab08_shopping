// ================================================
//  ShopWave — zamowienie.js (Student A)
//  Podsumowanie zamówienia + czyszczenie koszyka
// ================================================

const CART_KEY = 'shopwave_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

function formatPrice(value) {
  return value.toFixed(2).replace('.', ',') + ' zł';
}

// ---- LICZNIK W HEADERZE ----
function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  const count = getCart().reduce((s, i) => s + i.qty, 0);
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
}

// ---- RENDEROWANIE PODSUMOWANIA ----
function renderOrderSummary() {
  const cart = getCart();
  const orderItems = document.getElementById('orderItems');
  const orderTotal = document.getElementById('orderTotal');
  const totalPrice = document.getElementById('totalPrice');
  const formSection = document.getElementById('orderFormSection');

  if (cart.length === 0) {
    orderItems.innerHTML = '<p class="cart-empty">Koszyk jest pusty. <a href="index.html">Wróć do sklepu →</a></p>';
    orderTotal.style.display = 'none';
    formSection.style.display = 'none';
    return;
  }

  // Produkty
  orderItems.innerHTML = cart.map(item => `
    <div class="order-item">
      <span class="order-item__emoji">${item.emoji}</span>
      <div class="order-item__info">
        <p class="order-item__name">${item.name}</p>
        <p class="order-item__qty">Ilość: ${item.qty}</p>
      </div>
      <span class="order-item__price">${formatPrice(item.price * item.qty)}</span>
    </div>
  `).join('');

  // Suma
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalPrice.textContent = formatPrice(total);
  orderTotal.style.display = 'flex';
  formSection.style.display = 'flex';
}

// ---- OBSŁUGA FORMULARZA ----
function handleConfirm() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const phone   = document.getElementById('phone').value.trim();

  if (!name || !email || !address || !phone) {
    alert('Uzupełnij wszystkie pola formularza.');
    return;
  }

  // Wyczyść koszyk w localStorage
  clearCart();

  // Pokaż ekran sukcesu, ukryj resztę
  document.querySelector('.order-summary').style.display = 'none';
  document.getElementById('orderFormSection').style.display = 'none';
  document.getElementById('orderSuccess').style.display = 'flex';

  updateCartBadge();
}

// ---- START ----
updateCartBadge();
renderOrderSummary();

const confirmBtn = document.getElementById('confirmBtn');
if (confirmBtn) {
  confirmBtn.addEventListener('click', handleConfirm);
}
