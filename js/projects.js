(function () {
    "use strict";

    var toggle = document.querySelector(".earlier-toggle");
    var panel = document.querySelector(".earlier-panel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
        var isOpen = panel.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        toggle.querySelector(".chev-label").textContent = isOpen ? "Hide earlier work" : "Show earlier work";
    });
})();
