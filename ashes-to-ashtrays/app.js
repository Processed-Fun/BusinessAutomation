/* Ashes to Ashtrays - arrangements cart, lightbox, heirloom projector. Vanilla JS. */

const PRODUCTS = {
  'urnest':          { name: 'The Urnest', price: 380 },
  'poetic-justice':  { name: 'Poetic Justice', price: 440 },
  'matriarch':       { name: 'The Matriarch', price: 520 },
  'long-goodbye':    { name: 'The Long Goodbye', price: 460 },
  'traveler':        { name: 'The Traveler', price: 290 },
  'estate-coasters': { name: 'The Estate Coaster Set', price: 620 },
  'patience-plan':   { name: 'The Patience Plan (monthly)', price: 12 }
};

function loadCart() {
  try { return JSON.parse(localStorage.getItem('ata_cart')) || {}; }
  catch (e) { return {}; }
}

function saveCart(c) {
  try { localStorage.setItem('ata_cart', JSON.stringify(c)); } catch (e) { /* private mode */ }
}

let cart = loadCart();

function cartCount() {
  return Object.values(cart).reduce(function (a, b) { return a + b; }, 0);
}

function updateCartButton() {
  const btn = document.getElementById('cartBtn');
  if (btn) btn.textContent = 'Arrangements (' + cartCount() + ')';
}

function addToCart(id) {
  if (!PRODUCTS[id]) return;
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartButton();
  toast(PRODUCTS[id].name + ' added to your arrangements, respectfully.');
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
    list.innerHTML = '<p style="color:var(--muted); padding:20px 0; font-style:italic;">No arrangements yet. The mantel remains unattended.</p>';
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
  if (cartCount() === 0) {
    toast('Your arrangements are empty. Everyone is, for now, still with us.');
    return;
  }
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

/* ---------- Heirloom projector ---------- */
const STAGES = [
  { name: 'The Quiet Vessel',
    desc: 'A dignified beginning. One story, told at every holiday, whether guests ask or not.' },
  { name: 'The Reunion',
    desc: 'Two generations, together again, sharing a rim. They argued for decades. The glaze settled it.' },
  { name: 'The True Heirloom',
    desc: 'Guests will ask. You will tell them. Several will quit smoking on the drive home.' },
  { name: 'The Centerpiece',
    desc: 'Roughly the size of a serving platter. Thanksgiving is now held around it, per the will.' },
  { name: 'The Furniture',
    desc: 'The ashtray requires its own table. The table is also in the will. The will is getting long.' },
  { name: 'The Institution',
    desc: 'Classified by our insurers as furniture. Classified by your family as the family.' },
  { name: 'The Landmark',
    desc: 'Visible in aerial photographs of the property. Local birds bathe in it, respectfully.' },
  { name: 'The Monument',
    desc: 'Installed on site with a crane and a chaplain. The neighborhood has adjusted. Mostly.' }
];

const BASE_DIAMETER = 7.5;
const INCHES_PER_GEN = 2;
const BASE_PRICE = 1900;
const PRICE_PER_GEN = 240;
const RESTS_PER_GEN = 3;

function initProjector() {
  const box = document.getElementById('projector');
  if (!box) return;
  const slider = document.getElementById('genSlider');
  const gensEl = box.querySelector('.gens');
  const diamEl = box.querySelector('.diam');
  const restsEl = box.querySelector('.rests');
  const estEl = box.querySelector('.est');
  const stageName = box.querySelector('.stage-name');
  const stageDesc = box.querySelector('.stage-desc');

  function update() {
    const g = parseInt(slider.value, 10);
    gensEl.innerHTML = g + ' <span>generation' + (g === 1 ? '' : 's') + '</span>';
    const inches = BASE_DIAMETER + (g - 1) * INCHES_PER_GEN;
    diamEl.textContent = inches >= 36
      ? (inches / 12).toFixed(1) + ' ft'
      : inches.toFixed(1) + '"';
    restsEl.textContent = g * RESTS_PER_GEN;
    const price = BASE_PRICE + (g - 1) * PRICE_PER_GEN;
    estEl.textContent = '$' + price.toLocaleString('en-US');
    const stage = STAGES[g - 1];
    stageName.textContent = stage.name;
    stageDesc.textContent = stage.desc;
  }

  slider.addEventListener('input', update);
  update();
}

/* ---------- Consultation form ---------- */
function initConsultForm() {
  const form = document.getElementById('consultForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.hidden = true;
    const done = document.getElementById('consultDone');
    if (done) done.hidden = false;
  });
}

/* ---------- Wiring ---------- */
document.addEventListener('DOMContentLoaded', function () {
  updateCartButton();
  initLightbox();
  initProjector();
  initConsultForm();

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
