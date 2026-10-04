/* =========================================================
   COMPONENT LOADER
========================================================= */

async function loadComponent(element) {

  const componentName =
    element.dataset.component;


  if (!componentName) {
    return;
  }


  try {

    const response =
      await fetch(
        `./components/${componentName}.html?v=20261004-restored-cutout`,
        { cache: "no-cache" }
      );


    if (!response.ok) {

      throw new Error(
        `Could not load ${componentName}.html`
      );

    }


    element.innerHTML =
      await response.text();


  } catch (error) {

    console.error(error);

  }

}


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
      "./home.js"
    );


  home.initHome();

}


initialise();
