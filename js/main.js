/* =========================================================
   WOMB & HEART
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
  document.querySelector(".mobile-menu-button");

const mobileNav =
  document.querySelector(".mobile-nav");


function setMenuOpen(open) {

  if (!menuButton || !mobileNav) {
    return;
  }


  menuButton.classList.toggle(
    "is-open",
    open
  );


  mobileNav.classList.toggle(
    "is-open",
    open
  );


  menuButton.setAttribute(
    "aria-expanded",
    String(open)
  );


  menuButton.setAttribute(
    "aria-label",
    open
      ? "Menü schliessen"
      : "Menü öffnen"
  );

}


if (menuButton && mobileNav) {

  menuButton.addEventListener(
    "click",
    () => {

      const isOpen =
        menuButton.getAttribute(
          "aria-expanded"
        ) === "true";


      setMenuOpen(!isOpen);

    }
  );


  mobileNav
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          setMenuOpen(false);

        }
      );

    });


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        menuButton.getAttribute(
          "aria-expanded"
        ) === "true"
      ) {

        setMenuOpen(false);

        menuButton.focus();

      }

    }
  );


  const desktopQuery =
    window.matchMedia(
      "(min-width: 1401px)"
    );


  desktopQuery.addEventListener(
    "change",
    (event) => {

      if (event.matches) {
        setMenuOpen(false);
      }

    }
  );

}


/* =========================================================
   HEADER SCROLL STATE
========================================================= */

const siteHeader =
  document.querySelector(
    ".site-header"
  );


function updateHeaderState() {

  if (!siteHeader) {
    return;
  }


  siteHeader.classList.toggle(
    "is-scrolled",
    window.scrollY > 35
  );

}


window.addEventListener(
  "scroll",
  updateHeaderState,
  {
    passive: true
  }
);


updateHeaderState();


/* =========================================================
   SCHWERPUNKTE SLIDER
========================================================= */

/*
 * IMPORTANT:
 *
 * The HTML now already contains:
 *
 * - all 6 slides
 * - .focus-slider-viewport
 * - .focus-slider-track
 * - previous button
 * - next button
 *
 * JavaScript therefore only controls movement.
 */

const sliderViewport =
  document.querySelector(
    ".focus-slider-viewport"
  );

const sliderTrack =
  document.querySelector(
    ".focus-slider-track"
  );

const previousButton =
  document.querySelector(
    ".slider-arrow-prev"
  );

const nextButton =
  document.querySelector(
    ".slider-arrow-next"
  );


if (
  sliderViewport &&
  sliderTrack &&
  previousButton &&
  nextButton
) {

  /* =======================================================
     GET SLIDE WIDTH + GAP
  ======================================================= */

  function getSlideStep() {

    const firstSlide =
      sliderTrack.querySelector(
        ".feature-story"
      );


    if (!firstSlide) {
      return 0;
    }


    const trackStyles =
      window.getComputedStyle(
        sliderTrack
      );


    const gap =
      parseFloat(
        trackStyles.columnGap ||
        trackStyles.gap
      ) || 0;


    return (
      firstSlide
        .getBoundingClientRect()
        .width +
      gap
    );

  }


  /* =======================================================
     ARROW STATES
  ======================================================= */

  function updateSliderButtons() {

    const maxScroll =
      sliderViewport.scrollWidth -
      sliderViewport.clientWidth;


    const tolerance = 5;


    previousButton.disabled =
      sliderViewport.scrollLeft <=
      tolerance;


    nextButton.disabled =
      sliderViewport.scrollLeft >=
      maxScroll -
      tolerance;

  }


  /* =======================================================
     PREVIOUS
  ======================================================= */

  previousButton.addEventListener(
    "click",
    () => {

      sliderViewport.scrollBy({
        left: -getSlideStep(),
        behavior: "smooth"
      });

    }
  );


  /* =======================================================
     NEXT
  ======================================================= */

  nextButton.addEventListener(
    "click",
    () => {

      sliderViewport.scrollBy({
        left: getSlideStep(),
        behavior: "smooth"
      });

    }
  );


  /* =======================================================
     KEYBOARD SUPPORT
  ======================================================= */

  sliderViewport.setAttribute(
    "tabindex",
    "0"
  );


  sliderViewport.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "ArrowRight") {

        event.preventDefault();


        sliderViewport.scrollBy({
          left: getSlideStep(),
          behavior: "smooth"
        });

      }


      if (event.key === "ArrowLeft") {

        event.preventDefault();


        sliderViewport.scrollBy({
          left: -getSlideStep(),
          behavior: "smooth"
        });

      }

    }
  );


  /* =======================================================
     UPDATE AFTER TOUCH / MOUSE SCROLL
  ======================================================= */

  let scrollFrame;


  sliderViewport.addEventListener(
    "scroll",
    () => {

      cancelAnimationFrame(
        scrollFrame
      );


      scrollFrame =
        requestAnimationFrame(
          updateSliderButtons
        );

    },
    {
      passive: true
    }
  );


  /* =======================================================
     RESIZE
  ======================================================= */

  window.addEventListener(
    "resize",
    () => {

      updateSliderButtons();

    }
  );


  /* =======================================================
     INITIAL STATE
  ======================================================= */

  updateSliderButtons();

}


/* =========================================================
   INTERNAL ANCHOR SCROLLING
========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]:not([href="#"])'
  )
  .forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const href =
          link.getAttribute("href");


        if (!href) {
          return;
        }


        const target =
          document.querySelector(href);


        if (!target) {
          return;
        }


        event.preventDefault();


        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  });