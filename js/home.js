/* =========================================================
   WOMB & HEART
   HOME PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
  document.querySelector(
    ".mobile-menu-button"
  );

const mobileNav =
  document.querySelector(
    ".mobile-nav"
  );


function setMenuOpen(open) {

  if (
    !menuButton ||
    !mobileNav
  ) {
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


/* =========================================================
   MENU BUTTON
========================================================= */

menuButton?.addEventListener(
  "click",
  () => {

    const currentlyOpen =
      menuButton.getAttribute(
        "aria-expanded"
      ) === "true";


    setMenuOpen(
      !currentlyOpen
    );

  }
);


/* =========================================================
   CLOSE AFTER LINK
========================================================= */

mobileNav
  ?.querySelectorAll("a")
  .forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        setMenuOpen(false);

      }
    );

  });


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key ===
      "Escape"
    ) {

      setMenuOpen(false);

    }

  }
);


/* =========================================================
   RESET ON DESKTOP
========================================================= */

window.addEventListener(
  "resize",
  () => {

    if (
      window.innerWidth >
      1100
    ) {

      setMenuOpen(false);

    }

  }
);



/* =========================================================
   HERO SLIDER
========================================================= */

const heroSlider =
  document.querySelector(
    ".hero-slider"
  );

const heroTrack =
  document.querySelector(
    ".hero-slider-track"
  );

const heroSlides =
  Array.from(
    document.querySelectorAll(
      ".hero-slide"
    )
  );

const heroDots =
  Array.from(
    document.querySelectorAll(
      ".hero-dots span"
    )
  );

const heroPrevious =
  document.querySelector(
    ".hero-slider-prev"
  );

const heroNext =
  document.querySelector(
    ".hero-slider-next"
  );


let heroIndex =
  0;


const HERO_DELAY =
  5500;


let heroTimer =
  null;

let heroHovered =
  false;

let heroTouched =
  false;


const reducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );


/* =========================================================
   HERO RENDER
========================================================= */

function renderHero() {

  if (
    !heroTrack ||
    heroSlides.length === 0
  ) {
    return;
  }


  heroTrack.style.transform =
    `translateX(-${heroIndex * 100}%)`;


  heroSlides.forEach(
    (slide, index) => {

      const active =
        index ===
        heroIndex;


      slide.setAttribute(
        "aria-hidden",
        String(!active)
      );


      const link =
        slide.querySelector("a");


      if (link) {

        link.tabIndex =
          active
            ? 0
            : -1;

      }

    }
  );


  heroDots.forEach(
    (dot, index) => {

      dot.classList.toggle(
        "is-active",
        index === heroIndex
      );

    }
  );

}


/* =========================================================
   SET HERO SLIDE
========================================================= */

function setHeroIndex(index) {

  if (
    heroSlides.length ===
    0
  ) {
    return;
  }


  heroIndex =
    (
      index +
      heroSlides.length
    ) %
    heroSlides.length;


  renderHero();

}


/* =========================================================
   AUTOPLAY
========================================================= */

function stopHeroAutoplay() {

  if (
    heroTimer !== null
  ) {

    window.clearTimeout(
      heroTimer
    );


    heroTimer =
      null;

  }

}


function startHeroAutoplay() {

  stopHeroAutoplay();


  if (
    !heroSlider ||
    heroSlides.length < 2 ||
    heroHovered ||
    heroTouched ||
    document.hidden ||
    reducedMotion.matches ||
    heroSlider.contains(
      document.activeElement
    )
  ) {
    return;
  }


  heroTimer =
    window.setTimeout(
      () => {

        setHeroIndex(
          heroIndex + 1
        );


        startHeroAutoplay();

      },
      HERO_DELAY
    );

}


/* =========================================================
   HERO BUTTONS
========================================================= */

heroPrevious?.addEventListener(
  "click",
  () => {

    setHeroIndex(
      heroIndex - 1
    );


    startHeroAutoplay();

  }
);


heroNext?.addEventListener(
  "click",
  () => {

    setHeroIndex(
      heroIndex + 1
    );


    startHeroAutoplay();

  }
);


/* =========================================================
   HERO HOVER
========================================================= */

heroSlider?.addEventListener(
  "mouseenter",
  () => {

    heroHovered =
      true;


    stopHeroAutoplay();

  }
);


heroSlider?.addEventListener(
  "mouseleave",
  () => {

    heroHovered =
      false;


    startHeroAutoplay();

  }
);


/* =========================================================
   HERO KEYBOARD
========================================================= */

heroSlider?.setAttribute(
  "tabindex",
  "0"
);


heroSlider?.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key ===
      "ArrowLeft"
    ) {

      event.preventDefault();


      setHeroIndex(
        heroIndex - 1
      );

    }


    if (
      event.key ===
      "ArrowRight"
    ) {

      event.preventDefault();


      setHeroIndex(
        heroIndex + 1
      );

    }


    startHeroAutoplay();

  }
);


heroSlider?.addEventListener(
  "focusin",
  () => {

    stopHeroAutoplay();

  }
);


heroSlider?.addEventListener(
  "focusout",
  () => {

    window.setTimeout(
      startHeroAutoplay,
      0
    );

  }
);


/* =========================================================
   HERO SWIPE
========================================================= */

let heroTouchStartX =
  null;


heroSlider?.addEventListener(
  "touchstart",
  (event) => {

    heroTouched =
      true;


    heroTouchStartX =
      event.touches[0]
        ?.clientX ??
      null;


    stopHeroAutoplay();

  },
  {
    passive: true
  }
);


