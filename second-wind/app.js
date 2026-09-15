/* Second Wind Air Cellars - cart, lightbox, shared bits. Vanilla JS. */

const PRODUCTS = {
  'alpine-meadow':    { name: 'Swiss Alpine Meadow 2024', price: 60 },
  'portland-coffee':  { name: 'Portland Coffee Shop, 7 A.M. 2025', price: 48 },
  'casino-lot':       { name: 'Mid-Tier Casino Parking Lot 2023', price: 38 },
  'grandma-kitchen':  { name: "A Grandmother's Kitchen, Sunday 2022", price: 75 },
  'maine-fog':        { name: 'Penobscot Bay Fog 2024', price: 55 },
  'paris-metro':      { name: 'Paris Metro, Rush Hour 2023', price: 42 },
  'old-library':      { name: 'Special Collections Reading Room 2021', price: 65 },
  'new-car':          { name: 'New Car Interior 2025', price: 58 },
  'thunderstorm':     { name: 'Minnesota Thunderstorm, August 2024', price: 52 },
  'bakery-dawn':      { name: 'Village Bakery, 5 A.M. 2024', price: 49 },
  'vermont-autumn':   { name: 'Vermont Back Road, October 2023', price: 54 },
  'locker-room':      { name: 'Championship Locker Room 2020', price: 88 },
  'midnight-desert':  { name: 'Mojave Desert, Midnight 2022', price: 61 },
  'hotel-lobby':      { name: 'Grand Hotel Lobby 1998 (library vintage)', price: 220 },
  'own-backyard':     { name: 'Your Own Backyard', price: 95 },
  'membership-apprentice': { name: 'The Apprentice Nose (monthly)', price: 39 },
  'membership-connoisseur': { name: 'The Connoisseur (monthly)', price: 89 },
  'membership-reserve': { name: 'The Barometric Reserve (monthly)', price: 250 },
  'freshness-plan':   { name: 'Freshness Assurance Plan (monthly)', price: 15 }
};

function loadCart() {
  try { return JSON.parse(localStorage.getItem('sw_cart')) || {}; }
  catch (e) { return {}; }
}

function saveCart(cart) {
  try { localStorage.setItem('sw_cart', JSON.stringify(cart)); } catch (e) { /* private mode */ }
}

let cart = loadCart();

function cartCount() {
  return Object.values(cart).reduce(function (a, b) { return a + b; }, 0);
}

function updateCartButton() {
  const btn = document.getElementById('cartBtn');
  if (btn) btn.textContent = 'Cellar (' + cartCount() + ')';
}

function addToCart(id) {
  if (!PRODUCTS[id]) return;
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartButton();
  toast(PRODUCTS[id].name + ' laid down in your cellar.');
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  renderCart();
  updateCartButton();
}

function renderCart() {
  const list = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!list) return;
  list.innerHTML = '';
  let total = 0;
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    list.innerHTML = '<p style="color:var(--muted); padding:20px 0;">Your cellar is empty, which is ironic, given our product.</p>';
  }
  ids.forEach(function (id) {
    const p = PRODUCTS[id];
    if (!p) return;
    total += p.price * cart[id];
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML =
      '<span>' + p.name + '</span>' +
      '<span class="qty">' +
      '<button aria-label="Remove one">&minus;</button>' +
      '<span>' + cart[id] + '</span>' +
      '<button aria-label="Add one">+</button>' +
      '</span>' +
      '<strong>$' + (p.price * cart[id]) + '</strong>';
    const btns = row.querySelectorAll('button');
    btns[0].addEventListener('click', function () { changeQty(id, -1); });
    btns[1].addEventListener('click', function () { changeQty(id, 1); });
    list.appendChild(row);
  });
  if (totalEl) totalEl.textContent = '$' + total;
}

function openCart() {
  document.getElementById('cartDrawer').hidden = false;
  document.getElementById('drawerVeil').hidden = false;
  renderCart();
}

function closeCart() {
  document.getElementById('cartDrawer').hidden = true;
  document.getElementById('drawerVeil').hidden = true;
}

function checkout() {
  if (cartCount() === 0) { toast('There is nothing in your cellar. Nothing is our specialty, but not like this.'); return; }
  cart = {};
  saveCart(cart);
  updateCartButton();
  closeCart();
  const m = document.getElementById('orderModal');
  if (m) m.hidden = false;
}

/* ---------- Toast ---------- */
let toastTimer = null;

function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.style.opacity = '0'; }, 2600);
}

/* ---------- Image lightbox ---------- */
function initLightbox() {
  const veil = document.createElement('div');
  veil.className = 'modal-veil';
  veil.hidden = true;
  veil.innerHTML = '<figure style="margin:0;"><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(veil);
  const big = veil.querySelector('img');
  const cap = veil.querySelector('figcaption');

  document.querySelectorAll('img.zoom').forEach(function (img) {
    img.addEventListener('click', function () {
      big.src = img.dataset.full || img.src;
      big.alt = img.alt;
      cap.textContent = img.dataset.caption || img.alt;
      veil.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  veil.addEventListener('click', function () {
    veil.hidden = true;
    document.body.style.overflow = '';
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !veil.hidden) {
      veil.hidden = true;
      document.body.style.overflow = '';
    }
  });
}

/* ---------- Wiring ---------- */
document.addEventListener('DOMContentLoaded', function () {
  updateCartButton();
  initLightbox();

  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', openCart);

  const closeBtn = document.getElementById('cartClose');
  if (closeBtn) closeBtn.addEventListener('click', closeCart);

  const veil = document.getElementById('drawerVeil');
  if (veil) veil.addEventListener('click', closeCart);

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);

  const orderClose = document.getElementById('orderClose');
  if (orderClose) orderClose.addEventListener('click', function () {
    document.getElementById('orderModal').hidden = true;
  });

  document.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () { addToCart(btn.dataset.add); });
  });
});
