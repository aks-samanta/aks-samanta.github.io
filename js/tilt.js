(function () {
    "use strict";

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var noHover = window.matchMedia && window.matchMedia("(hover: none)").matches;
    if (reduceMotion || noHover) return;

    var els = document.querySelectorAll(".build-card, .log-entry, .zone, .earlier-card");
    var MAX_TILT = 5;

    els.forEach(function (el) {
        el.style.transition = "transform 0.15s ease-out";
        el.style.transformStyle = "preserve-3d";
        el.style.willChange = "transform";

        el.addEventListener("mousemove", function (e) {
            var rect = el.getBoundingClientRect();
            var px = (e.clientX - rect.left) / rect.width;
            var py = (e.clientY - rect.top) / rect.height;
            var rotY = (px - 0.5) * MAX_TILT * 2;
            var rotX = (0.5 - py) * MAX_TILT * 2;
            el.style.transform =
                "perspective(900px) rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg) translateZ(6px)";
        });

        el.addEventListener("mouseleave", function () {
            el.style.transform = "";
        });
    });
})();
