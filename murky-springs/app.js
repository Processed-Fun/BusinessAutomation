/* Murky Springs Soda Co. - cart, lightbox, pairing oracle. Vanilla JS. */

const PRODUCTS = {
  'hot-dog-water':      { name: 'Hot Dog Water', price: 6 },
  'public-pool':        { name: 'Public Pool', price: 6 },
  'aquarium-gravel':    { name: 'Aquarium Gravel', price: 6 },
  'new-tire-smell':     { name: 'New Tire Smell', price: 7 },
  'garden-hose':        { name: 'Garden Hose', price: 6 },
  'vase-water':         { name: 'Vase Water', price: 6 },
  'cooler-melt':        { name: 'Cooler Melt', price: 6 },
  'mop-bucket':         { name: 'Mop Bucket', price: 6 },
  'parking-lot-slush':  { name: 'Parking Lot Slush', price: 6 },
  'rain-gutter-reserve': { name: 'Rain Gutter Reserve 2026', price: 24 },
  'curiosity-six':      { name: 'The Curiosity Six-Pack', price: 30 },
  'full-murk':          { name: 'The Full Murk (all ten)', price: 52 },
  'club-shallow':       { name: 'Shallow End Club (monthly)', price: 18 },
  'club-deep':          { name: 'Deep End Club (monthly)', price: 42 }
};

function loadCart() {
  try { return JSON.parse(localStorage.getItem('ms_cart')) || {}; }
  catch (e) { return {}; }
}

function saveCart(c) {
  try { localStorage.setItem('ms_cart', JSON.stringify(c)); } catch (e) { /* private mode */ }
}

let cart = loadCart();

function cartCount() {
  return Object.values(cart).reduce(function (a, b) { return a + b; }, 0);
}

function updateCartButton() {
  const btn = document.getElementById('cartBtn');
  if (btn) btn.textContent = 'Crate (' + cartCount() + ')';
}

function addToCart(id) {
  if (!PRODUCTS[id]) return;
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartButton();
  toast(PRODUCTS[id].name + ' added to your crate. Bold choice.');
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
    list.innerHTML = '<p style="color:var(--muted); padding:20px 0;">Your crate is empty. Your taste buds thank you. Your curiosity does not.</p>';
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
    toast('The crate is empty. We admire your restraint.');
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

/* ---------- Pairing Oracle ---------- */
const ORACLE = {
  dmv: {
    flavor: 'New Tire Smell',
    note: 'A long wait deserves a long finish. Notes of fresh rubber and the faint hope your number gets called before closing.'
  },
  family: {
    flavor: 'Hot Dog Water',
    note: 'Familiar. Salty. Lingers longer than anyone asked it to. Just like the conversation you are about to have.'
  },
  jury: {
    flavor: 'Mop Bucket',
    note: 'Civic duty calls for something institutional. Faint suds, gray undertones, and a verdict you can taste.'
  },
  breakup: {
    flavor: 'Vase Water',
    note: 'The flowers are gone. The water remains. Sip slowly and let the floral sediment do the grieving for you.'
  },
  monday: {
    flavor: 'Parking Lot Slush',
    note: 'Cold, gray, and everywhere you look. Might as well drink it and take back some control.'
  },
  victory: {
    flavor: 'Rain Gutter Reserve 2026',
    note: 'You earned the good stuff. Wax-dipped, leaf-forward, and aged on the roof the way nature intended.'
  }
};

function initOracle() {
  const box = document.getElementById('oracle');
  if (!box) return;
  const buttons = box.querySelectorAll('.oracle-choices button');
  const nameEl = box.querySelector('.flavor-name');
  const noteEl = box.querySelector('.pairing-note');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const pick = ORACLE[btn.dataset.mood];
      if (!pick) return;
      nameEl.textContent = pick.flavor;
      noteEl.textContent = pick.note;
    });
  });
}

/* ---------- Reserve allocation form ---------- */
function initReserveForm() {
  const form = document.getElementById('reserveForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.hidden = true;
    const done = document.getElementById('reserveDone');
    if (done) done.hidden = false;
  });
}

/* ---------- Wiring ---------- */
document.addEventListener('DOMContentLoaded', function () {
  updateCartButton();
  initLightbox();
  initOracle();
  initReserveForm();

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
