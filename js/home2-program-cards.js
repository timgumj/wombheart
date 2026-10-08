const grid = document.querySelector("#angebote .angebote-grid");
const experience = document.querySelector("#yoga-experiences");

if (!(grid instanceof HTMLElement) || !(experience instanceof HTMLElement)) {
  throw new Error("home2 offer-card program content could not be initialized.");
}

const cards = Array.from(grid.querySelectorAll(":scope > .angebot-card"));
const panels = Array.from(experience.querySelectorAll("[data-program-panel]"));
const switcherShell = experience.querySelector(".program-experience-shell");
const cardByProgram = new Map([
  ["mama", grid.querySelector(".angebot-card--mama")],
  ["nidra", grid.querySelector(".angebot-card--nidra")],
  ["education", grid.querySelector(".angebot-card--education")],
  ["book", grid.querySelector(".angebot-card--book")],
]);
const panelByProgram = new Map(
  panels.map((panel) => [panel.dataset.programPanel, panel]),
);

if (
  cards.length !== 4 ||
  !(switcherShell instanceof HTMLElement) ||
  Array.from(cardByProgram.values()).some((card) => !(card instanceof HTMLElement)) ||
  ["mama", "nidra", "book"].some((program) => !panelByProgram.has(program))
) {
  throw new Error("home2 offer-card program content is incomplete.");
}

grid.append(experience);
switcherShell.hidden = true;
panels.forEach((panel) => {
  panel.hidden = true;
});

const programByCard = new Map();
const returnButtonByTarget = new Map();
const labelByProgram = new Map([
  ["mama", "Yoga Mama"],
  ["nidra", "Yoga Nidra"],
  ["education", "Education"],
  ["book", "The Book"],
]);

for (const [program, card] of cardByProgram) {
  const target = panelByProgram.get(program) ?? card;
  const returnButton = document.createElement("button");
  const label = document.createElement("span");
  const cardLabel = document.createElement("span");
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  card.tabIndex = 0;
  card.setAttribute("aria-label", `Mehr zu ${labelByProgram.get(program)} anzeigen`);
  card.setAttribute("aria-controls", target.id);
  card.setAttribute("aria-expanded", "false");
  card.dataset.home2Label = labelByProgram.get(program);
  cardLabel.className = "home2-card-label";
  cardLabel.textContent = labelByProgram.get(program);
  card.append(cardLabel);
  programByCard.set(card, program);

  returnButton.type = "button";
  returnButton.className = "home2-program-return";
  returnButton.hidden = true;
  returnButton.setAttribute("aria-label", "Zurück zu allen Angeboten");
  label.textContent = "ALLE ANGEBOTE";
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  path.setAttribute("d", "M19 12H5m7 7-7-7 7-7");
  icon.append(path);
  returnButton.append(icon, label);
  target.append(returnButton);
  returnButtonByTarget.set(target, returnButton);
}

let activeProgram = null;
let ignoreNextFocus = null;
let suppressedPointerPoint = null;
let pendingHoverTimer = null;

function activate(program, moveFocus = false) {
  const card = cardByProgram.get(program);
  const target = panelByProgram.get(program) ?? card;

  if (!(card instanceof HTMLElement) || !(target instanceof HTMLElement)) {
    throw new Error(`home2 offer-card program "${program}" is unavailable.`);
  }

  activeProgram = program;
  grid.dataset.home2ActiveProgram = program;

  panels.forEach((panel) => {
    if (panel.parentElement !== experience) {
      experience.append(panel);
    }
  });

  cards.forEach((offerCard) => {
    const selectedCard = offerCard === card;
    offerCard.hidden = false;
    offerCard.classList.toggle("home2-is-selected", selectedCard);
    offerCard.setAttribute("aria-expanded", String(offerCard === card));
  });

  panels.forEach((panel) => {
    const selected = panel === target;
    panel.hidden = !selected;
    panel.classList.toggle("home2-is-active", selected);
  });

  if (target !== card) {
    card.append(target);
  }

  returnButtonByTarget.forEach((button, buttonTarget) => {
    button.hidden = buttonTarget !== target;
  });

  if (moveFocus) {
    returnButtonByTarget.get(target).focus({ preventScroll: true });
  }
}

