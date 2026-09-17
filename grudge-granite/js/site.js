/* Grudge Granite shared scripts: cart, lightbox, toast, checkout modal. */
(function () {
  'use strict';

  // ---- Cart ----
  var CART_KEY = 'gg-cart';

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(items) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) { /* private browsing; cart lives for the page only */ }
    updateCartPill(items);
  }

  var memoryCart = null;

  function getCart() {
    if (memoryCart === null) memoryCart = readCart();
    return memoryCart;
  }

  function updateCartPill(items) {
    var pill = document.getElementById('cartPill');
    if (!pill) return;
    var n = items.length;
    pill.textContent = 'Cart (' + n + ')';
  }

  window.ggAddToCart = function (name, price) {
    var cart = getCart();
    cart.push({ name: name, price: price });
    writeCart(cart);
    showToast(name + ' added to cart. $' + price.toLocaleString());
  };

  // ---- Toast ----
  var toastTimer = null;

  function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  window.ggToast = showToast;

  // ---- Checkout ----
  function checkout() {
    var cart = getCart();
    var modal = document.getElementById('checkoutModal');
    var body = document.getElementById('checkoutBody');
    if (!modal || !body) return;
    if (cart.length === 0) {
      body.innerHTML = '<p>Your cart is empty. Surely someone has wronged you.</p>';
    } else {
      var total = cart.reduce(function (s, i) { return s + i.price; }, 0);
      var lines = cart.map(function (i) {
        return '<li>' + escapeHtml(i.name) + ' &middot; $' + i.price.toLocaleString() + '</li>';
      }).join('');
      body.innerHTML = '<ul style="text-align:left">' + lines + '</ul>' +
        '<p><strong>Total: $' + total.toLocaleString() + '</strong></p>' +
        '<p>Order received. A grievance counselor will call you to confirm spelling. ' +
        'We engrave exactly what you wrote, so read it twice.</p>';
      memoryCart = [];
      writeCart([]);
    }
    modal.hidden = false;
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // ---- Lightbox ----
  function openLightbox(src, caption) {
    var modal = document.getElementById('lightbox');
    if (!modal) return;
    modal.querySelector('img').src = src;
    modal.querySelector('.caption').textContent = caption || '';
    modal.hidden = false;
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest('img[data-zoom]');
    if (img) {
      openLightbox(img.src, img.getAttribute('data-caption') || img.alt);
      return;
    }
    if (e.target.closest('#cartPill')) {
      checkout();
      return;
    }
    var modal = e.target.closest('.modal');
    if (modal && (e.target === modal || e.target.closest('.close-x') || e.target.closest('[data-close]'))) {
      modal.hidden = true;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(function (m) { m.hidden = true; });
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    updateCartPill(getCart());
  });
})();
