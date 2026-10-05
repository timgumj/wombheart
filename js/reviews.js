const reviewSections = document.querySelectorAll("[data-reviews]");

reviewSections.forEach((section) => {
  const reviewTrack = section.querySelector("[data-reviews-track]");
  const imageTrack = section.querySelector("[data-reviews-image-track]");

  const slides = [
    ...section.querySelectorAll("[data-review-slide]")
  ];

  const dots = [
    ...section.querySelectorAll("[data-review-dot]")
  ];

  const prevButton =
    section.querySelector("[data-review-prev]");

  const nextButton =
    section.querySelector("[data-review-next]");

  const currentNumber =
    section.querySelector("[data-review-current]");


  if (!reviewTrack || !imageTrack || !slides.length) {
    return;
  }


  let currentIndex = 0;

  let autoplayTimer = null;



  /* =====================================================
     FORMAT 01 / 02 / 03 / 04
  ====================================================== */

  const formatNumber = (index) => {
    return String(index + 1).padStart(2, "0");
  };



  /* =====================================================
     UPDATE BOTH SLIDERS
  ====================================================== */

  const updateSlider = (index) => {
    currentIndex =
      (index + slides.length) %
      slides.length;


    const offset =
      currentIndex * 100;


    /* REVIEW TEXT */

    reviewTrack.style.transform =
      `translateX(-${offset}%)`;


    /* REVIEW IMAGE */

    imageTrack.style.transform =
      `translateX(-${offset}%)`;


    /* ACTIVE REVIEW */

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle(
        "is-active",
        slideIndex === currentIndex
      );
    });


    /* ACTIVE DOT */

    dots.forEach((dot, dotIndex) => {
      const isActive =
        dotIndex === currentIndex;


      dot.classList.toggle(
        "is-active",
        isActive
      );


      dot.setAttribute(
        "aria-selected",
        String(isActive)
      );
    });


    /* NUMBER */

    if (currentNumber) {
      currentNumber.textContent =
        formatNumber(currentIndex);
    }
  };



  /* =====================================================
     NEXT
  ====================================================== */

  const next = () => {
    updateSlider(
      currentIndex + 1
    );
  };



  /* =====================================================
     PREVIOUS
  ====================================================== */

  const previous = () => {
    updateSlider(
      currentIndex - 1
    );
  };



  /* =====================================================
     AUTOPLAY
  ====================================================== */

  const stopAutoplay = () => {
    if (!autoplayTimer) {
      return;
    }

    window.clearInterval(
      autoplayTimer
    );

    autoplayTimer = null;
  };


  const startAutoplay = () => {
    stopAutoplay();

    autoplayTimer =
      window.setInterval(
        () => {
          next();
        },
        6500
      );
  };



  /* =====================================================
     BUTTONS
  ====================================================== */

  prevButton?.addEventListener(
    "click",
    () => {
      previous();

      startAutoplay();
    }
  );


  nextButton?.addEventListener(
    "click",
    () => {
      next();

      startAutoplay();
    }
  );



  /* =====================================================
     DOTS
  ====================================================== */

  dots.forEach(
    (dot, index) => {

      dot.addEventListener(
        "click",
        () => {
          updateSlider(index);

          startAutoplay();
        }
      );

    }
  );



  /* =====================================================
     PAUSE ON INTERACTION
  ====================================================== */

  section.addEventListener(
    "mouseenter",
    stopAutoplay
  );


  section.addEventListener(
    "mouseleave",
    startAutoplay
  );


  section.addEventListener(
    "focusin",
    stopAutoplay
  );


  section.addEventListener(
    "focusout",
    (event) => {

      if (
        !section.contains(
          event.relatedTarget
        )
      ) {
        startAutoplay();
      }

    }
  );



  /* =====================================================
     KEYBOARD
  ====================================================== */

  section.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
        "ArrowLeft"
      ) {
        previous();

        startAutoplay();
      }


      if (
        event.key ===
        "ArrowRight"
      ) {
        next();

        startAutoplay();
      }

    }
  );



  /* =====================================================
     TOUCH / SWIPE
  ====================================================== */

  let touchStartX = 0;

  let touchEndX = 0;


  section.addEventListener(
    "touchstart",
    (event) => {

      touchStartX =
        event
          .changedTouches[0]
          .clientX;

      stopAutoplay();

    },
    {
      passive: true
    }
  );


  section.addEventListener(
    "touchend",
    (event) => {

      touchEndX =
        event
          .changedTouches[0]
          .clientX;


      const distance =
        touchEndX -
        touchStartX;


      if (
        Math.abs(distance) >
        45
      ) {

        if (
          distance < 0
        ) {
          next();
        } else {
          previous();
        }

      }


      startAutoplay();

    },
    {
      passive: true
    }
  );



  /* =====================================================
     INITIALISE
  ====================================================== */

  updateSlider(0);

  startAutoplay();
});