(function () {
  const bodyElement = document.body;
  const burgerButton = document.querySelector('.burger');
  const overlayMenu = document.getElementById('site-menu');
  const menuLinks = Array.from(document.querySelectorAll('[data-menu-link]'));

  if (!burgerButton || !overlayMenu) return;

  function setMenuOpenState(isOpen) {
    bodyElement.classList.toggle('menu-open', isOpen);
    overlayMenu.hidden = !isOpen;
    burgerButton.setAttribute('aria-expanded', String(isOpen));
  }

  function toggleMenu() {
    const willOpen = !bodyElement.classList.contains('menu-open');
    setMenuOpenState(willOpen);
  }

  function closeMenu() {
    setMenuOpenState(false);
  }

  burgerButton.addEventListener('click', toggleMenu);

  // Закрытие по клику по фону
  overlayMenu.addEventListener('click', (event) => {
    if (event.target === overlayMenu) {
      closeMenu();
    }
  });

  // Закрытие по Esc
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  // Активируем пункт меню (белый -> оранжевый) и закрываем меню
  menuLinks.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      // Подсветить активный пункт
      menuLinks.forEach((l) => l.classList.remove('active'));
      anchor.classList.add('active');

      // Если это якорная ссылка, позволяем браузеру прокрутиться после закрытия меню
      closeMenu();
    });
  });
})();