/* =========================================================
   WOMB & HEART
   EDITORIAL INTERACTIONS
========================================================= */


/* =========================================================
   REDUCED MOTION
========================================================= */

const reducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );



/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle =
  document.querySelector(
    ".menu-toggle"
  );

const mobileNav =
  document.querySelector(
    ".mobile-nav"
  );


function setMenuState(open) {

  if (
    !menuToggle ||
    !mobileNav
  ) {
    return;
  }


  menuToggle.classList.toggle(
    "is-open",
    open
  );


  mobileNav.classList.toggle(
    "is-open",
    open
  );


  menuToggle.setAttribute(
    "aria-expanded",
    String(open)
  );


  menuToggle.setAttribute(
    "aria-label",
    open
      ? "Menü schliessen"
      : "Menü öffnen"
  );

}


menuToggle?.addEventListener(
  "click",
  () => {

    const open =
      menuToggle.getAttribute(
        "aria-expanded"
      ) === "true";


    setMenuState(
      !open
    );

  }
);


mobileNav
  ?.querySelectorAll("a")
  .forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        setMenuState(false);

      }
    );

  });


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key ===
      "Escape"
    ) {

      setMenuState(false);

    }

  }
);



/* =========================================================
   HEADER SCROLL STATE
========================================================= */

const siteHeader =
  document.querySelector(
    ".site-header"
  );


function updateHeader() {

  siteHeader
    ?.classList
    .toggle(
      "is-scrolled",
      window.scrollY >
      40
    );

}


window.addEventListener(
  "scroll",
  updateHeader,
  {
    passive: true
  }
);


updateHeader();



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

const heroPrev =
  document.querySelector(
    ".hero-slider-prev"
  );

const heroNext =
  document.querySelector(
    ".hero-slider-next"
  );


let heroIndex =
  0;

let heroTimer =
  null;

let heroHovered =
  false;

let heroTouchStart =
  null;


const HERO_DELAY =
  5500;


function renderHeroSlider() {

  if (
    !heroTrack ||
    heroSlides.length ===
    0
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
        index ===
        heroIndex
      );

    }
  );

}


function setHeroSlide(index) {

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


  renderHeroSlider();

}


function stopHeroAutoplay() {

  if (
    heroTimer !==
    null
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
    heroSlides.length <
    2 ||
    heroHovered ||
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

        setHeroSlide(
          heroIndex +
          1
        );


        startHeroAutoplay();

      },
      HERO_DELAY
    );

}


heroPrev?.addEventListener(
  "click",
  () => {

    setHeroSlide(
      heroIndex -
      1
    );


    startHeroAutoplay();

  }
);


heroNext?.addEventListener(
  "click",
  () => {

    setHeroSlide(
      heroIndex +
      1
    );


    startHeroAutoplay();

  }
);


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


heroSlider?.addEventListener(
  "focusin",
  stopHeroAutoplay
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


      setHeroSlide(
        heroIndex -
        1
      );


      startHeroAutoplay();

    }


    if (
      event.key ===
      "ArrowRight"
    ) {

      event.preventDefault();


      setHeroSlide(
        heroIndex +
        1
      );


      startHeroAutoplay();

    }

  }
);


heroSlider?.addEventListener(
  "touchstart",
  (event) => {

    heroTouchStart =
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
      heroTouchStart ===
      null
    ) {
      return;
    }


    const end =
      event.changedTouches[0]
        ?.clientX ??
      heroTouchStart;


    const delta =
      end -
      heroTouchStart;


    if (
      Math.abs(
        delta
      ) >
      40
    ) {

      setHeroSlide(
        delta <
        0
          ? heroIndex + 1
          : heroIndex - 1
      );

    }


    heroTouchStart =
      null;


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
    ".reviews-scene"
  );

const reviewSlides =
  Array.from(
    document.querySelectorAll(
      ".review-slide"
    )
  );

const reviewThumbs =
  Array.from(
    document.querySelectorAll(
      ".review-thumb"
    )
  );

const reviewPrev =
  document.querySelector(
    ".review-prev"
  );

const reviewNext =
  document.querySelector(
    ".review-next"
  );


let reviewIndex =
  0;

let reviewTouchStart =
  null;


function renderReviews() {

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


  reviewThumbs.forEach(
    (thumb, index) => {

      const active =
        index ===
        reviewIndex;


      thumb.classList.toggle(
        "is-active",
        active
      );


      thumb.setAttribute(
        "aria-current",
        active
          ? "true"
          : "false"
      );

    }
  );

}


function setReview(index) {

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


  renderReviews();

}


reviewThumbs.forEach(
  (thumb) => {

    thumb.addEventListener(
      "click",
      () => {

        const index =
          Number(
            thumb.dataset.review
          );


        if (
          Number.isInteger(
            index
          )
        ) {

          setReview(index);

        }

      }
    );

  }
);


