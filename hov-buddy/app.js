/* HOV Buddy - manifest cart, lightbox, diamond lane calculator. Vanilla JS. */

const PRODUCTS = {
  'greg':       { name: 'Nodding Greg (weekly)', price: 39 },
  'carol':      { name: 'Sleeping Aunt Carol (weekly)', price: 34 },
  'dave':       { name: 'Conversational Dave (weekly)', price: 89 },
  'tyler':      { name: 'Teen Tyler (weekly)', price: 29 },
  'eleanor':    { name: 'Executive Eleanor (weekly)', price: 59 },
  'denise':     { name: 'Golden Retriever Denise (weekly)', price: 27 },
  'commuter':   { name: 'The Commuter (monthly)', price: 79 },
  'committed':  { name: 'The Committed (monthly)', price: 139 },
  'protection': { name: 'Traffic Stop Protection Plan (monthly)', price: 9 }
};

function loadCart() {
  try { return JSON.parse(localStorage.getItem('hov_cart')) || {}; }
  catch (e) { return {}; }
}

function saveCart(c) {
  try { localStorage.setItem('hov_cart', JSON.stringify(c)); } catch (e) { /* private mode */ }
}

let cart = loadCart();

function cartCount() {
  return Object.values(cart).reduce(function (a, b) { return a + b; }, 0);
}

function updateCartButton() {
  const btn = document.getElementById('cartBtn');
  if (btn) btn.textContent = 'Manifest (' + cartCount() + ')';
}

function addToCart(id) {
  if (!PRODUCTS[id]) return;
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartButton();
  toast(PRODUCTS[id].name + ' joined your manifest.');
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
    list.innerHTML = '<p style="color:var(--muted); padding:20px 0; font-style:italic;">The manifest is empty. The passenger seat remains a rumor.</p>';
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
    toast('The manifest is empty. You would be carpooling with yourself.');
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

/* ---------- Diamond lane calculator ---------- */
const WEEKS_PER_YEAR = 48;
const CARS_PER_MINUTE = 22;

const VERDICTS = [
  { max: 40,       text: 'Enough time back to finally learn to whistle. Greg will pretend to be impressed.' },
  { max: 90,       text: 'More than two workweeks returned to you each year. Spend them stuck behind someone in the regular lanes, for old times’ sake.' },
  { max: 160,      text: 'At this rate the commute owes you a vacation. Carol sleeps through the whole thing either way.' },
  { max: Infinity, text: 'You would save over a week of waking life per year. Dave has a boat story that fills most of it.' }
];

function initCalc() {
  const mins = document.getElementById('minsSlider');
  const days = document.getElementById('daysSlider');
  if (!mins || !days) return;
  const minsVal = document.getElementById('minsVal');
  const daysVal = document.getElementById('daysVal');
  const hoursYear = document.getElementById('hoursYear');
  const carsPassed = document.getElementById('carsPassed');
  const verdict = document.getElementById('calcVerdict');

  function update() {
    const m = parseInt(mins.value, 10);
    const d = parseInt(days.value, 10);
    minsVal.textContent = m;
    daysVal.textContent = d;
    const hours = Math.round((m * 2 * d * WEEKS_PER_YEAR) / 60);
    hoursYear.textContent = hours;
    carsPassed.textContent = (m * CARS_PER_MINUTE).toLocaleString('en-US');
    for (let i = 0; i < VERDICTS.length; i++) {
      if (hours <= VERDICTS[i].max) { verdict.textContent = VERDICTS[i].text; break; }
    }
  }

  mins.addEventListener('input', update);
  days.addEventListener('input', update);
  update();
}

/* ---------- Fleet quote form ---------- */
function initFleetForm() {
  const form = document.getElementById('fleetForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.hidden = true;
    const done = document.getElementById('fleetDone');
    if (done) done.hidden = false;
  });
}

/* ---------- Wiring ---------- */
document.addEventListener('DOMContentLoaded', function () {
  updateCartButton();
  initLightbox();
  initCalc();
  initFleetForm();

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
