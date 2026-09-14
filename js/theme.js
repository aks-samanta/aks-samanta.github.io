(function () {
    "use strict";

    var STORAGE_KEY = "as-theme";
    var toggleBtn = document.querySelector(".theme-toggle");

    function applyTheme(theme) {
        document.body.classList.toggle("light-mode", theme === "light");
        if (toggleBtn) {
            toggleBtn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
        }
        window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
    }

    function getStored() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (err) {
            return null;
        }
    }

    function setStored(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (err) {
            /* storage unavailable, ignore */
        }
    }

    var stored = getStored();
    var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(stored || (prefersLight ? "light" : "dark"));

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            var next = document.body.classList.contains("light-mode") ? "dark" : "light";
            applyTheme(next);
            setStored(next);
        });
    }
})();