heroSlider?.addEventListener(
  "touchend",
  (event) => {

    if (
      heroTouchStartX !==
      null
    ) {

      const endX =
        event.changedTouches[0]
          ?.clientX ??
        heroTouchStartX;


      const distance =
        endX -
        heroTouchStartX;


      if (
        Math.abs(
          distance
        ) >=
        40
      ) {

        if (
          distance <
          0
        ) {

          setHeroIndex(
            heroIndex + 1
          );

        } else {

          setHeroIndex(
            heroIndex - 1
          );

        }

      }

    }


    heroTouchStartX =
      null;


    heroTouched =
      false;


    startHeroAutoplay();

  },
  {
    passive: true
  }
);


heroSlider?.addEventListener(
  "touchcancel",
  () => {

    heroTouchStartX =
      null;


    heroTouched =
      false;


    startHeroAutoplay();

  },
  {
    passive: true
  }
);



/* =========================================================
   REVIEW SLIDER
========================================================= */

const reviewSection =
  document.querySelector(
    ".reviews-section"
  );

const reviewSlides =
  Array.from(
    document.querySelectorAll(
      ".review-slide"
    )
  );

const reviewThumbnails =
  Array.from(
    document.querySelectorAll(
      ".review-thumb"
    )
  );

const reviewPrevious =
  document.querySelector(
    ".review-prev"
  );

const reviewNext =
  document.querySelector(
    ".review-next"
  );


let reviewIndex =
  0;


/* =========================================================
   REVIEW RENDER
========================================================= */

function renderReview() {

  if (
    reviewSlides.length ===
    0
  ) {
    return;
  }


  reviewSlides.forEach(
    (slide, index) => {

      const active =
        index ===
        reviewIndex;


      slide.hidden =
        !active;


      slide.classList.toggle(
        "is-active",
        active
      );

    }
  );


  reviewThumbnails.forEach(
    (thumbnail, index) => {

      const active =
        index ===
        reviewIndex;


      thumbnail.classList.toggle(
        "is-active",
        active
      );


      thumbnail.setAttribute(
        "aria-current",
        active
          ? "true"
          : "false"
      );

    }
  );

}


/* =========================================================
   REVIEW INDEX
========================================================= */

function setReviewIndex(index) {

  if (
    reviewSlides.length ===
    0
  ) {
    return;
  }


  reviewIndex =
    (
      index +
      reviewSlides.length
    ) %
    reviewSlides.length;


  renderReview();

}


/* =========================================================
   REVIEW THUMBNAILS
========================================================= */

reviewThumbnails.forEach(
  (thumbnail) => {

    thumbnail.addEventListener(
      "click",
      () => {

        const target =
          Number(
            thumbnail.dataset.review
          );


        if (
          Number.isInteger(
            target
          )
        ) {

          setReviewIndex(
            target
          );

        }

      }
    );

  }
);


/* =========================================================
   REVIEW ARROWS
========================================================= */

reviewPrevious?.addEventListener(
  "click",
  () => {

    setReviewIndex(
      reviewIndex - 1
    );

  }
);


reviewNext?.addEventListener(
  "click",
  () => {

    setReviewIndex(
      reviewIndex + 1
    );

  }
);


/* =========================================================
   REVIEW KEYBOARD
========================================================= */

reviewSection?.setAttribute(
  "tabindex",
  "0"
);


reviewSection?.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key ===
      "ArrowLeft"
    ) {

      setReviewIndex(
        reviewIndex - 1
      );

    }


    if (
      event.key ===
      "ArrowRight"
    ) {

      setReviewIndex(
        reviewIndex + 1
      );

    }

  }
);


/* =========================================================
   REVIEW TOUCH
========================================================= */

let reviewTouchStartX =
  null;


reviewSection?.addEventListener(
  "touchstart",
  (event) => {

    reviewTouchStartX =
      event.touches[0]
        ?.clientX ??
      null;

  },
  {
    passive: true
  }
);


reviewSection?.addEventListener(
  "touchend",
  (event) => {

    if (
      reviewTouchStartX ===
      null
    ) {
      return;
    }


    const endX =
      event.changedTouches[0]
        ?.clientX ??
      reviewTouchStartX;


    const distance =
      endX -
      reviewTouchStartX;


    if (
      Math.abs(
        distance
      ) >=
      45
    ) {

      if (
        distance <
        0
      ) {

        setReviewIndex(
          reviewIndex + 1
        );

      } else {

        setReviewIndex(
          reviewIndex - 1
        );

      }

    }


    reviewTouchStartX =
      null;

  },
  {
    passive: true
  }
);


/* =========================================================
   VISIBILITY
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    startHeroAutoplay();

  }
);


/* =========================================================
   REDUCED MOTION
========================================================= */

if (
  typeof reducedMotion
    .addEventListener ===
  "function"
) {

  reducedMotion.addEventListener(
    "change",
    () => {

      startHeroAutoplay();

    }
  );

}


/* =========================================================
   INITIALISE
========================================================= */

renderHero();

renderReview();

startHeroAutoplay();
/* Scroll the announcement strip away; keep the logo/menu row at the top. */
const siteHeader = document.querySelector('.site-header');
const brandStrip = document.querySelector('.brand-strip');

function updateStickyHeader() {
  if (!siteHeader || !brandStrip) return;
  const offset = Math.min(Math.max(window.scrollY, 0), brandStrip.offsetHeight);
  siteHeader.style.setProperty('--header-strip-offset', `${offset}px`);
}

window.addEventListener('scroll', updateStickyHeader, { passive: true });
window.addEventListener('resize', updateStickyHeader);
updateStickyHeader();
