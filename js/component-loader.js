/* =========================================================
   WOMB & HEART
   COMPONENT LOADER

   IMPORTANT:
   THE HERO IS NOW DIRECTLY IN index.html.
   THIS LOADER LOADS THE HEADER ONLY.
========================================================= */

const VERSION =
  "20261004-premium-hero";


async function loadComponent(
  element
) {

  const componentName =
    element.dataset.component;


  if (!componentName) {
    return;
  }


  try {

    const response =
      await fetch(
        `./components/${componentName}.html?v=${VERSION}`,
        {
          cache:
            "no-store"
        }
      );


    if (
      !response.ok
    ) {

      throw new Error(
        `Could not load ${componentName}.html`
      );

    }


    element.innerHTML =
      await response.text();


  } catch (
    error
  ) {

    console.error(
      error
    );

  }

}


/* =========================================================
   INITIALISE
========================================================= */

async function initialise() {

  const components =
    Array.from(
      document.querySelectorAll(
        "[data-component]"
      )
    );


  await Promise.all(
    components.map(
      loadComponent
    )
  );


  const home =
    await import(
      `./home.js?v=${VERSION}`
    );


  await home.initHome();

}


initialise();