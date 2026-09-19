// Mist O' Meat front-of-house scripts

(function () {
  'use strict';

  // ----- countdown that resets, out of generosity -----
  var COUNTDOWN_START = 10 * 60;
  var remaining = COUNTDOWN_START;
  var countdownEl = document.getElementById('countdown');
  var countdownNote = document.getElementById('countdownNote');
  var countdownBox = document.querySelector('.countdown-box');
  var bonusTimer = document.getElementById('bonusTimer');

  var extendedNotes = [
    'Offer extended. You seem nice.',
    'Offer extended due to overwhelming hesitation.',
    'Offer extended. The operators voted.',
    'Offer extended one final time, again.'
  ];
  var extensions = 0;

  function fmt(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function tick() {
    remaining -= 1;
    if (remaining <= 0) {
      remaining = COUNTDOWN_START;
      if (countdownNote) {
        countdownNote.textContent = extendedNotes[extensions % extendedNotes.length];
        extensions += 1;
      }
      if (countdownBox) {
        countdownBox.classList.remove('extended');
        void countdownBox.offsetWidth;
        countdownBox.classList.add('extended');
      }
    }
    if (countdownEl) countdownEl.textContent = fmt(remaining);
    if (bonusTimer) bonusTimer.textContent = fmt(remaining);
  }
  if (countdownEl) setInterval(tick, 1000);

  // ----- dwindling warehouse -----
  var cansLeft = document.getElementById('cansLeft');
  if (cansLeft) {
    var stock = 417;
    setInterval(function () {
      stock -= Math.floor(Math.random() * 3);
      if (stock < 38) stock = 402; // a truck arrived
      cansLeft.textContent = stock;
    }, 4000);
  }

  // ----- before / after slider -----
  var slider = document.getElementById('baSlider');
  var afterWrap = document.getElementById('baAfterWrap');
  var handle = document.getElementById('baHandle');

  function setSplit(pct) {
    pct = Math.max(2, Math.min(98, pct));
    afterWrap.style.width = pct + '%';
    handle.style.left = pct + '%';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  function syncAfterImgWidth() {
    var img = afterWrap.querySelector('img');
    img.style.width = slider.clientWidth + 'px';
  }

  if (slider && afterWrap && handle) {
    syncAfterImgWidth();
    window.addEventListener('resize', syncAfterImgWidth);

    var dragging = false;

    function moveTo(clientX) {
      var rect = slider.getBoundingClientRect();
      setSplit(((clientX - rect.left) / rect.width) * 100);
    }

    slider.addEventListener('pointerdown', function (e) {
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      moveTo(e.clientX);
    });
    slider.addEventListener('pointermove', function (e) {
      if (dragging) moveTo(e.clientX);
    });
    slider.addEventListener('pointerup', function () { dragging = false; });
    slider.addEventListener('pointercancel', function () { dragging = false; });

    handle.addEventListener('keydown', function (e) {
      var now = parseFloat(handle.style.left) || 50;
      if (e.key === 'ArrowLeft') { setSplit(now - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setSplit(now + 5); e.preventDefault(); }
    });
  }

  // ----- order flow -----
  var offerButtons = document.querySelectorAll('.btn-offer[data-offer]');
  var orderForm = document.getElementById('orderForm');
  var orderSummary = document.getElementById('orderSummary');
  var orderTotal = document.getElementById('orderTotal');
  var orderConfirm = document.getElementById('orderConfirm');
  var confirmMsg = document.getElementById('confirmMsg');
  var rushShip = document.getElementById('rushShip');
  var orderAgain = document.getElementById('orderAgain');

  var SH = 7.95;
  var RUSH = 9.95;
  var current = null;

  function money(n) { return '$' + n.toFixed(2); }

  function updateTotal() {
    if (!current) return;
    var total = current.price + current.cans * SH + (rushShip.checked ? RUSH : 0);
    orderTotal.textContent = money(total);
  }

  offerButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      current = {
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        cans: parseInt(btn.dataset.cans, 10)
      };
      orderSummary.textContent = current.name + ': ' + money(current.price) +
        ' plus ' + money(SH) + ' shipping & handling ' +
        (current.cans > 1 ? 'on each of ' + current.cans + ' cans, as discussed.' : 'on 1 can.');
      updateTotal();
      orderConfirm.hidden = true;
      orderForm.hidden = false;
      orderForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  if (rushShip) rushShip.addEventListener('change', updateTotal);

  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = orderForm.elements.name.value.trim() || 'valued customer';
      confirmMsg.textContent = 'Thank you, ' + name +
        '. An operator has stopped standing by and is now sitting down to process your ' +
        current.name.toLowerCase() + '.';
      orderForm.hidden = true;
      orderConfirm.hidden = false;
      orderConfirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (orderAgain) {
    orderAgain.addEventListener('click', function () {
      orderConfirm.hidden = true;
      document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ----- image modal -----
  var modal = document.getElementById('imgModal');
  var modalImg = document.getElementById('imgModalImg');
  var modalClose = document.getElementById('imgModalClose');

  if (modal && modalImg) {
    document.querySelectorAll('img.zoomable').forEach(function (img) {
      img.addEventListener('click', function () {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.hidden = true;
      modalImg.src = '';
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }
})();
