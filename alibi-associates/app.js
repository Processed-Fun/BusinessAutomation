// Alibi & Associates: shared behavior for all pages.

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

  // Preliminary Feasibility Assessment widget
  var assessor = document.getElementById('assessor');
  if (assessor) {
    var obligation = document.getElementById('obligation');
    var notice = document.getElementById('notice');
    var proximity = document.getElementById('proximity');
    var readout = document.getElementById('notice-readout');
    var scoreEl = document.getElementById('verdict-score');
    var textEl = document.getElementById('verdict-text');
    var recEl = document.getElementById('verdict-rec');

    var noticeLabels = [
      'Under two hours',
      'This evening',
      'Tomorrow',
      'This week',
      'This month',
      'Next quarter',
      'More than a year away'
    ];

    var obligationData = {
      wedding: { weight: 34, practice: 'Weddings & Destination Events' },
      shower: { weight: 55, practice: 'Weddings & Destination Events' },
      retreat: { weight: 48, practice: 'Workplace & Corporate' },
      call: { weight: 78, practice: 'Workplace & Corporate' },
      standing: { weight: 42, practice: 'Recurring Obligations' },
      reunion: { weight: 38, practice: 'Recurring Obligations' }
    };

    var proximityPenalty = {
      acquaintance: 22,
      colleague: 12,
      friend: 0,
      family: -14,
      inlaws: -22
    };

    function assess() {
      var idx = parseInt(notice.value, 10);
      readout.textContent = noticeLabels[idx];

      var base = obligationData[obligation.value].weight;
      var score = base + idx * 6 + proximityPenalty[proximity.value];
      if (score > 97) score = 97;
      if (score < 9) score = 9;

      var text;
      if (idx === 0) {
        text = 'This is an extraction, not an excuse. The hotline exists for exactly this.';
      } else if (score >= 75) {
        text = 'Highly feasible. A junior associate could draft this before lunch.';
      } else if (score >= 55) {
        text = 'Feasible. Standard engagement, standard discretion.';
      } else if (score >= 35) {
        text = 'Delicate. A partner should review the corroboration plan personally.';
      } else {
        text = 'Difficult. Not impossible. Nothing is impossible. Margaret will want to see this one.';
      }

      var practice = idx === 0 ? 'Last-Minute Extractions' : obligationData[obligation.value].practice;

      scoreEl.textContent = score + '%';
      textEl.textContent = text;
      recEl.textContent = 'Recommended practice: ' + practice + '.';
    }

    obligation.addEventListener('change', assess);
    notice.addEventListener('input', assess);
    proximity.addEventListener('change', assess);
    assess();
  }

  // Intake form: prefill from tier links (?engagement=...) and confirm on submit.
  var intake = document.getElementById('intake-form');
  if (intake) {
    var params = new URLSearchParams(window.location.search);
    var engagement = params.get('engagement');
    var engagementField = document.getElementById('engagement-type');
    if (engagement && engagementField) {
      engagementField.value = engagement;
    }

    intake.addEventListener('submit', function (e) {
      e.preventDefault();
      var confirm = document.createElement('div');
      confirm.className = 'form-confirm';
      confirm.setAttribute('role', 'status');
      confirm.innerHTML =
        '<strong>Your inquiry has been received.</strong> A partner will contact you ' +
        'through an unremarkable channel within one business day. This form has already ' +
        'forgotten what you wrote in it.';
      intake.replaceWith(confirm);
      confirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
})();
