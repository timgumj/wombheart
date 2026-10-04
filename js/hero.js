/* =========================================================
   WOMB & HEART
   HERO
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


  const currentNumber =
    hero.querySelector(
      "[data-hero-current]"
    );


  const progressItems =
    Array.from(
      hero.querySelectorAll(
        ".hero-slider-progress i"
      )
    );


  const heroImage =
    hero.querySelector(
      "[data-hero-image]"
    );


  if (
    !slider ||
    !track ||
    slides.length === 0
  ) {
    return;
  }


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  const hasGSAP =
    typeof window.gsap !==
    "undefined";


  const hasScrollTrigger =
    typeof window.ScrollTrigger !==
    "undefined";


  if (
    hasGSAP &&
    hasScrollTrigger
  ) {

    gsap.registerPlugin(
      ScrollTrigger
    );

  }


  let currentIndex = 0;

  let autoplayTimer = null;

  let autoplayPaused = false;

  let touchStartX = null;


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


    slides.forEach(
      (
        slide,
        index
      ) => {

        const active =
          index ===
          currentIndex;


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


    if (
      currentNumber
    ) {

      currentNumber.textContent =
        String(
          currentIndex + 1
        ).padStart(
          2,
          "0"
        );

    }


    progressItems.forEach(
      (
        item,
        index
      ) => {

        item.classList.toggle(
          "is-active",
          index ===
            currentIndex
        );

      }
    );


    const xPercent =
      -100 *
      currentIndex;


    if (
      hasGSAP &&
      animate &&
      !reducedMotion.matches
    ) {

      gsap.to(
        track,
        {
          xPercent,

          duration: 0.62,

          ease:
            "power3.inOut",

          overwrite:
            true
        }
      );


      const activeSlide =
        slides[currentIndex];


      const activeImage =
        activeSlide.querySelector(
          ".hero-slide-image img"
        );


      const content =
        activeSlide.querySelector(
          ".hero-slide-content"
        );


      if (activeImage) {

        gsap.fromTo(
          activeImage,
          {
            scale: 1.04
          },
          {
            scale: 1,

            duration: 0.7,

            ease:
              "power3.out"
          }
        );

      }


      if (content) {

        gsap.fromTo(
          content.children,
          {
            y: 4,

            autoAlpha: 0.55
          },
          {
            y: 0,

            autoAlpha: 1,

            stagger: 0.04,

            duration: 0.36,

            ease:
              "power3.out"
          }
        );

      }

    } else {

      track.style.transform =
        `translateX(${xPercent}%)`;

    }

  }


  /* =====================================================
     SLIDER CONTROLS ONLY
  ====================================================== */

  function showPrevious() {

    currentIndex -= 1;

    render();

    restartAutoplay();

  }


  function showNext() {

    currentIndex += 1;

    render();

    restartAutoplay();

  }


  previousButton
    ?.addEventListener(
      "click",
      showPrevious
    );


  nextButton
    ?.addEventListener(
      "click",
      showNext
    );


  /* =====================================================
     AUTOPLAY
  ====================================================== */

  function stopAutoplay() {

    if (!autoplayTimer) {
      return;
    }


    window.clearTimeout(
      autoplayTimer
    );


    autoplayTimer = null;

  }


  function startAutoplay() {

    stopAutoplay();


    if (
      autoplayPaused ||
      document.hidden ||
      reducedMotion.matches ||
      slides.length < 2
    ) {
      return;
    }


    autoplayTimer =
      window.setTimeout(
        () => {

          currentIndex += 1;

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
     PAUSE
  ====================================================== */

  slider.addEventListener(
    "mouseenter",
    () => {

      autoplayPaused = true;

      stopAutoplay();

    }
  );


  slider.addEventListener(
    "mouseleave",
    () => {

      autoplayPaused = false;

      startAutoplay();

    }
  );


  slider.addEventListener(
    "focusin",
    () => {

      autoplayPaused = true;

      stopAutoplay();

    }
  );


  slider.addEventListener(
    "focusout",
    () => {

      autoplayPaused = false;

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

        showPrevious();

      }


      if (
        event.key ===
        "ArrowRight"
      ) {

        event.preventDefault();

        showNext();

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
      passive: true
    }
  );


  slider.addEventListener(
    "touchend",
    event => {

      if (
        touchStartX === null
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
        ) > 40
      ) {

        if (
          distance < 0
        ) {

          showNext();

        } else {

          showPrevious();

        }

      }


      touchStartX = null;


      startAutoplay();

    },
    {
      passive: true
    }
  );


  /* =====================================================
     LOAD ANIMATION
  ====================================================== */

  function animateHeroIn() {

    if (
      !hasGSAP ||
      reducedMotion.matches
    ) {
      return;
    }


    const tl =
      gsap.timeline(
        {
          defaults:
            {
              ease:
                "power3.out"
            }
        }
      );


    tl.from(
      ".hero-stage",
      {
        autoAlpha: 0,

        y: 7,

        duration: 0.7
      }
    );


    if (heroImage) {

      tl.fromTo(
        heroImage,
        {
          scale: 1.025
        },
        {
          scale: 1.001,

          duration: 1.15
        },
        0
      );

    }


    tl.from(
      ".hero-notch--top-left",
      {
        x: -8,

        autoAlpha: 0,

        duration: 0.46
      },
      0.13
    );


    tl.from(
      ".hero-nadja-rule",
      {
        scaleY: 0,

        duration: 0.45
      },
      0.18
    );


    tl.from(
      ".hero-nadja-copy",
      {
        x: 6,

        autoAlpha: 0,

        duration: 0.46
      },
      0.21
    );


    tl.from(
      ".hero-slider-window",
      {
        y: 9,

        autoAlpha: 0,

        duration: 0.52
      },
      0.25
    );


    tl.from(
      ".hero-slider-navigation",
      {
        y: 5,

        autoAlpha: 0,

        duration: 0.42
      },
      0.34
    );


    /*
      PERMANENT BOTTOM-RIGHT NOTCH
    */

    tl.from(
      ".hero-notch--bottom-right",
      {
        x: 8,

        autoAlpha: 0,

        duration: 0.46
      },
      0.28
    );

  }


  /* =====================================================
     SUBTLE PARALLAX
  ====================================================== */

  if (
    hasGSAP &&
    hasScrollTrigger &&
    heroImage &&
    !reducedMotion.matches
  ) {

    gsap.to(
      heroImage,
      {
        yPercent: 1.5,

        scale: 1.007,

        ease: "none",

        scrollTrigger:
          {
            trigger: hero,

            start:
              "top top",

            end:
              "bottom top",

            scrub: 1.5
          }
      }
    );

  }


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


  render(false);

  animateHeroIn();

  startAutoplay();

}