reviewPrev?.addEventListener(
  "click",
  () => {

    setReview(
      reviewIndex -
      1
    );

  }
);


reviewNext?.addEventListener(
  "click",
  () => {

    setReview(
      reviewIndex +
      1
    );

  }
);


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

      event.preventDefault();


      setReview(
        reviewIndex -
        1
      );

    }


    if (
      event.key ===
      "ArrowRight"
    ) {

      event.preventDefault();


      setReview(
        reviewIndex +
        1
      );

    }

  }
);


reviewSection?.addEventListener(
  "touchstart",
  (event) => {

    reviewTouchStart =
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
      reviewTouchStart ===
      null
    ) {
      return;
    }


    const end =
      event.changedTouches[0]
        ?.clientX ??
      reviewTouchStart;


    const delta =
      end -
      reviewTouchStart;


    if (
      Math.abs(
        delta
      ) >
      45
    ) {

      setReview(
        delta <
        0
          ? reviewIndex + 1
          : reviewIndex - 1
      );

    }


    reviewTouchStart =
      null;

  },
  {
    passive: true
  }
);



/* =========================================================
   SCROLL REVEALS
========================================================= */

const revealElements =
  Array.from(
    document.querySelectorAll(
      "[data-reveal]"
    )
  );


if (
  !reducedMotion.matches &&
  "IntersectionObserver" in
  window
) {

  const revealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target
                .classList
                .add(
                  "is-visible"
                );


              revealObserver.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold:
          0.12,

        rootMargin:
          "0px 0px -8% 0px"
      }
    );


  revealElements.forEach(
    (element, index) => {

      element.style.transitionDelay =
        `${Math.min(index % 4, 3) * 55}ms`;


      revealObserver.observe(
        element
      );

    }
  );

} else {

  revealElements.forEach(
    (element) => {

      element.classList.add(
        "is-visible"
      );

    }
  );

}



/* =========================================================
   VERY SUBTLE IMAGE POINTER MOVEMENT
========================================================= */

const interactiveArtwork =
  Array.from(
    document.querySelectorAll(
      ".interactive-art"
    )
  );


if (
  !reducedMotion.matches
) {

  interactiveArtwork.forEach(
    (artwork) => {

      artwork.addEventListener(
        "pointermove",
        (event) => {

          if (
            event.pointerType ===
            "touch"
          ) {
            return;
          }


          const rect =
            artwork.getBoundingClientRect();


          const x =
            (
              event.clientX -
              rect.left
            ) /
            rect.width -
            0.5;


          const y =
            (
              event.clientY -
              rect.top
            ) /
            rect.height -
            0.5;


          artwork.style.setProperty(
            "--pointer-x",
            `${x * 8}px`
          );


          artwork.style.setProperty(
            "--pointer-y",
            `${y * 8}px`
          );

        }
      );


      artwork.addEventListener(
        "pointerleave",
        () => {

          artwork.style.setProperty(
            "--pointer-x",
            "0px"
          );


          artwork.style.setProperty(
            "--pointer-y",
            "0px"
          );

        }
      );

    }
  );

}



/* =========================================================
   VERY SUBTLE SCROLL DRIFT
========================================================= */

const driftLayers =
  Array.from(
    document.querySelectorAll(
      ".drift-layer"
    )
  );


let ticking =
  false;


function updateDrift() {

  if (
    reducedMotion.matches
  ) {

    ticking =
      false;

    return;

  }


  const viewportHeight =
    window.innerHeight;


  driftLayers.forEach(
    (layer) => {

      const rect =
        layer.getBoundingClientRect();


      const centre =
        rect.top +
        rect.height /
        2;


      const distance =
        centre -
        viewportHeight /
        2;


      const normalized =
        Math.max(
          -1,
          Math.min(
            1,
            distance /
            viewportHeight
          )
        );


      const drift =
        normalized *
        -18;


      layer.style.setProperty(
        "--drift-y",
        `${drift}px`
      );

    }
  );


  ticking =
    false;

}


function requestDriftUpdate() {

  if (
    ticking
  ) {
    return;
  }


  ticking =
    true;


  window.requestAnimationFrame(
    updateDrift
  );

}


window.addEventListener(
  "scroll",
  requestDriftUpdate,
  {
    passive: true
  }
);


window.addEventListener(
  "resize",
  requestDriftUpdate
);


requestDriftUpdate();



/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    startHeroAutoplay();

  }
);



/* =========================================================
   REDUCED MOTION CHANGE
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

      requestDriftUpdate();

    }
  );

}



/* =========================================================
   INITIALISE
========================================================= */

renderHeroSlider();

renderReviews();

startHeroAutoplay();