/* Lint for Nests - site scripts (vanilla JS) */
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

  /* Impact thermometer */
  var fill = document.getElementById('thermo-fill');
  if (fill) {
    var target = parseFloat(fill.getAttribute('data-percent') || '0');
    var fired = false;
    var arm = function () {
      if (fired) return;
      var rect = fill.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40) {
        fired = true;
        requestAnimationFrame(function () {
          fill.style.width = target + '%';
        });
      }
    };
    window.addEventListener('scroll', arm, { passive: true });
    arm();
  }

  /* Lint Yield Estimator */
  var estForm = document.getElementById('estimator');
  if (estForm) {
    var days = document.getElementById('est-days');
    var daysOut = document.getElementById('est-days-val');
    var depth = document.getElementById('est-depth');
    var fabric = document.getElementById('est-fabric');
    var grams = document.getElementById('est-grams');
    var birds = document.getElementById('est-birds');
    var verdict = document.getElementById('est-verdict');

    var depthFactor = { shallow: 0.5, average: 1, deep: 1.7, cavernous: 2.6 };
    var fabricFactor = { cotton: 1, wool: 1.8, fleece: 2.3, linen: 0.6 };

    var update = function () {
      var d = parseInt(days.value, 10);
      daysOut.textContent = d + (d === 1 ? ' day' : ' days') + ' a week';
      var g = d * 52 * 0.011 * depthFactor[depth.value] * fabricFactor[fabric.value];
      var rounded = Math.round(g * 10) / 10;
      var b = Math.max(1, Math.round(g / 0.4));
      grams.textContent = rounded + ' g';
      birds.textContent = b + (b === 1 ? ' warbler' : ' warblers');
      if (g >= 3) {
        verdict.textContent = 'Golden Navel material. Our sorters will speak of you.';
      } else if (g >= 1.5) {
        verdict.textContent = 'A strong, dependable navel. The Midwest thanks you.';
      } else {
        verdict.textContent = 'Every tuft counts. Consider switching to fleece.';
      }
    };

    [days, depth, fabric].forEach(function (el) {
      el.addEventListener('input', update);
    });
    update();
  }

  /* Donation amount picker */
  document.querySelectorAll('.amount-row').forEach(function (row) {
    row.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        row.querySelectorAll('button').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        var custom = document.getElementById('donate-custom');
        if (custom) custom.value = '';
      });
    });
  });

  /* Donation form */
  var donateForm = document.getElementById('donate-form');
  if (donateForm) {
    donateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var selected = donateForm.querySelector('.amount-row button.selected');
      var custom = document.getElementById('donate-custom');
      var amount = custom && custom.value ? '$' + custom.value : (selected ? selected.textContent : '$15');
      var freq = document.getElementById('donate-freq').value;
      var msg = document.getElementById('donate-success');
      msg.innerHTML = '<strong>Thank you.</strong> Your ' + freq.toLowerCase() + ' gift of ' + amount +
        ' has been recorded in the Ledger of Warmth. A confirmation, a window decal, and eventually a warbler will be issued in that order. No actual money has moved; this is a demonstration site.';
      msg.style.display = 'block';
      msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* Golden Navel Circle inquiry form */
  var circleForm = document.getElementById('circle-form');
  if (circleForm) {
    circleForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('circle-success');
      msg.innerHTML = '<strong>Received.</strong> A senior gift officer will contact you discreetly within two business days. Please have your navel history ready.';
      msg.style.display = 'block';
      msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* Lint pledge form on drives page */
  var pledgeForm = document.getElementById('pledge-form');
  if (pledgeForm) {
    pledgeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('pledge-success');
      msg.innerHTML = '<strong>Pledge recorded.</strong> Bring your jar to any drive below. Volunteers cannot make change, and would not want to.';
      msg.style.display = 'block';
      msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
})();
