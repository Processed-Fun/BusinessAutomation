/* Gravy District No. 3 - site scripts (vanilla JS) */
(function () {
  'use strict';

  /* Mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var navList = document.getElementById('nav-list');
  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var open = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Image modal */
  var modal = document.getElementById('img-modal');
  if (modal) {
    var modalImg = modal.querySelector('img');
    var modalCaption = modal.querySelector('.modal-caption');
    var closeBtn = modal.querySelector('.modal-close');

    function openModal(src, alt, caption) {
      modalImg.src = src;
      modalImg.alt = alt || '';
      modalCaption.textContent = caption || alt || '';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.classList.remove('open');
      modalImg.src = '';
      document.body.style.overflow = '';
    }

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

  /* Fake document portal */
  var docResult = document.getElementById('doc-result');
  if (docResult) {
    document.querySelectorAll('a.doc-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        docResult.style.display = 'block';
        docResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  /* Pay online button */
  var payBtn = document.getElementById('pay-online-btn');
  var payResult = document.getElementById('pay-result');
  if (payBtn && payResult) {
    payBtn.addEventListener('click', function () {
      payResult.style.display = 'block';
    });
  }

  /* Start service form (GD-14) */
  var serviceForm = document.getElementById('service-form');
  if (serviceForm) {
    serviceForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var result = document.getElementById('service-result');
      var name = document.getElementById('sf-name').value.trim();
      var addr = document.getElementById('sf-addr').value.trim();
      var town = document.getElementById('sf-town').value;
      var cert = document.getElementById('sf-cert').checked;
      if (!name || !addr || !town) {
        result.className = 'form-result error';
        result.textContent = 'Application incomplete. Required fields are marked with an asterisk, as is District custom.';
        result.style.display = 'block';
        return;
      }
      if (town.indexOf('Other') === 0) {
        result.className = 'form-result error';
        result.textContent = 'Service is limited to the three townships. Your application has been filed under "correspondence" and will be enjoyed.';
        result.style.display = 'block';
        return;
      }
      if (!cert) {
        result.className = 'form-result error';
        result.textContent = 'The cross-connection certification is required. It is the whole reason the form exists.';
        result.style.display = 'block';
        return;
      }
      var ref = 'GD14-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
      result.className = 'form-result';
      result.textContent = 'Application received. Reference number ' + ref + '. Allow five business days. A technician will call before visiting, and then visit on a different day.';
      result.style.display = 'block';
      serviceForm.reset();
    });
  }

  /* Outage report form (GD-40) */
  var outageForm = document.getElementById('outage-form');
  if (outageForm) {
    outageForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var result = document.getElementById('outage-result');
      var addr = document.getElementById('of-addr').value.trim();
      var system = document.getElementById('of-system').value;
      var cond = document.getElementById('of-cond').value;
      if (!addr || !system || !cond) {
        result.className = 'form-result error';
        result.textContent = 'Please complete the required fields. The crews can find your house, but not from a blank form.';
        result.style.display = 'block';
        return;
      }
      var ref = 'GD40-' + String(Math.floor(10000 + Math.random() * 90000));
      result.className = 'form-result';
      result.textContent = 'Report filed. Ticket ' + ref + '. Crews respond to full interruptions first, then lumps by class, then whistling meters, then everything else in the order Doris deems just.';
      result.style.display = 'block';
      outageForm.reset();
    });
  }

  /* Outage map */
  var map = document.getElementById('outage-map');
  if (map) {
    var INCIDENTS = [
      {
        id: 'INC-2609',
        x: 470, y: 165,
        color: '#f2b705',
        title: 'Lump event, County Road H',
        township: 'Roux Prairie',
        system: 'Turkey',
        condition: 'Reduced viscosity',
        customers: '340',
        cause: 'Class 2 lump at a pipe joint east of Vole Road. Crew on site with the auger.',
        eta: 'Today, 6:00 PM'
      },
      {
        id: 'INC-2607',
        x: 620, y: 420,
        color: '#c62828',
        title: 'Full interruption, Sump Lane',
        township: 'Lower Giblet',
        system: 'Beef',
        condition: 'Full interruption',
        customers: '12',
        cause: 'A contractor installing a mailbox post struck the beef lateral. The contractor is fine. The mailbox is fine. The lateral is not.',
        eta: 'Tomorrow, noon'
      },
      {
        id: 'INC-2604',
        x: 150, y: 200,
        color: '#7b5cb8',
        title: 'Planned flush, Booster Station 1',
        township: 'Butternut Falls',
        system: 'Turkey',
        condition: 'Planned maintenance',
        customers: '85 (brief)',
        cause: 'Pre-season flush ahead of the November surge window.',
        eta: 'Thursday, by 3:00 PM'
      },
      {
        id: 'INC-2601',
        x: 300, y: 340,
        color: '#2e7d32',
        title: 'Resolved: whistling meters, Township Line Road',
        township: 'Lower Giblet',
        system: 'Both',
        condition: 'Resolved, monitoring',
        customers: '0',
        cause: 'Seasonal whistling attributed to temperature differential. Meters retuned. The chord was reportedly D minor.',
        eta: 'Complete'
      }
    ];

    var detail = document.getElementById('incident-detail');
    var svgns = 'http://www.w3.org/2000/svg';

    function showIncident(inc, marker) {
      map.querySelectorAll('.marker').forEach(function (m) { m.classList.remove('selected'); });
      if (marker) marker.classList.add('selected');
      detail.hidden = false;
      detail.innerHTML =
        '<h3>' + inc.title + ' (' + inc.id + ')</h3><dl>' +
        '<dt>Township</dt><dd>' + inc.township + '</dd>' +
        '<dt>System</dt><dd>' + inc.system + '</dd>' +
        '<dt>Condition</dt><dd>' + inc.condition + '</dd>' +
        '<dt>Customers affected</dt><dd>' + inc.customers + '</dd>' +
        '<dt>Details</dt><dd>' + inc.cause + '</dd>' +
        '<dt>Estimated restoration</dt><dd>' + inc.eta + '</dd>' +
        '</dl>';
    }

    INCIDENTS.forEach(function (inc) {
      var g = document.createElementNS(svgns, 'g');
      g.setAttribute('class', 'marker');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', inc.title);
      var halo = document.createElementNS(svgns, 'circle');
      halo.setAttribute('cx', inc.x); halo.setAttribute('cy', inc.y);
      halo.setAttribute('r', 16); halo.setAttribute('fill', inc.color);
      halo.setAttribute('opacity', '0.25'); halo.setAttribute('stroke', 'none');
      var dot = document.createElementNS(svgns, 'circle');
      dot.setAttribute('cx', inc.x); dot.setAttribute('cy', inc.y);
      dot.setAttribute('r', 8); dot.setAttribute('fill', inc.color);
      g.appendChild(halo); g.appendChild(dot);
      g.addEventListener('click', function () { showIncident(inc, g); });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showIncident(inc, g); }
      });
      map.appendChild(g);
    });

    var tbody = document.querySelector('#incident-table tbody');
    if (tbody) {
      INCIDENTS.forEach(function (inc) {
        var tr = document.createElement('tr');
        [inc.id, inc.title.replace(/^Resolved: /, '') + ', ' + inc.township, inc.system, inc.condition, inc.customers, inc.eta]
          .forEach(function (val) {
            var td = document.createElement('td');
            td.textContent = val;
            tr.appendChild(td);
          });
        tbody.appendChild(tr);
      });
    }
  }
})();
