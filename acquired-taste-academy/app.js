// Acquired Taste Academy: shared behavior for all pages.

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

  // Image modal for any image marked data-modal.
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

  // Placement examination widget
  var exam = document.getElementById('exam');
  if (exam) {
    var milk = document.getElementById('q-milk');
    var licorice = document.getElementById('q-licorice');
    var texture = document.getElementById('q-texture');
    var placement = document.getElementById('placement');
    var placementText = document.getElementById('placement-text');

    function grade() {
      var score = parseInt(milk.value, 10) + parseInt(licorice.value, 10) + parseInt(texture.value, 10);
      var code, text;
      if (score <= 2) {
        code = 'TAST 090 (non-credit)';
        text = 'The committee recommends the remedial seminar, Toast, Lightly Buttered. There is no shame in TAST 090. There is very little of anything in TAST 090; that is the pedagogy.';
      } else if (score <= 5) {
        code = 'TAST 101';
        text = 'Standard placement. You will begin with warm milk, as generations of scholars have before you. By week four, you will no longer flinch.';
      } else if (score <= 8) {
        code = 'TAST 210, advanced standing';
        text = 'The committee grants advanced standing. You may proceed directly to the fermentation sequence. Please disclose this placement to your household before the first practicum.';
      } else {
        code = 'Faculty interview';
        text = 'Your responses fall outside the instrument’s calibrated range. The Academy would like to speak with you about a teaching position, or at minimum understand what happened.';
      }
      placement.textContent = 'Placement: ' + code;
      placementText.textContent = text;
    }

    milk.addEventListener('change', grade);
    licorice.addEventListener('change', grade);
    texture.addEventListener('change', grade);
    grade();
  }

  // Enrollment form: prefill from ?program= and confirm on submit.
  var enroll = document.getElementById('enroll-form');
  if (enroll) {
    var params = new URLSearchParams(window.location.search);
    var program = params.get('program');
    var programField = document.getElementById('program');
    if (program && programField) {
      programField.value = program;
    }

    enroll.addEventListener('submit', function (e) {
      e.preventDefault();
      var confirm = document.createElement('div');
      confirm.className = 'form-confirm';
      confirm.setAttribute('role', 'status');
      confirm.innerHTML =
        '<strong>Application received.</strong> The admissions committee will review your file ' +
        'and reply within three business days. Registration is not complete until your deposit ' +
        'clears and you have read the syllabus warning label in full.';
      enroll.replaceWith(confirm);
      confirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
})();
