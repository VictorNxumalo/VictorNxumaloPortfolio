function setupExperienceTabs() {
  const tabs = document.querySelectorAll("[data-detail-tab]");
  const panels = document.querySelectorAll("[data-detail-panel]");
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("data-detail-tab");
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach((panel) => {
        const active = panel.getAttribute("data-detail-panel") === id;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });
}

function hoistProjectCodeIntoHead(head) {
  const codeAfterHead = head.nextElementSibling;
  if (
    codeAfterHead?.classList?.contains("detail-project__code") &&
    !head.querySelector(".detail-project__code")
  ) {
    head.appendChild(codeAfterHead);
  }
}

function wrapProjectBodies() {
  document.querySelectorAll(".detail-project").forEach((card) => {
    const head = card.querySelector(".detail-project__head");
    if (!head) return;

    hoistProjectCodeIntoHead(head);

    if (card.querySelector(".detail-project__body")) return;

    const body = document.createElement("div");
    body.className = "detail-project__body";
    const inner = document.createElement("div");
    inner.className = "detail-project__inner";

    let node = head.nextSibling;
    while (node) {
      const next = node.nextSibling;
      inner.appendChild(node);
      node = next;
    }

    body.appendChild(inner);
    card.appendChild(body);
  });
}

function setupProjectCards() {
  const cards = document.querySelectorAll(".detail-project");

  cards.forEach((card) => {
    const panel = card.closest("[data-detail-panel]");
    const isFirstInPanel =
      panel && panel.querySelector(".detail-project") === card;

    const moduleList = card.closest(".detail-projects--modules");
    const isFirstModule =
      moduleList && moduleList.querySelector(".detail-project") === card;

    if (isFirstInPanel || isFirstModule) {
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
    }

    const toggle = () => {
      const open = !card.classList.contains("is-open");
      card.classList.toggle("is-open", open);
      card.setAttribute("aria-expanded", String(open));
    };

    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      toggle();
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wrapProjectBodies();
  setupProjectCards();
  setupExperienceTabs();
});
