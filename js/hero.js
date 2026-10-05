/* =========================================================
   WOMB & HEART
   HERO SLIDER

   IMPORTANT:
   THIS FILE ONLY CONTROLS THE SMALL SLIDER.
   IT DOES NOT TOUCH THE HERO CORNER BUTTONS.
========================================================= */

export function initHero() {

  const hero =
    document.querySelector(
      "[data-hero]"
    );


  if (!hero) {
    return;
  }


  const slider =
    hero.querySelector(
      "[data-hero-slider]"
    );


  const track =
    hero.querySelector(
      "[data-hero-track]"
    );


  const slides =
    Array.from(
      hero.querySelectorAll(
        ".hero-slide"
      )
    );


  const previousButton =
    hero.querySelector(
      "[data-hero-prev]"
    );


  const nextButton =
    hero.querySelector(
      "[data-hero-next]"
    );


  const dots =
    Array.from(
      hero.querySelectorAll(
        ".hero-slider-dots span"
      )
    );


  if (
    !slider ||
    !track ||
    slides.length === 0
  ) {
    return;
  }


  let currentIndex =
    0;


  let autoplayTimer =
    null;


  let autoplayPaused =
    false;


  let touchStartX =
    null;


  const autoplayDelay =
    5500;


  /* =====================================================
     RENDER
  ====================================================== */

  function render(
    animate = true
  ) {

    currentIndex =
      (
        currentIndex +
        slides.length
      ) %
      slides.length;


    dots.forEach(
      (
        dot,
        index
      ) => {

        dot.classList.toggle(
          "is-active",
          index === currentIndex
        );

      }
    );


    slides.forEach(
      (
        slide,
        index
      ) => {

        const active =
          index === currentIndex;


        slide.setAttribute(
          "aria-hidden",
          String(!active)
        );


        const link =
          slide.querySelector(
            "a"
          );


        if (link) {

          link.tabIndex =
            active
              ? 0
              : -1;

        }

      }
    );


    const xPercent =
      -100 *
      currentIndex;


    if (
      animate &&
      typeof window.gsap !==
        "undefined"
    ) {

      window.gsap.to(
        track,
        {
          xPercent:
            xPercent,

          duration:
            0.55,

          ease:
            "power3.inOut",

          overwrite:
            true
        }
      );

    } else {

      track.style.transform =
        `translateX(${xPercent}%)`;

    }

  }


  /* =====================================================
     PREVIOUS
  ====================================================== */

  function previousSlide() {

    currentIndex -=
      1;


    render();


    restartAutoplay();

  }


  /* =====================================================
     NEXT
  ====================================================== */

  function nextSlide() {

    currentIndex +=
      1;


    render();


    restartAutoplay();

  }


  previousButton
    ?.addEventListener(
      "click",
      previousSlide
    );


  nextButton
    ?.addEventListener(
      "click",
      nextSlide
    );


  /* =====================================================
     AUTOPLAY
  ====================================================== */

  function stopAutoplay() {

    if (
      autoplayTimer
    ) {

      window.clearTimeout(
        autoplayTimer
      );


      autoplayTimer =
        null;

    }

  }


  function startAutoplay() {

    stopAutoplay();


    if (
      autoplayPaused ||
      document.hidden ||
      slides.length < 2
    ) {

      return;

    }


    autoplayTimer =
      window.setTimeout(
        () => {

          currentIndex +=
            1;


          render();


          startAutoplay();

        },
        autoplayDelay
      );

  }


  function restartAutoplay() {

    stopAutoplay();

    startAutoplay();

  }


  /* =====================================================
     HOVER
  ====================================================== */

  slider.addEventListener(
    "mouseenter",
    () => {

      autoplayPaused =
        true;


      stopAutoplay();

    }
  );


  slider.addEventListener(
    "mouseleave",
    () => {

      autoplayPaused =
        false;


      startAutoplay();

    }
  );


  /* =====================================================
     FOCUS
  ====================================================== */

  slider.addEventListener(
    "focusin",
    () => {

      autoplayPaused =
        true;


      stopAutoplay();

    }
  );


  slider.addEventListener(
    "focusout",
    () => {

      autoplayPaused =
        false;


      startAutoplay();

    }
  );


  /* =====================================================
     KEYBOARD
  ====================================================== */

  slider.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "ArrowLeft"
      ) {

        event.preventDefault();

        previousSlide();

      }


      if (
        event.key ===
        "ArrowRight"
      ) {

        event.preventDefault();

        nextSlide();

      }

    }
  );


  /* =====================================================
     TOUCH
  ====================================================== */

  slider.addEventListener(
    "touchstart",
    event => {

      touchStartX =
        event.touches[0]
          ?.clientX ??
        null;


      stopAutoplay();

    },
    {
      passive:
        true
    }
  );


  slider.addEventListener(
    "touchend",
    event => {

      if (
        touchStartX ===
        null
      ) {

        return;

      }


      const touchEndX =
        event.changedTouches[0]
          ?.clientX ??
        touchStartX;


      const distance =
        touchEndX -
        touchStartX;


      if (
        Math.abs(
          distance
        ) >
        40
      ) {

        if (
          distance <
          0
        ) {

          nextSlide();

        } else {

          previousSlide();

        }

      }


      touchStartX =
        null;


      startAutoplay();

    },
    {
      passive:
        true
    }
  );


  /* =====================================================
     PAGE VISIBILITY
  ====================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden
      ) {

        stopAutoplay();

      } else {

        startAutoplay();

      }

    }
  );


  /* =====================================================
     START
  ====================================================== */

  render(
    false
  );


  startAutoplay();

}