/* The Cul-de-Sac Courant - site scripts (vanilla JS) */
(function () {
  'use strict';

  /* Storage helpers: localStorage can be unavailable; the paper goes out anyway. */
  function lsGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, val) {
    try { window.localStorage.setItem(key, val); } catch (e) { /* honor system */ }
  }

  var FREE_LIMIT = 3;

  function readSlugs() {
    var raw = lsGet('courant-read') || '';
    return raw ? raw.split(',').filter(Boolean) : [];
  }

  function isSubscriber() {
    return lsGet('courant-subscriber') === 'yes';
  }

  /* Meter in the top bar */
  function renderMeter() {
    var meter = document.getElementById('meter');
    if (!meter) return;
    if (isSubscriber()) {
      meter.textContent = 'Subscriber in good standing (' + (lsGet('courant-tier') || 'Digital') + ')';
      return;
    }
    var used = Math.min(readSlugs().length, FREE_LIMIT);
    meter.textContent = 'Free articles this month: ' + (FREE_LIMIT - used) + ' of ' + FREE_LIMIT;
  }

  /* Metered paywall on article pages */
  var slug = document.body.getAttribute('data-slug');
  if (slug && !isSubscriber()) {
    var slugs = readSlugs();
    if (slugs.indexOf(slug) === -1) {
      if (slugs.length >= FREE_LIMIT) {
        var paywall = document.getElementById('paywall');
        if (paywall) {
          paywall.classList.add('open');
          var dismiss = document.getElementById('paywall-dismiss');
          if (dismiss) {
            dismiss.addEventListener('click', function () {
              paywall.classList.remove('open');
            });
          }
        }
      } else {
        slugs.push(slug);
        lsSet('courant-read', slugs.join(','));
      }
    }
  }
  renderMeter();

  /* Image modal */
  var modal = document.getElementById('img-modal');
  if (modal) {
    var modalImg = modal.querySelector('img');
    var modalCaption = modal.querySelector('.modal-caption');
    var closeBtn = modal.querySelector('.modal-close');

    function closeModal() {
      modal.classList.remove('open');
      modalImg.src = '';
      document.body.style.overflow = '';
    }

    document.querySelectorAll('img.zoomable').forEach(function (img) {
      img.addEventListener('click', function () {
        modalImg.src = img.src;
        modalImg.alt = img.alt || '';
        modalCaption.textContent = img.getAttribute('data-caption') || img.alt || '';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
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

  /* Tier selection buttons scroll to the order form and preselect */
  document.querySelectorAll('.sub-select').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tierSelect = document.getElementById('sub-tier');
      if (tierSelect) tierSelect.value = btn.getAttribute('data-tier');
      var form = document.getElementById('subscribe-form');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Subscription order form */
  var subForm = document.getElementById('subscribe-form');
  if (subForm) {
    subForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var result = document.getElementById('sub-result');
      var name = document.getElementById('sub-name').value.trim();
      var addr = document.getElementById('sub-addr').value.trim();
      var tier = document.getElementById('sub-tier').value;
      if (!name || !addr) {
        result.className = 'form-result error';
        result.textContent = 'The Courant needs a name and an address. It very likely knows both already, but there are standards.';
        result.style.display = 'block';
        return;
      }
      lsSet('courant-subscriber', 'yes');
      lsSet('courant-tier', tier);
      renderMeter();
      result.className = 'form-result';
      if (tier === 'Founding Reader') {
        result.textContent = 'Order received. Welcome, Founding Reader. Your name enters the box in the next edition, and your house will be photographed at its best angle, which the Courant has already scouted. An invoice follows by hand.';
      } else if (tier === 'Print + Digital') {
        result.textContent = 'Order received. Print delivery begins Tuesday, weather and Kyle permitting. Your paywall has been lifted, and the meter above now says so. An invoice follows by hand.';
      } else {
        result.textContent = 'Order received. Your paywall has been lifted, and the meter above now says so. Digital subscribers are reminded that the website is updated on Tuesdays, when the paper is, because the paper is the website printed out.';
      }
      result.style.display = 'block';
      subForm.reset();
    });
  }
})();
