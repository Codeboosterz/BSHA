(function () {
  'use strict';

  var flow = document.querySelector('[data-vacature-flow]');
  if (!flow) return;

  var pages = Array.prototype.slice.call(flow.querySelectorAll('[data-vacature-page]'));
  var tabs = Array.prototype.slice.call(flow.querySelectorAll('[data-vacature-target]'));

  function showPage(pageName, shouldScroll) {
    pages.forEach(function (page) {
      var isActive = page.dataset.vacaturePage === pageName;
      page.classList.toggle('is-active', isActive);
      page.hidden = !isActive;
    });

    tabs.forEach(function (tab) {
      if (!tab.classList.contains('vacature-flow-tab')) return;
      var isActive = tab.dataset.vacatureTarget === pageName;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (shouldScroll) {
      flow.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  flow.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-vacature-target]');
    if (!trigger) return;

    var targetPage = trigger.dataset.vacatureTarget;
    if (!targetPage) return;

    event.preventDefault();
    showPage(targetPage, true);
  });

  document.querySelectorAll('a[href="#solliciteren"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      showPage('form', true);
    });
  });

  if (window.location.hash === '#solliciteren') {
    showPage('form', false);
  }
})();
