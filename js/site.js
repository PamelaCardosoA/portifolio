(() => {
  const qs = (selector, element = document) => element.querySelector(selector);
  const qsa = (selector, element = document) => [...element.querySelectorAll(selector)];

  const menuBtn = qs("[data-menu-btn]");
  const mobile = qs("[data-mobile]");
  const mobileLinks = qsa("[data-mobile-link]");
  const navLinks = qsa(".nav__link");

  function setYear() {
    const yearElement = qs("[data-year]");

    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  function normalizeLinkTarget(href) {
    if (!href) return "";

    const [path = "", hash = ""] = href.split("#");
    const normalizedPath = path.replace(/^\.?\//, "");

    return hash ? `${normalizedPath}#${hash}` : normalizedPath;
  }

  function setActiveNav(target) {
    if (!navLinks.length) return;

    const normalizedTarget = normalizeLinkTarget(target);

    navLinks.forEach((link) => {
      const href = normalizeLinkTarget(link.getAttribute("href"));
      link.classList.toggle("is-active", href === normalizedTarget);
    });
  }

  function toggleMobile(forceState) {
    if (!mobile || !menuBtn) return;

    const isOpen = forceState ?? !mobile.classList.contains("is-open");

    mobile.classList.toggle("is-open", isOpen);
    mobile.style.display = isOpen ? "block" : "none";
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  }

  function setupMobileMenu() {
    if (!menuBtn || !mobile) return;

    menuBtn.addEventListener("click", () => toggleMobile());

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => toggleMobile(false));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) {
        toggleMobile(false);
      }
    });
  }

  function setupNavigation() {
    if (!navLinks.length) return;

    const activeNav = document.body.dataset.activeNav;
    const sections = (document.body.dataset.navSections || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (activeNav) {
      setActiveNav(activeNav);
      return;
    }

    if (!sections.length) return;

    const updateActiveSection = () => {
      const scrollY = window.scrollY + 120;
      let current = sections[0];

      sections.forEach((id) => {
        const element = qs(id);

        if (element && scrollY >= element.offsetTop) {
          current = id;
        }
      });

      setActiveNav(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
  }

  function setupSite() {
    setYear();
    setupNavigation();
    setupMobileMenu();
  }

  setupSite();
})();
