const tablist = document.querySelector(".program-switcher-tabs");

if (tablist) {
  const tabs = Array.from(tablist.querySelectorAll("[data-program-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-program-panel]"));

  function activateProgram(program, moveFocus = false) {
    const selectedTab = tabs.find((tab) => tab.dataset.programTab === program);
    const selectedPanel = panels.find((panel) => panel.dataset.programPanel === program);

    if (!selectedTab || !selectedPanel) {
      return;
    }

    tabs.forEach((tab) => {
      const selected = tab === selectedTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel !== selectedPanel;
    });

    if (moveFocus) {
      selectedTab.focus();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateProgram(tab.dataset.programTab);
    });

    tab.addEventListener("keydown", (event) => {
      let nextIndex;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activateProgram(tabs[nextIndex].dataset.programTab, true);
    });
  });

  const initialTarget = document.getElementById(window.location.hash.slice(1));
  const initialPanel = initialTarget?.closest("[data-program-panel]");

  if (initialPanel) {
    activateProgram(initialPanel.dataset.programPanel);
  } else {
    activateProgram("mama");
  }

  document.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest('a[href^="#"]');

      if (!link) {
        return;
      }

      const target = document.getElementById(link.hash.slice(1));
      const targetPanel = target?.closest("[data-program-panel]");

      if (!targetPanel || !targetPanel.hidden) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      activateProgram(targetPanel.dataset.programPanel);
      history.pushState(null, "", link.hash);
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    true,
  );
}
