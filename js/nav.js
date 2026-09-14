(function () {
    "use strict";

    var nav = document.querySelector(".site-nav");
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    var navLinkEls = document.querySelectorAll(".nav-links a[href^='#']");
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var scrollCue = document.getElementById("scroll-cue");

    if (toggle && links) {
        toggle.addEventListener("click", function () {
            var isOpen = links.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        navLinkEls.forEach(function (link) {
            link.addEventListener("click", function () {
                links.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    function onScroll() {
        if (nav) {
            nav.classList.toggle("is-scrolled", window.scrollY > 12);
        }

        updateScrollCue();

        var scrollPos = window.scrollY + window.innerHeight * 0.35;
        var current = null;
        sections.forEach(function (section) {
            if (scrollPos >= section.offsetTop) {
                current = section;
            }
        });

        navLinkEls.forEach(function (link) {
            var match = current && link.getAttribute("href") === "#" + current.id;
            link.classList.toggle("is-active", !!match);
        });
    }

    var heroInner = document.querySelector(".hero-inner");

    function updateScrollCue() {
        if (!scrollCue) return;

        if (window.scrollY > 200) {
            scrollCue.classList.add("is-hidden");
            return;
        }

        if (heroInner) {
            var rect = heroInner.getBoundingClientRect();
            var wouldOverlap = rect.bottom > window.innerHeight - 90;
            scrollCue.classList.toggle("is-hidden", wouldOverlap);
        } else {
            scrollCue.classList.remove("is-hidden");
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollCue);
    onScroll();
})();
