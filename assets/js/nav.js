document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');

  if (!toggle || !menu) {
    return;
  }

  function toggleMenu() {
    var open = toggle.classList.toggle('is-active');
    menu.classList.toggle('is-active');
    toggle.setAttribute('aria-expanded', open);
  }

  toggle.addEventListener('click', toggleMenu);

  toggle.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    }
  });
});
