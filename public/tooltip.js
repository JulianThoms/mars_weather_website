"use strict";

// Small tooltip for chart elements with a data-tip attribute (mouse and keyboard)
(function () {
  const tip = document.createElement("div");
  tip.className = "tooltip";
  tip.hidden = true;
  document.body.appendChild(tip);

  function show(el, x, y) {
    tip.textContent = el.getAttribute("data-tip");
    tip.hidden = false;
    const left = Math.min(x + 12, window.innerWidth - tip.offsetWidth - 8);
    tip.style.left = left + "px";
    tip.style.top = (y - tip.offsetHeight - 10) + "px";
  }

  document.querySelectorAll("[data-tip]").forEach((el) => {
    el.addEventListener("mousemove", (e) => show(el, e.clientX, e.clientY));
    el.addEventListener("mouseleave", () => { tip.hidden = true; });
    el.addEventListener("focus", () => {
      const box = el.getBoundingClientRect();
      show(el, box.left + box.width / 2, box.top);
    });
    el.addEventListener("blur", () => { tip.hidden = true; });
  });
})();
