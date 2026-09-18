// Twig & Perch Realty: shared behavior.
(function () {
  'use strict';

  function fmtSeed(n) {
    return n.toLocaleString('en-US');
  }

  function badgeClass(status) {
    if (status === 'Sold') return 'badge sold';
    if (status === 'Pending') return 'badge pending';
    return 'badge';
  }

  function cardHTML(l) {
    var url = 'listing.html?id=' + encodeURIComponent(l.id);
    return '' +
      '<article class="card" data-id="' + l.id + '">' +
      '  <a class="photo" href="' + url + '">' +
      '    <img src="images/' + l.photos[0] + '.webp" alt="' + l.name + ', a ' + l.style + ' birdhouse" loading="lazy">' +
      '    <span class="' + badgeClass(l.status) + '">' + l.status + '</span>' +
      '  </a>' +
      '  <div class="body">' +
      '    <div class="price">' + fmtSeed(l.price) + '<small>seed</small></div>' +
      '    <h3><a href="' + url + '">' + l.name + '</a></h3>' +
      '    <p class="blurb">' + l.blurb + '</p>' +
      '    <div class="specs"><span>' + l.sqin + ' sq in</span><span>' + l.perches +
             (l.perches === 1 ? ' perch' : ' perches') + '</span><span>' + l.style + '</span></div>' +
      '  </div>' +
      '</article>';
  }

  // Featured listings on the home page.
  var featured = document.getElementById('featured-listings');
  if (featured && window.TP_LISTINGS) {
    var picks = ['painted-lady', 'case-study-4', 'chalet-ptarmigan'];
    featured.innerHTML = TP_LISTINGS.filter(function (l) {
      return picks.indexOf(l.id) !== -1;
    }).map(cardHTML).join('');
  }

  // Full portfolio with filters.
  var grid = document.getElementById('listings-grid');
  if (grid && window.TP_LISTINGS) {
    var styleSel = document.getElementById('f-style');
    var priceSel = document.getElementById('f-price');
    var perchSel = document.getElementById('f-perches');
    var statusSel = document.getElementById('f-status');
    var sortSel = document.getElementById('f-sort');
    var count = document.getElementById('result-count');
    var noRes = document.getElementById('no-results');

    var styles = [];
    TP_LISTINGS.forEach(function (l) {
      if (styles.indexOf(l.style) === -1) styles.push(l.style);
    });
    styles.sort().forEach(function (s) {
      var o = document.createElement('option');
      o.value = s;
      o.textContent = s;
      styleSel.appendChild(o);
    });

    function apply() {
      var list = TP_LISTINGS.slice();
      if (styleSel.value !== 'all') list = list.filter(function (l) { return l.style === styleSel.value; });
      if (priceSel.value !== 'all') list = list.filter(function (l) { return l.price <= Number(priceSel.value); });
      if (perchSel.value !== 'all') list = list.filter(function (l) { return l.perches >= Number(perchSel.value); });
      if (statusSel.value !== 'all') list = list.filter(function (l) { return l.status === statusSel.value; });
      if (sortSel.value === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
      if (sortSel.value === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
      if (sortSel.value === 'sqin-desc') list.sort(function (a, b) { return b.sqin - a.sqin; });
      grid.innerHTML = list.map(cardHTML).join('');
      count.textContent = list.length === TP_LISTINGS.length
        ? 'Showing the full portfolio, ' + list.length + ' residences'
        : 'Showing ' + list.length + ' of ' + TP_LISTINGS.length + ' residences';
      noRes.hidden = list.length !== 0;
    }

    [styleSel, priceSel, perchSel, statusSel, sortSel].forEach(function (el) {
      el.addEventListener('change', apply);
    });
    apply();
  }

  // Listing detail page.
  var detail = document.getElementById('listing-detail');
  if (detail && window.TP_LISTINGS) {
    var id = new URLSearchParams(window.location.search).get('id');
    var l = null;
    TP_LISTINGS.forEach(function (x) { if (x.id === id) l = x; });
    if (!l) l = TP_LISTINGS[0];
    var a = TP_AGENTS[l.agent];
    document.title = l.name + ' | Twig & Perch Realty';

    var thumbs = l.photos.map(function (p, i) {
      return '<img src="images/' + p + '.webp" alt="View ' + (i + 1) + ' of ' + l.name + '" data-photo="' + p + '"' + (i === 0 ? ' class="on"' : '') + '>';
    }).join('');

    detail.innerHTML = '' +
      '<div class="gallery">' +
      '  <div class="main"><img id="main-photo" src="images/' + l.photos[0] + '.webp" alt="' + l.name + ', a ' + l.style + ' birdhouse" data-modal></div>' +
      (l.photos.length > 1 ? '  <div class="thumbs" id="thumbs">' + thumbs + '</div>' : '') +
      '  <div class="panel">' +
      '    <h3>Seller Disclosures</h3>' +
      '    <ul class="disclosures">' + l.disclosures.map(function (d) { return '<li>' + d + '</li>'; }).join('') + '</ul>' +
      '  </div>' +
      '</div>' +
      '<div class="detail-side">' +
      '  <p class="kicker">' + l.status + ' &middot; ' + l.style + '</p>' +
      '  <h1 style="font-size:2rem">' + l.name + '</h1>' +
      '  <div class="price">' + fmtSeed(l.price) + '<small>seed</small></div>' +
      '  <table class="spec-table">' +
      '    <tr><td>Square inchage</td><td>' + l.sqin + ' sq in</td></tr>' +
      '    <tr><td>Perches</td><td>' + l.perches + '</td></tr>' +
      '    <tr><td>Sun exposure</td><td>' + l.sun + '</td></tr>' +
      '    <tr><td>Elevation</td><td>' + l.height + '</td></tr>' +
      '    <tr><td>Open house</td><td>' + l.openHouse + '</td></tr>' +
      '  </table>' +
      '  <p>' + l.description + '</p>' +
      '  <div class="panel">' +
      '    <div class="agent-mini">' +
      '      <img src="images/' + a.photo + '.webp" alt="Portrait of ' + a.name + '">' +
      '      <div class="who"><strong>' + a.name + '</strong><span>' + a.title + ' &middot; ' + a.phone + '</span></div>' +
      '    </div>' +
      (l.status === 'Sold'
        ? '    <p style="margin-bottom:0;color:var(--muted)">This residence has sold. ' + a.name.split(' ')[0] + ' would be delighted to show you something comparable.</p>'
        : '    <h3 style="margin-top:20px">Schedule a Dawn Showing</h3>' +
          '    <form class="inquiry" id="showing-form">' +
          '      <div><label for="sf-name">Your name</label><input id="sf-name" type="text" required></div>' +
          '      <div><label for="sf-species">Species of your bird</label><input id="sf-species" type="text" placeholder="e.g. Eastern Bluebird" required></div>' +
          '      <div><label for="sf-offer">Opening offer in seed (optional)</label><input id="sf-offer" type="text" inputmode="numeric"></div>' +
          '      <div><label for="sf-notes">Notes for the showing</label><textarea id="sf-notes" placeholder="Flock size, molt schedule, feelings about cats"></textarea></div>' +
          '      <button class="btn solid" type="submit">Request the Showing</button>' +
          '    </form>') +
      '  </div>' +
      '</div>';

    var main = document.getElementById('main-photo');
    var thumbWrap = document.getElementById('thumbs');
    if (thumbWrap) {
      thumbWrap.addEventListener('click', function (e) {
        var t = e.target.closest('img[data-photo]');
        if (!t) return;
        main.src = 'images/' + t.getAttribute('data-photo') + '.webp';
        thumbWrap.querySelectorAll('img').forEach(function (im) { im.classList.toggle('on', im === t); });
      });
    }
  }

  // Fake-submit forms: replace with a confirmation.
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form.inquiry');
    if (!form) return;
    e.preventDefault();
    var msg = form.getAttribute('data-confirm') ||
      '<strong>Your showing is requested.</strong> An associate will confirm by tomorrow’s dawn chorus. ' +
      'Please arrive on time; the light does not wait, and neither do the birds.';
    var confirm = document.createElement('div');
    confirm.className = 'form-confirm';
    confirm.setAttribute('role', 'status');
    confirm.innerHTML = msg;
    form.replaceWith(confirm);
    confirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Image modal: any image marked data-modal opens enlarged.
  var modal = document.createElement('div');
  modal.className = 'img-modal';
  modal.innerHTML = '<button class="close" aria-label="Close">&times;</button><img alt="">';
  document.body.appendChild(modal);
  var modalImg = modal.querySelector('img');

  document.addEventListener('click', function (e) {
    var img = e.target.closest('img[data-modal]');
    if (img) {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.add('open');
      return;
    }
    if (e.target === modal || e.target.closest('.img-modal .close')) {
      modal.classList.remove('open');
      modalImg.src = '';
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') modal.classList.remove('open');
  });
})();