function reset(restoreFocus = false) {
  if (!activeProgram) {
    return;
  }

  const activeCard = cardByProgram.get(activeProgram);
  const activeTarget = panelByProgram.get(activeProgram) ?? activeCard;
  const focusWasInTarget =
    activeTarget instanceof HTMLElement &&
    activeTarget.contains(document.activeElement);

  activeProgram = null;
  delete grid.dataset.home2ActiveProgram;

  cards.forEach((card) => {
    card.hidden = false;
    card.classList.remove("home2-is-selected");
    card.style.gridColumn = "";
    card.setAttribute("aria-expanded", "false");
  });

  panels.forEach((panel) => {
    if (panel.parentElement !== experience) {
      experience.append(panel);
    }
    panel.hidden = true;
    panel.classList.remove("home2-is-active");
  });

  returnButtonByTarget.forEach((button) => {
    button.hidden = true;
  });

  if (restoreFocus || focusWasInTarget) {
    ignoreNextFocus = activeCard;
    activeCard.focus({ preventScroll: true });
  }
}

for (const [card, program] of programByCard) {
  card.addEventListener("focusin", () => {
    if (ignoreNextFocus === card) {
      ignoreNextFocus = null;
      return;
    }

    activate(program);
  });

  card.addEventListener("keydown", (event) => {
    if (event.target !== card || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    activate(program);
  });
}

grid.addEventListener("pointerleave", () => {
  window.clearTimeout(pendingHoverTimer);
  pendingHoverTimer = null;
  suppressedPointerPoint = null;
  reset();
});

grid.addEventListener("pointermove", (event) => {
  if (suppressedPointerPoint) {
    if (
      Math.hypot(
      event.clientX - suppressedPointerPoint.x,
      event.clientY - suppressedPointerPoint.y,
      ) <= 4
    ) {
      return;
    }

    suppressedPointerPoint = null;
  }

  if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
    return;
  }

  const card =
    event.target instanceof Element
      ? event.target.closest(".angebot-card")
      : null;
  const program = programByCard.get(card);
  if (!program || program === activeProgram) {
    window.clearTimeout(pendingHoverTimer);
    pendingHoverTimer = null;
    return;
  }

  window.clearTimeout(pendingHoverTimer);
  pendingHoverTimer = window.setTimeout(() => {
    activate(program);
    pendingHoverTimer = null;
  }, 60);
});

grid.addEventListener("click", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof Element)) {
    return;
  }

  const returnButton = targetElement.closest(".home2-program-return");
  if (returnButton instanceof HTMLButtonElement) {
    event.preventDefault();
    event.stopPropagation();
    window.clearTimeout(pendingHoverTimer);
    pendingHoverTimer = null;
    reset(true);
    suppressedPointerPoint = {
      x: event.clientX,
      y: event.clientY,
    };
    return;
  }

  const card = targetElement.closest(".angebot-card");
  const program = programByCard.get(card);
  if (!program || program === activeProgram) {
    return;
  }

  event.preventDefault();
  activate(program, true);
});

document.addEventListener(
  "click",
  (event) => {
    const targetElement = event.target;
    if (!(targetElement instanceof Element)) {
      return;
    }

    const link = targetElement.closest('a[href^="#"]');
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    const target = document.getElementById(link.hash.slice(1));
    const panel = target?.closest("[data-program-panel]");
    const program = panel?.dataset.programPanel;
    if (!program || !panel.hidden) {
      return;
    }

    event.preventDefault();
    activate(program);
    history.pushState(null, "", link.hash);
    requestAnimationFrame(() => {
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  },
  true,
);
