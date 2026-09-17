/* Marge's Orbital Launch & Diner - tab cart, lightbox, napkin estimate. Vanilla JS. */

const PRODUCTS = {
  'pie':         { name: 'Re-Entry Cherry Pie (slice)', price: 4.5 },
  'meatloaf':    { name: 'Tuesday Meatloaf Special', price: 9.75 },
  'breakfast':   { name: 'The Countdown Breakfast', price: 8.25 },
  'coffee':      { name: 'Bottomless Coffee', price: 2.1 },
  'rideshare':   { name: 'Rideshare Seat (per kg to LEO)', price: 4900 },
  'integration': { name: 'Payload Integration', price: 650 },
  'standing':    { name: 'The Standing Order (monthly)', price: 140 }
};

function money(n) {
  return '$' + n.toLocaleString('en-US', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  });
}

function loadCart() {
  try { return JSON.parse(localStorage.getItem('marges_tab')) || {}; }
  catch (e) { return {}; }
}

function saveCart(c) {
  try { localStorage.setItem('marges_tab', JSON.stringify(c)); } catch (e) { /* private mode */ }
}

let cart = loadCart();

function cartCount() {
  return Object.values(cart).reduce(function (a, b) { return a + b; }, 0);
}

function updateCartButton() {
  const btn = document.getElementById('cartBtn');
  if (btn) btn.textContent = 'Tab (' + cartCount() + ')';
}

function addToCart(id) {
  if (!PRODUCTS[id]) return;
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartButton();
  toast(PRODUCTS[id].name + ' went on your tab.');
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
    list.innerHTML = '<p style="color:var(--muted); padding:20px 0; font-style:italic;">Nothing on the tab yet. Marge finds that hard to believe.</p>';
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
      '<strong>' + money(p.price * cart[id]) + '</strong>';
    const btns = row.querySelectorAll('button');
    btns[0].addEventListener('click', function () { changeQty(id, -1); });
    btns[1].addEventListener('click', function () { changeQty(id, 1); });
    list.appendChild(row);
  });
  if (totalEl) totalEl.textContent = money(total);
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
    toast('The tab is empty. Order something, you look hungry.');
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

/* ---------- Napkin estimate calculator ---------- */
const ORBIT_RATES = {
  leo:  { perKg: 4900, label: 'low Earth orbit' },
  sso:  { perKg: 6300, label: 'sun-synchronous orbit' },
  gto:  { perKg: 11800, label: 'geostationary transfer' },
  barn: { perKg: 95, label: "over the Hendersons' barn" }
};

const PIE_PRICE = 4.5;

function initCalc() {
  const orbit = document.getElementById('orbitSelect');
  const mass = document.getElementById('massSlider');
  const pie = document.getElementById('pieSlider');
  const sunday = document.getElementById('sundayCheck');
  if (!orbit || !mass || !pie) return;
  const massVal = document.getElementById('massVal');
  const pieVal = document.getElementById('pieVal');
  const launchCost = document.getElementById('launchCost');
  const lunchCost = document.getElementById('lunchCost');
  const totalCost = document.getElementById('totalCost');
  const verdict = document.getElementById('calcVerdict');

  function update() {
    const m = parseInt(mass.value, 10);
    const p = parseInt(pie.value, 10);
    massVal.textContent = m;
    pieVal.textContent = p;

    if (sunday && sunday.checked) {
      launchCost.textContent = 'No';
      lunchCost.textContent = money(p * PIE_PRICE);
      totalCost.textContent = money(p * PIE_PRICE);
      verdict.textContent = 'No launches on Sundays. Church. The pie counter opens at noon, and Marge will not be argued with on either point.';
      return;
    }

    const rate = ORBIT_RATES[orbit.value] || ORBIT_RATES.leo;
    const launch = m * rate.perKg;
    const lunch = p * PIE_PRICE;
    launchCost.textContent = money(launch);
    lunchCost.textContent = money(lunch);
    totalCost.textContent = money(launch + lunch);

    if (orbit.value === 'barn') {
      verdict.textContent = 'Bill calls this one "the errand." It uses the small rocket and you get your payload back by supper, weather and Hendersons permitting.';
    } else if (p === 0) {
      verdict.textContent = 'A ' + m + ' kg payload to ' + rate.label + ' and no pie. Marge will quote it, then she will bring you a slice anyway and add it to the check.';
    } else if (launch < 50000) {
      verdict.textContent = 'A modest ride to ' + rate.label + '. At this size Bill tucks it in next to somebody\'s crate of seed corn samples, and everyone gets there fine.';
    } else if (launch < 500000) {
      verdict.textContent = 'A respectable campaign to ' + rate.label + '. You get booth six for the week and Marge starts remembering how you take your eggs.';
    } else {
      verdict.textContent = 'At this size Marge closes the diner for the afternoon and Pastor Dan comes out to watch. Bring the ' + p + ' slices for the crew. You are the crew.';
    }
  }

  orbit.addEventListener('change', update);
  mass.addEventListener('input', update);
  pie.addEventListener('input', update);
  if (sunday) sunday.addEventListener('change', update);
  update();
}

/* ---------- Quote form ---------- */
function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.hidden = true;
    const done = document.getElementById('quoteDone');
    if (done) done.hidden = false;
  });
}

/* ---------- Wiring ---------- */
document.addEventListener('DOMContentLoaded', function () {
  updateCartButton();
  initLightbox();
  initCalc();
  initQuoteForm();

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
