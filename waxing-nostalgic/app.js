/* Waxing Nostalgic - cart, lightbox, benefactor estimator. Vanilla JS. */

const PRODUCTS = {
  'sunday-at-grandmas':   { name: "Sunday at Grandma's", price: 38 },
  'locker-room-memories': { name: 'Locker Room Memories', price: 38 },
  'q-tip-confessional':   { name: 'Q-Tip Confessional', price: 42 },
  'single-origin-gary':   { name: 'Single-Origin Gary, Batch 34', price: 120 },
  'study-hall-1997':      { name: 'Study Hall 1997', price: 38 },
  'dads-workshop':        { name: "Dad's Workshop", price: 38 },
  'beach-day-regret':     { name: 'Beach Day Regret', price: 38 },
  'new-headphones':       { name: 'New Headphones', price: 40 },
  'wedding-slow-dance':   { name: 'Wedding Slow Dance', price: 44 },
  'the-waiting-room':     { name: 'The Waiting Room', price: 38 },
  'memory-flight':        { name: 'The Memory Flight (gift set of three)', price: 95 },
  'club-monthly':         { name: 'The Remembrance Club (monthly)', price: 29 }
};

function loadCart() {
  try { return JSON.parse(localStorage.getItem('wn_cart')) || {}; }
  catch (e) { return {}; }
}

function saveCart(c) {
  try { localStorage.setItem('wn_cart', JSON.stringify(c)); } catch (e) { /* private mode */ }
}

let cart = loadCart();

function cartCount() {
  return Object.values(cart).reduce(function (a, b) { return a + b; }, 0);
}

function updateCartButton() {
  const btn = document.getElementById('cartBtn');
  if (btn) btn.textContent = 'Parcel (' + cartCount() + ')';
}

function addToCart(id) {
  if (!PRODUCTS[id]) return;
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartButton();
  toast(PRODUCTS[id].name + ' wrapped and added to your parcel.');
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
    list.innerHTML = '<p style="color:var(--muted); padding:20px 0; font-style:italic;">Your parcel is empty. The ambiance remains, tragically, impersonal.</p>';
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
    toast('Your parcel is empty. Light nothing. Feel nothing.');
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

/* ---------- Benefactor estimator ---------- */
const TIERS = [
  { max: 0.5, name: 'The Occasional Contributor',
    desc: 'A modest gift, gratefully rendered. Your wax joins the community pool, where it mingles with its betters.' },
  { max: 1.5, name: 'The Committed Ear',
    desc: 'Reliable. Generous. The backbone of our supply chain. You receive priority lounge appointments and a tote bag nobody will ask about.' },
  { max: 3.0, name: 'The Estate Benefactor',
    desc: 'At this volume we send a technician to you. Your contributions are batch-tracked, and your name is engraved on a small plaque in the atelier.' },
  { max: 99,  name: 'The Gary Tier',
    desc: 'Extraordinary yield. Our sommeliers would like to meet you. Single-origin candidacy review included, pending a reference from your physician.' }
];

const CREDIT_PER_GRAM = 7.5;

function initEstimator() {
  const box = document.getElementById('estimator');
  if (!box) return;
  const slider = document.getElementById('gramSlider');
  const gramsEl = box.querySelector('.grams');
  const tierName = box.querySelector('.tier-name');
  const tierDesc = box.querySelector('.tier-desc');
  const creditEl = box.querySelector('.credit');

  function update() {
    const g = parseFloat(slider.value);
    gramsEl.innerHTML = g.toFixed(1) + ' <span>grams per month</span>';
    const tier = TIERS.find(function (t) { return g <= t.max; });
    tierName.textContent = tier.name;
    tierDesc.textContent = tier.desc;
    creditEl.textContent = 'Estimated store credit: $' + (g * CREDIT_PER_GRAM).toFixed(2) + ' per month';
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
  initEstimator();
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
