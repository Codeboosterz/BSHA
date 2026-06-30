(function () {
  'use strict';

  var LOCK_DURATION = 10000;
  var SELECTOR = '.quick-info-card[data-flip-letter], .offer-card[data-flip-letter], .oo-value-card[data-flip-letter]';

  function buildFlipCard(card) {
    if (!card || card.dataset.flipReady === 'true') return;

    var front = document.createElement('div');
    front.className = 'ha-flip-front';

    while (card.firstChild) {
      front.appendChild(card.firstChild);
    }

    var back = document.createElement('div');
    back.className = 'ha-flip-back';
    back.setAttribute('aria-hidden', 'true');
    back.textContent = card.dataset.flipLetter || '';

    card.appendChild(front);
    card.appendChild(back);
    card.classList.add('ha-flip-card');
    card.dataset.flipReady = 'true';
    card.setAttribute('tabindex', '0');
  }

  function flip(card) {
    if (!card || card.dataset.flipLocked === 'true') return;

    card.dataset.flipLocked = 'true';
    card.classList.add('is-flipped');

    var lockDuration = Number(card.dataset.flipLock) || LOCK_DURATION;

    window.setTimeout(function () {
      card.classList.remove('is-flipped');
      card.dataset.flipLocked = 'false';
    }, lockDuration);
  }

  function init() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
    cards.forEach(function (card) {
      buildFlipCard(card);
      card.addEventListener('pointerenter', function () { flip(card); });
      card.addEventListener('focus', function () { flip(card); });
      card.addEventListener('click', function () { flip(card); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
