/* Fines & Dandy - site scripts (vanilla JS) */
(function () {
  'use strict';

  /* Mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Image modal */
  var modal = document.getElementById('img-modal');
  if (modal) {
    var modalImg = modal.querySelector('img');
    var modalCaption = modal.querySelector('.modal-caption');
    var closeBtn = modal.querySelector('.modal-close');

    var openModal = function (src, alt, caption) {
      modalImg.src = src;
      modalImg.alt = alt || '';
      modalCaption.textContent = caption || alt || '';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    var closeModal = function () {
      modal.classList.remove('open');
      modalImg.src = '';
      document.body.style.overflow = '';
    };

    document.querySelectorAll('img.zoomable').forEach(function (img) {
      img.addEventListener('click', function () {
        openModal(img.src, img.alt, img.getAttribute('data-caption'));
      });
    });
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  /* Cart (shop page) */
  var fab = document.getElementById('cart-fab');
  if (fab) {
    var panel = document.getElementById('cart-panel');
    var linesEl = document.getElementById('cart-lines');
    var totalEl = document.getElementById('cart-total');
    var checkoutBtn = document.getElementById('checkout-btn');
    var checkoutMsg = document.getElementById('checkout-msg');
    var cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('fd-cart') || '[]');
    } catch (e) { cart = []; }

    var persist = function () {
      try { localStorage.setItem('fd-cart', JSON.stringify(cart)); } catch (e) { /* fine */ }
    };

    var render = function () {
      linesEl.innerHTML = '';
      var total = 0;
      cart.forEach(function (item, i) {
        total += item.price * item.qty;
        var line = document.createElement('div');
        line.className = 'cart-line';
        var label = document.createElement('span');
        label.textContent = item.qty + ' × ' + item.name;
        var right = document.createElement('span');
        right.textContent = '$' + item.price * item.qty + ' ';
        var rm = document.createElement('button');
        rm.textContent = 'remove';
        rm.setAttribute('aria-label', 'Remove ' + item.name);
        rm.addEventListener('click', function () {
          cart.splice(i, 1);
          persist();
          render();
        });
        right.appendChild(rm);
        line.appendChild(label);
        line.appendChild(right);
        linesEl.appendChild(line);
      });
      if (!cart.length) {
        linesEl.innerHTML = '<p class="cart-note">Your cart is empty. Like a bag with the fines taken out.</p>';
      }
      totalEl.textContent = 'Total: $' + total;
      var count = cart.reduce(function (n, item) { return n + item.qty; }, 0);
      fab.textContent = 'Cart (' + count + ')';
    };

    document.querySelectorAll('.add-to-cart').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var name = btn.getAttribute('data-name');
        var variantSel = btn.getAttribute('data-variant');
        if (variantSel) {
          var sel = document.getElementById(variantSel);
          if (sel) name += ': ' + sel.value;
        }
        var price = parseInt(btn.getAttribute('data-price'), 10);
        var existing = cart.find(function (item) { return item.name === name; });
        if (existing) existing.qty += 1;
        else cart.push({ name: name, price: price, qty: 1 });
        persist();
        render();
        panel.classList.add('open');
      });
    });

    fab.addEventListener('click', function () { panel.classList.toggle('open'); });
    document.getElementById('cart-close').addEventListener('click', function () {
      panel.classList.remove('open');
    });

    checkoutBtn.addEventListener('click', function () {
      if (!cart.length) {
        checkoutMsg.textContent = 'Add something first. The dust will wait, but not like this.';
        checkoutMsg.hidden = false;
        return;
      }
      cart = [];
      persist();
      render();
      checkoutMsg.textContent = 'Order placed. Your fines are settling into a box as we speak. Expect sediment in 2 to 3 business days.';
      checkoutMsg.hidden = false;
    });

    render();
  }

  /* Wholesale quote form */
  var quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('quote-msg');
      var name = document.getElementById('q-name').value.trim() || 'friend';
      msg.textContent = 'Thanks, ' + name + '. A quote is being written by hand and will reach you once it settles, typically 2 business days.';
      msg.hidden = false;
      quoteForm.reset();
    });
  }

  /* Store locator */
  var locatorForm = document.getElementById('locator-form');
  if (locatorForm) {
    var stores = [
      { name: "Hearthstone Grocers", street: "Marsh Rd" },
      { name: "The Pantry Collective", street: "Alder Ave" },
      { name: "Miller's Corner Market", street: "2nd St" },
      { name: "Good Earth Provisions", street: "Juniper Ln" },
      { name: "Wheatfield & Co.", street: "Depot St" },
      { name: "The Dry Goods Room", street: "Harvest Way" },
      { name: "Sifton's Family Foods", street: "Prairie Blvd" },
      { name: "Golden Hour Market", street: "Old Mill Rd" }
    ];
    var shelves = [
      "Aisle 4, bottom shelf, all the way back",
      "Aisle 7, bottom shelf, behind the oat bran",
      "Aisle 2, bottom shelf, you'll have to kneel",
      "Aisle 6, bottom shelf, left of the floor drain",
      "Aisle 3, bottom shelf, under the granola you can reach"
    ];
    locatorForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var zip = document.getElementById('zip').value.trim();
      var seed = 0;
      for (var i = 0; i < zip.length; i++) seed = (seed * 31 + zip.charCodeAt(i)) % 9973;
      var list = document.getElementById('store-list');
      list.innerHTML = '';
      for (var j = 0; j < 3; j++) {
        var store = stores[(seed + j * 3) % stores.length];
        var shelf = shelves[(seed + j) % shelves.length];
        var dist = ((seed % 40) / 10 + j * 1.7 + 0.4).toFixed(1);
        var li = document.createElement('li');
        li.className = 'store';
        var left = document.createElement('div');
        var strong = document.createElement('strong');
        strong.textContent = store.name;
        var addr = document.createElement('div');
        addr.textContent = (100 + ((seed + j * 47) % 899)) + ' ' + store.street + ' · ' + dist + ' miles';
        left.appendChild(strong);
        left.appendChild(addr);
        var right = document.createElement('div');
        right.className = 'shelf';
        right.textContent = shelf;
        li.appendChild(left);
        li.appendChild(right);
        list.appendChild(li);
      }
      list.hidden = false;
      document.getElementById('locator-note').hidden = false;
    });
  }
})();
