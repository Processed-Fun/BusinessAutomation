/* Perfectly Balanced Dice Co. Site logic. Vanilla JS, like the dice. */

(function () {
  "use strict";

  var CART_KEY = "pbdc-cart";

  function money(n) {
    return "$" + n.toLocaleString("en-US");
  }

  function getProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  /* ---------- cart ---------- */

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function writeCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) { /* the cart, like the dice, may not persist */ }
    renderCart();
  }

  function addToCart(id) {
    var cart = readCart();
    cart[id] = (cart[id] || 0) + 1;
    writeCart(cart);
    openDrawer();
  }

  function removeFromCart(id) {
    var cart = readCart();
    delete cart[id];
    writeCart(cart);
  }

  function cartCount(cart) {
    var n = 0;
    for (var k in cart) n += cart[k];
    return n;
  }

  function renderCart() {
    var cart = readCart();
    var countEl = document.getElementById("cart-count");
    if (countEl) countEl.textContent = String(cartCount(cart));

    var body = document.getElementById("cart-lines");
    var totalEl = document.getElementById("cart-total");
    var weightEl = document.getElementById("cart-weight");
    if (!body) return;

    body.innerHTML = "";
    var total = 0;
    var weight = 0;
    var any = false;

    for (var id in cart) {
      var p = getProduct(id);
      if (!p) continue;
      any = true;
      total += p.price * cart[id];
      weight += parseFloat(p.weight) * cart[id];

      var line = document.createElement("div");
      line.className = "cart-line";
      var label = document.createElement("span");
      label.textContent = p.name + " (" + p.die + ") x" + cart[id];
      var right = document.createElement("span");
      right.textContent = money(p.price * cart[id]) + " ";
      var rm = document.createElement("button");
      rm.textContent = "[remove]";
      rm.setAttribute("aria-label", "Remove " + p.name);
      (function (pid) {
        rm.addEventListener("click", function () { removeFromCart(pid); });
      })(id);
      right.appendChild(rm);
      line.appendChild(label);
      line.appendChild(right);
      body.appendChild(line);
    }

    if (!any) {
      body.innerHTML = "<p class=\"mono\">Cart is empty. Statistically unlikely to stay that way.</p>";
    }
    if (totalEl) totalEl.textContent = money(total);
    if (weightEl) weightEl.textContent = weight ? weight.toFixed(1) + " lb" : "0 lb";
  }

  function openDrawer() {
    var d = document.getElementById("cart-drawer");
    if (d) d.classList.add("open");
  }

  function closeDrawer() {
    var d = document.getElementById("cart-drawer");
    if (d) d.classList.remove("open");
  }

  function checkout() {
    var cart = readCart();
    if (!cartCount(cart)) {
      alert("Your cart is empty. Roll again.");
      return;
    }
    var weight = 0;
    for (var id in cart) {
      var p = getProduct(id);
      if (p) weight += parseFloat(p.weight) * cart[id];
    }
    alert(
      "Order received.\n\nEstimated shipping weight: " + weight.toFixed(1) + " lb.\n" +
      "Our shipping calculator looked at this and quit, so a human will email you a number.\n\n" +
      "Thank you for choosing Perfectly Balanced Dice Co."
    );
    writeCart({});
    closeDrawer();
  }

  /* ---------- catalog rendering ---------- */

  function productCard(p) {
    var card = document.createElement("article");
    card.className = "card";
    var buy = p.purchase === "cart"
      ? "<button class=\"add-btn\" data-add=\"" + p.id + "\">Add to cart</button>"
      : "<a class=\"quote-btn\" href=\"product.html?d=" + p.id + "#quote\">Freight quote</a>";
    card.innerHTML =
      "<a class=\"imglink\" href=\"product.html?d=" + p.id + "\">" +
      "<img src=\"images/product-" + p.id + ".webp\" alt=\"" + p.name + ", a " + p.die + " made of " + p.material.toLowerCase() + "\" loading=\"lazy\"></a>" +
      "<div class=\"card-body\">" +
      "<span class=\"die-tag\">" + p.die + " / " + p.weight + "</span>" +
      "<h3><a href=\"product.html?d=" + p.id + "\">" + p.name + "</a></h3>" +
      "<p class=\"mat\">" + p.material + "</p>" +
      "<p class=\"tag\">" + p.tagline + "</p>" +
      "<div class=\"card-foot\"><span class=\"price\">" + money(p.price) + "</span>" + buy + "</div>" +
      "</div>";
    return card;
  }

  function renderGrid(elId, list) {
    var el = document.getElementById(elId);
    if (!el) return;
    list.forEach(function (p) { el.appendChild(productCard(p)); });
  }

  /* ---------- product page ---------- */

  function renderProductPage() {
    var wrap = document.getElementById("product-detail");
    if (!wrap) return;
    var id = new URLSearchParams(location.search).get("d");
    var p = getProduct(id) || getProduct("erratic");

    document.title = p.name + " (" + p.die + ") | Perfectly Balanced Dice Co.";

    var specs = p.specs.map(function (s) {
      var parts = s.split(": ");
      return "<tr><td>" + parts[0] + "</td><td>" + (parts[1] || "") + "</td></tr>";
    }).join("");

    var buy = p.purchase === "cart"
      ? "<button class=\"btn\" data-add=\"" + p.id + "\">Add to cart</button>"
      : "<a class=\"btn\" href=\"#quote\">Request freight quote</a>";

    wrap.innerHTML =
      "<img class=\"photo\" src=\"images/product-" + p.id + ".webp\" alt=\"" + p.name + ", a " + p.die + " made of " + p.material.toLowerCase() + "\" data-modal>" +
      "<div>" +
      "<p class=\"kicker\">" + p.die + " / " + p.material + " / " + p.weight + "</p>" +
      "<h1>" + p.name + "</h1>" +
      "<p><strong>" + p.tagline + "</strong></p>" +
      "<p>" + p.blurb + "</p>" +
      "<table class=\"spec-table\"><tbody>" +
      "<tr><td>Dimensions</td><td>" + p.dims + "</td></tr>" +
      specs +
      "</tbody></table>" +
      "<div class=\"fairness\"><p class=\"kicker\">Fairness report</p><p class=\"verdict\">" + p.fairness + "</p></div>" +
      "<p class=\"big-price\">" + money(p.price) + (p.purchase === "freight" ? " + freight" : "") + "</p>" +
      buy +
      "</div>";

    var quote = document.getElementById("quote");
    if (quote && p.purchase !== "freight") quote.hidden = true;
    var quoteName = document.getElementById("quote-product");
    if (quoteName) quoteName.value = p.name + " (" + p.die + ", " + p.weight + ")";
  }

  /* ---------- gallery ---------- */

  function renderGallery() {
    var el = document.getElementById("gallery-grid");
    if (!el || typeof GALLERY === "undefined") return;
    GALLERY.forEach(function (g) {
      var fig = document.createElement("figure");
      fig.className = "insta";
      fig.style.margin = "0";
      fig.innerHTML =
        "<img src=\"" + g.img + "\" alt=\"Customer photo: " + g.caption.replace(/"/g, "&quot;") + "\" loading=\"lazy\" data-modal>" +
        "<p>" + g.caption + "</p>";
      el.appendChild(fig);
    });
  }

  /* ---------- image modal ---------- */

  function setupModal() {
    var modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = "<img alt=\"\">";
    document.body.appendChild(modal);
    var img = modal.querySelector("img");

    document.body.addEventListener("click", function (e) {
      var t = e.target;
      if (t.tagName === "IMG" && t.hasAttribute("data-modal")) {
        img.src = t.src;
        img.alt = t.alt;
        modal.classList.add("open");
      } else if (e.target === modal || e.target === img) {
        modal.classList.remove("open");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") modal.classList.remove("open");
    });
  }

  /* ---------- quote form ---------- */

  function setupQuoteForm() {
    var form = document.getElementById("quote-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var stairs = form.querySelector("[name=stairs]");
      var msg = "Quote request received.\n\nA freight specialist will call you";
      if (stairs && stairs.value !== "0") {
        msg += " and, given the stairs, possibly a second specialist";
      }
      msg += ". Please clear a path from the curb before delivery.";
      alert(msg);
      form.reset();
    });
  }

  /* ---------- boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    renderGrid("featured-grid", PRODUCTS.filter(function (p) {
      return ["erratic", "grandfather", "splinter", "riverbed-three"].indexOf(p.id) !== -1;
    }));
    renderGrid("catalog-grid", PRODUCTS);
    renderProductPage();
    renderGallery();
    setupModal();
    setupQuoteForm();
    renderCart();

    document.body.addEventListener("click", function (e) {
      var add = e.target.getAttribute && e.target.getAttribute("data-add");
      if (add) addToCart(add);
    });

    var cartBtn = document.getElementById("cart-open");
    if (cartBtn) cartBtn.addEventListener("click", openDrawer);
    var cartClose = document.getElementById("cart-close");
    if (cartClose) cartClose.addEventListener("click", closeDrawer);
    var checkoutBtn = document.getElementById("cart-checkout");
    if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
  });
})();
