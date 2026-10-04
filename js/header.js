/* =========================================================
   HEADER
========================================================= */

export function initHeader() {

  const header =
    document.querySelector(
      "[data-header]"
    );


  const toggle =
    document.querySelector(
      "[data-menu-toggle]"
    );


  const nav =
    document.querySelector(
      "[data-mobile-nav]"
    );


  if (
    !header ||
    !toggle ||
    !nav
  ) {
    return;
  }


  /* =====================================================
     MENU
  ====================================================== */

  function setMenu(open) {

    toggle.classList.toggle(
      "is-open",
      open
    );


    nav.classList.toggle(
      "is-open",
      open
    );


    toggle.setAttribute(
      "aria-expanded",
      String(open)
    );


    toggle.setAttribute(
      "aria-label",
      open
        ? "Menü schliessen"
        : "Menü öffnen"
    );


    nav.setAttribute(
      "aria-hidden",
      String(!open)
    );


    document.body.classList.toggle(
      "menu-open",
      open
    );

  }


  toggle.addEventListener(
    "click",
    () => {

      const open =
        toggle.getAttribute(
          "aria-expanded"
        ) ===
        "true";


      setMenu(!open);

    }
  );


  nav
    .querySelectorAll("a")
    .forEach(
      link => {

        link.addEventListener(
          "click",
          () => {

            setMenu(false);

          }
        );

      }
    );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {

        setMenu(false);

      }

    }
  );


  const desktop =
    window.matchMedia(
      "(min-width: 1001px)"
    );


  desktop.addEventListener(
    "change",
    event => {

      if (
        event.matches
      ) {

        setMenu(false);

      }

    }
  );


  /* =====================================================
     SUBTLE LOAD
  ====================================================== */

  if (
    typeof window.gsap !==
    "undefined"
  ) {

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );


    if (
      !reducedMotion.matches
    ) {

      gsap.from(
        ".header-logo-circle",
        {
          scale: 0.94,

          autoAlpha: 0,

          duration: 0.65,

          ease: "power3.out"
        }
      );


      gsap.from(
        ".header-logo",
        {
          autoAlpha: 0,

          scale: 0.97,

          delay: 0.08,

          duration: 0.55,

          ease: "power3.out"
        }
      );


      gsap.from(
        ".header-nav > a",
        {
          y: -4,

          autoAlpha: 0,

          stagger: 0.035,

          delay: 0.12,

          duration: 0.45,

          ease: "power3.out"
        }
      );

    }

  }


  setMenu(false);

}