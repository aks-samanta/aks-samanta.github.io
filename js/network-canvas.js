(function () {
    "use strict";

    var canvas = document.getElementById("hero-canvas");
    if (!canvas || !canvas.getContext) return;

    // network-3d.js defers its eligibility decision by one macrotask tick
    // (window.innerWidth isn't reliable at synchronous parse time in every
    // environment) — queue behind it so __heroUses3D is settled before we read it.
    setTimeout(function () {
        if (window.__heroUses3D) {
            window.addEventListener("hero3dfallback", init, { once: true });
            return;
        }
        init();
    });

    function init() {

    var ctx = canvas.getContext("2d");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [];
    var pointer = { x: null, y: null, active: false };
    var rafId = null;
    var running = true;

    var accentColor = "91, 140, 255";

    function readAccent() {
        var v = getComputedStyle(document.body).getPropertyValue("--accent-rgb").trim();
        if (v) accentColor = v;
    }

    function nodeCountFor(w) {
        if (w < 640) return 26;
        if (w < 1100) return 46;
        return 64;
    }

    function resize() {
        var rect = canvas.parentElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed();
    }

    function seed() {
        var count = nodeCountFor(width);
        nodes = [];
        for (var i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.18,
                vy: (Math.random() - 0.5) * 0.18,
                r: 1.1 + Math.random() * 1.4
            });
        }
    }

    function step() {
        ctx.clearRect(0, 0, width, height);
        var linkDist = Math.min(width * 0.16, 150);

        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;
            n.x = Math.max(0, Math.min(width, n.x));
            n.y = Math.max(0, Math.min(height, n.y));

            if (pointer.active) {
                var dx = n.x - pointer.x, dy = n.y - pointer.y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < 140) {
                    var force = (140 - d) / 140 * 0.02;
                    n.vx += (dx / (d || 1)) * force;
                    n.vy += (dy / (d || 1)) * force;
                }
            }

            n.vx *= 0.995;
            n.vy *= 0.995;
        }

        for (var a = 0; a < nodes.length; a++) {
            for (var b = a + 1; b < nodes.length; b++) {
                var na = nodes[a], nb = nodes[b];
                var ddx = na.x - nb.x, ddy = na.y - nb.y;
                var dist = Math.sqrt(ddx * ddx + ddy * ddy);
                if (dist < linkDist) {
                    var alpha = (1 - dist / linkDist) * 0.35;
                    ctx.strokeStyle = "rgba(" + accentColor + ", " + alpha.toFixed(3) + ")";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(na.x, na.y);
                    ctx.lineTo(nb.x, nb.y);
                    ctx.stroke();
                }
            }
        }

        for (var i2 = 0; i2 < nodes.length; i2++) {
            var nn = nodes[i2];
            ctx.beginPath();
            ctx.fillStyle = "rgba(" + accentColor + ", 0.75)";
            ctx.arc(nn.x, nn.y, nn.r, 0, Math.PI * 2);
            ctx.fill();
        }

        if (running && !reduceMotion) {
            rafId = requestAnimationFrame(step);
        }
    }

    function handlePointerMove(e) {
        var rect = canvas.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        pointer.active = true;
    }

    function handlePointerLeave() {
        pointer.active = false;
    }

    readAccent();
    resize();
    step();

    window.addEventListener("resize", debounce(function () {
        readAccent();
        resize();
        if (reduceMotion) step();
    }, 150));

    window.addEventListener("themechange", function () {
        readAccent();
        if (reduceMotion) step();
    });

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    document.addEventListener("visibilitychange", function () {
        running = document.visibilityState === "visible";
        if (running && !reduceMotion && !rafId) step();
    });

    function debounce(fn, wait) {
        var t;
        return function () {
            clearTimeout(t);
            var args = arguments;
            t = setTimeout(function () { fn.apply(null, args); }, wait);
        };
    }
    }
})();
