/* =========================================================
   WOMB & HEART
   HOME INITIALISATION
========================================================= */

const VERSION =
  "20261004-premium-hero";


export async function initHome() {

  const [
    headerModule,
    heroModule
  ] =
    await Promise.all(
      [

        import(
          `./header.js?v=${VERSION}`
        ),

        import(
          `./hero.js?v=${VERSION}`
        )

      ]
    );


  headerModule.initHeader();

  heroModule.initHero();

}