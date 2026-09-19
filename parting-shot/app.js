// The Parting Shot: shared behavior for all pages.

(function () {
  'use strict';

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
    });
  }

  // Image modal: any image marked data-modal opens enlarged.
  var modal = document.createElement('div');
  modal.className = 'img-modal';
  modal.innerHTML = '<button class="close" aria-label="Close">&times;</button><img alt="">';
  document.body.appendChild(modal);
  var modalImg = modal.querySelector('img');

  function closeModal() {
    modal.classList.remove('open');
    modalImg.src = '';
  }

  modal.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  document.querySelectorAll('img[data-modal]').forEach(function (img) {
    img.addEventListener('click', function () {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.add('open');
    });
  });

  // Inquiry form: front-of-house only. Shows a confirmation in place.
  var inquiry = document.getElementById('inquiry-form');
  if (inquiry) {
    inquiry.addEventListener('submit', function (e) {
      e.preventDefault();
      var confirm = document.getElementById('inquiry-confirm');
      var name = document.getElementById('inq-name');
      if (confirm) {
        var who = name && name.value ? name.value.split(' ')[0] : 'Thank you';
        confirm.textContent = who + ', your inquiry has been received. A member of the studio will respond within two business days, discreetly, from an unmarked email address.';
        confirm.classList.add('visible');
      }
      inquiry.reset();
    });
  }

  // Album title composer: generates a commemorative album title to copy or download.
  var composer = document.getElementById('composer');
  if (composer) {
    var first = [
      'The Uncoupling of', 'The Amicable Departure of', 'The Final Season of',
      'A Farewell to', 'The Last Portrait of', 'The Quiet Conclusion of',
      'The Independent Futures of', 'The Closing Chapter of'
    ];
    var last = [
      'A Study in Golden Hour', 'An Evening Elegy', 'A Courthouse Suite',
      'Photographs at the End', 'A Portrait in Two Volumes', 'The Long Exposure',
      'A Signing in Natural Light', 'Twelve Years, One Afternoon'
    ];
    var out = document.getElementById('composer-out');
    var btn = document.getElementById('composer-go');
    var dl = document.getElementById('composer-download');
    var nameA = document.getElementById('composer-a');
    var nameB = document.getElementById('composer-b');

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function compose() {
      var a = (nameA.value || 'Jordan').trim();
      var b = (nameB.value || 'Alex').trim();
      var title = pick(first) + ' ' + a + ' & ' + b + ': ' + pick(last);
      out.textContent = title;
      if (dl) {
        dl.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(title + '\n\nA commemorative album title composed by The Parting Shot.\nSuitable for foil stamping.');
        dl.setAttribute('download', 'album-title.txt');
        dl.style.visibility = 'visible';
      }
    }

    if (btn) btn.addEventListener('click', compose);
  }
})();
