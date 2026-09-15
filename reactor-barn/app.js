/* Hank & Sons Reactor Barn - wagon, lightbox, quote form, sizer. Vanilla JS. */

var PRODUCTS = {
  'pocket-rooster': { name: 'The Pocket Rooster', price: 9750 },
  'homestead':      { name: 'The Homestead', price: 48500 },
  'grain-silo':     { name: 'The Grain Silo', price: 61500 },
  'fixer-upper':    { name: 'The Fixer-Upper (as is)', price: 4000 },
  'dome-paint':     { name: 'Barn Quilt Dome Paint Job', price: 2200 },
  'tune-up':        { name: 'Annual Neutron Tune-Up', price: 180 },
  'shop-cap':       { name: 'Shop Cap (one size)', price: 18 }
};

function loadWagon() {
  try { return JSON.parse(localStorage.getItem('hs_wagon')) || {}; }
  catch (e) { return {}; }
}

function saveWagon() {
  try { localStorage.setItem('hs_wagon', JSON.stringify(wagon)); } catch (e) { /* private mode */ }
}

var wagon = loadWagon();

function wagonCount() {
  var n = 0;
  for (var k in wagon) n += wagon[k];
  return n;
}

function money(n) {
  return '$' + n.toLocaleString('en-US');
}

function updateWagonButton() {
  var btn = document.getElementById('wagonBtn');
  if (btn) btn.textContent = 'Wagon (' + wagonCount() + ')';
}

function addToWagon(id) {
  if (!PRODUCTS[id]) return;
  wagon[id] = (wagon[id] || 0) + 1;
  saveWagon();
  updateWagonButton();
  toast(PRODUCTS[id].name + ' loaded onto your wagon.');
}

function changeQty(id, delta) {
  wagon[id] = (wagon[id] || 0) + delta;
  if (wagon[id] <= 0) delete wagon[id];
  saveWagon();
  renderWagon();
  updateWagonButton();
}

function renderWagon() {
  var list = document.getElementById('wagonItems');
  var totalEl = document.getElementById('wagonTotal');
  if (!list) return;
  list.innerHTML = '';
  var total = 0;
  var ids = Object.keys(wagon);
  if (ids.length === 0) {
    list.innerHTML = '<p style="color:var(--muted); padding:18px 0;">Your wagon is empty. Even the free peppermints have to be picked up in person.</p>';
  }
  ids.forEach(function (id) {
    var p = PRODUCTS[id];
    if (!p) return;
    total += p.price * wagon[id];
    var row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML =
      '<span>' + p.name + '</span>' +
      '<span class="qty">' +
      '<button aria-label="Remove one">&minus;</button>' +
      '<span>' + wagon[id] + '</span>' +
      '<button aria-label="Add one">+</button>' +
      '</span>' +
      '<strong>' + money(p.price * wagon[id]) + '</strong>';
    var btns = row.querySelectorAll('button');
    btns[0].addEventListener('click', function () { changeQty(id, -1); });
    btns[1].addEventListener('click', function () { changeQty(id, 1); });
    list.appendChild(row);
  });
  if (totalEl) totalEl.textContent = money(total);
}

function openWagon() {
  document.getElementById('wagonDrawer').hidden = false;
  document.getElementById('drawerVeil').hidden = false;
  renderWagon();
}

function closeWagon() {
  document.getElementById('wagonDrawer').hidden = true;
  document.getElementById('drawerVeil').hidden = true;
}

function checkoutWagon() {
  if (wagonCount() === 0) {
    toast('Nothing on the wagon yet. Hank Jr. cannot ring up air.');
    return;
  }
  wagon = {};
  saveWagon();
  updateWagonButton();
  closeWagon();
  var m = document.getElementById('orderModal');
  if (m) m.hidden = false;
}

/* ---------- Toast ---------- */
var toastTimer = null;

function toast(msg) {
  var el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.style.opacity = '0'; }, 2800);
}

