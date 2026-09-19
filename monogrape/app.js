/* Monogrape shared scripts */
(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  /* ---------- Image modal ---------- */
  var imgModal = document.getElementById('imgModal');
  if (imgModal) {
    var modalImg = imgModal.querySelector('img');
    document.querySelectorAll('img[data-modal]').forEach(function (img) {
      img.addEventListener('click', function () {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        imgModal.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    });
    imgModal.addEventListener('click', function () {
      imgModal.hidden = true;
      document.body.style.overflow = '';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !imgModal.hidden) {
        imgModal.hidden = true;
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Order + enterprise modal (index page) ---------- */
  var orderModal = document.getElementById('orderModal');
  if (orderModal) {
    var orderForm = document.getElementById('orderForm');
    var orderDone = document.getElementById('orderDone');
    var entForm = document.getElementById('enterpriseForm');
    var entDone = document.getElementById('enterpriseDone');
    var orderPlan = document.getElementById('orderPlan');

    function openModal(section) {
      [orderForm, orderDone, entForm, entDone].forEach(function (el) { el.hidden = true; });
      section.hidden = false;
      orderModal.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      orderModal.hidden = true;
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-order]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        orderPlan.textContent = btn.getAttribute('data-order');
        openModal(orderForm);
      });
    });

    document.querySelectorAll('[data-enterprise]').forEach(function (btn) {
      btn.addEventListener('click', function () { openModal(entForm); });
    });

    orderModal.addEventListener('click', function (e) {
      if (e.target === orderModal || e.target.hasAttribute('data-close')) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !orderModal.hidden) closeModal();
    });

    var placeBtn = document.getElementById('placeOrder');
    if (placeBtn) {
      placeBtn.addEventListener('click', function () {
        var code = 'MG-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('orderCode').textContent = code;
        document.getElementById('trackLink').href = 'tracker.html?code=' + code;
        orderForm.hidden = true;
        orderDone.hidden = false;
      });
    }

    var entBtn = document.getElementById('sendEnterprise');
    if (entBtn) {
      entBtn.addEventListener('click', function () {
        entForm.hidden = true;
        entDone.hidden = false;
      });
    }
  }

  /* ---------- Tracker page ---------- */
  var trackBtn = document.getElementById('trackBtn');
  if (trackBtn) {
    var demoBtn = document.getElementById('demoBtn');
    var codeInput = document.getElementById('trackCode');
    var result = document.getElementById('trackResult');
    var steps = Array.prototype.slice.call(document.querySelectorAll('[data-step]'));
    var dot = document.getElementById('tDot');
    var certRow = document.getElementById('certRow');
    var etaEl = document.getElementById('tEta');
    var codeEl = document.getElementById('tCode');
    var courierEl = document.getElementById('tCourier');
    var couriers = ['Danielle', 'Marcus', 'Yuki', 'Priyanka', 'Old Gil'];
    var positions = [
      { top: 150, left: 16 }, { top: 120, left: 70 }, { top: 60, left: 130 },
      { top: 90, left: 210 }, { top: 40, left: 290 }, { top: 70, left: 360 },
      { top: 74, left: 999 }
    ];
    var timer = null;
    var activeCode = '';

    function setStep(i) {
      steps.forEach(function (li, j) {
        li.classList.toggle('done', j < i);
        li.classList.toggle('now', j === i);
        li.querySelector('.tick').innerHTML = j < i ? '&#10003;' : (j === i ? '&#9679;' : '&#9675;');
      });
      var mapW = dot.parentElement.clientWidth;
      var pos = positions[Math.min(i, positions.length - 1)];
      dot.style.top = Math.min(pos.top, 160) + 'px';
      dot.style.left = Math.min(pos.left, mapW - 60) + 'px';
      var eta = Math.max(0, (steps.length - 1 - i) * 2);
      etaEl.textContent = eta === 0 ? 'Arrived' : eta + ' min';
      if (i >= steps.length - 1) {
        steps[steps.length - 1].classList.add('done');
        steps[steps.length - 1].classList.remove('now');
        steps[steps.length - 1].querySelector('.tick').innerHTML = '&#10003;';
        dot.innerHTML = '&#127881;';
        certRow.hidden = false;
      }
    }

    function startTracking(code) {
      activeCode = code;
      codeEl.textContent = code;
      courierEl.textContent = couriers[Math.floor(Math.random() * couriers.length)];
      result.hidden = false;
      certRow.hidden = true;
      dot.innerHTML = '&#128690;';
      if (timer) clearInterval(timer);
      var i = 0;
      setStep(0);
      timer = setInterval(function () {
        i++;
        setStep(i);
        if (i >= steps.length - 1) clearInterval(timer);
      }, 1800);
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    trackBtn.addEventListener('click', function () {
      var code = codeInput.value.trim().toUpperCase();
      if (!/^MG-\d{6}$/.test(code)) code = 'MG-' + Math.floor(100000 + Math.random() * 900000);
      startTracking(code);
    });

    demoBtn.addEventListener('click', function () {
      startTracking('MG-' + Math.floor(100000 + Math.random() * 900000));
    });

    codeInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') trackBtn.click();
    });

    var params = new URLSearchParams(window.location.search);
    if (params.get('code')) {
      codeInput.value = params.get('code');
      startTracking(params.get('code').toUpperCase());
    }

    /* Certificate download */
    var certBtn = document.getElementById('certBtn');
    if (certBtn) {
      certBtn.addEventListener('click', function () {
        var c = document.createElement('canvas');
        c.width = 1200;
        c.height = 850;
        var x = c.getContext('2d');

        var g = x.createLinearGradient(0, 0, 1200, 850);
        g.addColorStop(0, '#6366f1');
        g.addColorStop(0.5, '#7c3aed');
        g.addColorStop(1, '#d946ef');
        x.fillStyle = g;
        x.fillRect(0, 0, 1200, 850);

        x.fillStyle = '#ffffff';
        x.fillRect(40, 40, 1120, 770);

        x.strokeStyle = '#7c3aed';
        x.lineWidth = 3;
        x.strokeRect(70, 70, 1060, 710);

        x.textAlign = 'center';
        x.fillStyle = '#7c3aed';
        x.font = '700 30px Inter, Arial, sans-serif';
        x.fillText('MONOGRAPE', 600, 150);

        x.fillStyle = '#1e1b2e';
        x.font = '800 58px Inter, Arial, sans-serif';
        x.fillText('Certificate of Delivery', 600, 240);

        x.fillStyle = '#5f5a72';
        x.font = '400 26px Inter, Arial, sans-serif';
        x.fillText('This certifies that on this day, one (1) grape', 600, 320);
        x.fillText('was picked, inspected, nestled, carried, and delivered', 600, 360);
        x.fillText('to a customer who deserved it.', 600, 400);

        /* Grape */
        x.beginPath();
        x.arc(600, 500, 52, 0, Math.PI * 2);
        var gg = x.createRadialGradient(580, 480, 8, 600, 500, 55);
        gg.addColorStop(0, '#a78bfa');
        gg.addColorStop(1, '#5b21b6');
        x.fillStyle = gg;
        x.fill();
        x.beginPath();
        x.ellipse(584, 482, 12, 7, -0.6, 0, Math.PI * 2);
        x.fillStyle = 'rgba(255,255,255,0.55)';
        x.fill();

        x.fillStyle = '#1e1b2e';
        x.font = '700 30px Inter, Arial, sans-serif';
        x.fillText('Tracking code: ' + activeCode, 600, 620);

        x.fillStyle = '#8b86a0';
        x.font = '400 20px Inter, Arial, sans-serif';
        var d = new Date();
        x.fillText('Delivered ' + d.toLocaleDateString() + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 600, 660);
        x.fillText('Firmness score: 96 / 100. Tissue layers: 4. Regrets: 0.', 600, 692);

        x.fillStyle = '#b7b2c9';
        x.font = 'italic 16px Georgia, serif';
        x.fillText('One grape. Delivered.', 600, 750);

        var a = document.createElement('a');
        a.download = 'monogrape-certificate-' + activeCode + '.png';
        a.href = c.toDataURL('image/png');
        a.click();
      });
    }
  }
})();