/* ---------- Image lightbox ---------- */
function initLightbox() {
  var veil = document.createElement('div');
  veil.className = 'modal-veil';
  veil.hidden = true;
  veil.innerHTML = '<figure style="margin:0;"><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(veil);
  var big = veil.querySelector('img');
  var cap = veil.querySelector('figcaption');

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

/* ---------- Quote modal ---------- */
function openQuote(modelName) {
  var m = document.getElementById('quoteModal');
  if (!m) return;
  var sel = document.getElementById('quoteModel');
  if (sel && modelName) sel.value = modelName;
  m.hidden = false;
}

function initQuote() {
  var m = document.getElementById('quoteModal');
  if (!m) return;

  document.querySelectorAll('[data-quote]').forEach(function (btn) {
    btn.addEventListener('click', function () { openQuote(btn.dataset.quote); });
  });

  var cancel = document.getElementById('quoteCancel');
  if (cancel) cancel.addEventListener('click', function () { m.hidden = true; });

  var form = document.getElementById('quoteForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    m.hidden = true;
    form.reset();
    var done = document.getElementById('quoteDone');
    if (done) done.hidden = false;
  });

  var doneClose = document.getElementById('quoteDoneClose');
  if (doneClose) doneClose.addEventListener('click', function () {
    document.getElementById('quoteDone').hidden = true;
  });
}

/* ---------- The Sizer ---------- */
var SIZER_STOPS = [
  { load: 'A toaster', model: 'The Pocket Rooster', mw: '0.2 megawatts',
    note: 'The Rooster will run your toaster until the sun burns out. Hank Sr. wants you to know he thinks this is a waste of a good reactor.' },
  { load: 'The deep freezer, plus some electric fence', model: 'The Pocket Rooster', mw: '0.2 megawatts',
    note: 'One Rooster handles this with room to spare. Your fence will never be so electric.' },
  { load: 'The house', model: 'The Homestead', mw: '1.5 megawatts',
    note: 'The Homestead was designed for exactly this. Matches most sheds, sits nice behind a lilac bush.' },
  { load: 'The hog barn', model: 'The Homestead', mw: '1.5 megawatts',
    note: 'Hogs run cooler than you would think. One Homestead does the barn, the heat lamps, and the radio Denise says the hogs like.' },
  { load: 'The whole farm', model: 'The Grain Silo', mw: '8 megawatts',
    note: 'The Silo blends right in next to your actual silos. Your neighbors will assume it is corn. Let them.' },
  { load: 'The co-op elevator', model: 'The Church Social', mw: '45 megawatts',
    note: 'This is Church Social territory. Bring a casserole to the install and it goes faster.' },
  { load: 'The town of Prairie Knob', model: 'The Church Social', mw: '45 megawatts',
    note: 'One Church Social carries the whole town, including the water tower lights and the sign that flashes the time and temperature.' },
  { load: 'The tri-county area', model: 'The County Line', mw: '1,100 megawatts',
    note: 'Now you are talking. This one is a phone call. Hank answers, and he will want to walk your property.' }
];

function initSizer() {
  var slider = document.getElementById('sizerRange');
  if (!slider) return;
  var loadEl = document.getElementById('sizerLoad');
  var modelEl = document.getElementById('sizerModel');
  var mwEl = document.getElementById('sizerMw');
  var noteEl = document.getElementById('sizerNote');

  function render() {
    var s = SIZER_STOPS[parseInt(slider.value, 10)];
    loadEl.textContent = s.load;
    modelEl.textContent = s.model;
    mwEl.textContent = s.mw;
    noteEl.textContent = s.note;
  }

  slider.addEventListener('input', render);
  render();
}

/* ---------- Wiring ---------- */
document.addEventListener('DOMContentLoaded', function () {
  updateWagonButton();
  initLightbox();
  initQuote();
  initSizer();

  var wagonBtn = document.getElementById('wagonBtn');
  if (wagonBtn) wagonBtn.addEventListener('click', openWagon);

  var closeBtn = document.getElementById('wagonClose');
  if (closeBtn) closeBtn.addEventListener('click', closeWagon);

  var veil = document.getElementById('drawerVeil');
  if (veil) veil.addEventListener('click', closeWagon);

  var checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', checkoutWagon);

  var orderClose = document.getElementById('orderClose');
  if (orderClose) orderClose.addEventListener('click', function () {
    document.getElementById('orderModal').hidden = true;
  });

  document.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () { addToWagon(btn.dataset.add); });
  });
});
