(function () {
    "use strict";

    var canvas3d = document.getElementById("hero-canvas-3d");
    var canvas2d = document.getElementById("hero-canvas");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function supportsWebGL() {
        try {
            var c = document.createElement("canvas");
            return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
        } catch (err) {
            return false;
        }
    }

    var eligible = !reduceMotion &&
        window.innerWidth >= 760 &&
        typeof THREE !== "undefined" &&
        !!canvas3d &&
        supportsWebGL();

    window.__heroUses3D = eligible;

    if (!eligible) {
        if (canvas3d) canvas3d.style.display = "none";
        return;
    }

    if (canvas2d) canvas2d.style.display = "none";

    var container = canvas3d.parentElement;
    var width = container.clientWidth;
    var height = container.clientHeight;

    var accent = new THREE.Color(0x5b8cff);
    function readAccent() {
        var v = getComputedStyle(document.body).getPropertyValue("--accent").trim();
        if (v) accent.set(v);
    }
    readAccent();

    var renderer = new THREE.WebGLRenderer({ canvas: canvas3d, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.2);

    var group = new THREE.Group();
    group.position.set(1.1, -0.2, 0);
    scene.add(group);

    function makeDiscTexture() {
        var size = 64;
        var c = document.createElement("canvas");
        c.width = c.height = size;
        var ctx = c.getContext("2d");
        var grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        return new THREE.CanvasTexture(c);
    }

    var NODE_COUNT = 130;
    var positions = [];
    var goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < NODE_COUNT; i++) {
        var y = 1 - (i / (NODE_COUNT - 1)) * 2;
        var radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
        var theta = goldenAngle * i;
        var x = Math.cos(theta) * radiusAtY;
        var z = Math.sin(theta) * radiusAtY;
        positions.push(new THREE.Vector3(x, y, z).multiplyScalar(3.6));
    }

    var pointsGeo = new THREE.BufferGeometry().setFromPoints(positions);
    var pointsMat = new THREE.PointsMaterial({
        color: accent,
        size: 0.1,
        map: makeDiscTexture(),
        transparent: true,
        depthWrite: false,
        opacity: 0.9,
        sizeAttenuation: true
    });
    var pointCloud = new THREE.Points(pointsGeo, pointsMat);
    group.add(pointCloud);

    var linePositions = [];
    var K = 3;
    for (var a = 0; a < positions.length; a++) {
        var dists = [];
        for (var b = 0; b < positions.length; b++) {
            if (a === b) continue;
            dists.push({ idx: b, d: positions[a].distanceTo(positions[b]) });
        }
        dists.sort(function (m, n) { return m.d - n.d; });
        for (var k = 0; k < K; k++) {
            var other = dists[k];
            if (other.d < 1.6) {
                linePositions.push(positions[a].x, positions[a].y, positions[a].z);
                linePositions.push(positions[other.idx].x, positions[other.idx].y, positions[other.idx].z);
            }
        }
    }
    var lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    var lineMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.22 });
    var lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    var targetRotX = 0, targetRotY = 0;
    function onPointerMove(e) {
        var rect = container.getBoundingClientRect();
        var nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        var ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        targetRotY = nx * 0.35;
        targetRotX = ny * -0.2;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    var tabVisible = true;
    var heroVisible = true;
    var frameQueued = false;

    function animate() {
        frameQueued = false;
        if (!tabVisible || !heroVisible) return;

        group.rotation.x += (targetRotX - group.rotation.x) * 0.05;
        group.rotation.y += 0.0014 + targetRotY * 0.01;

        renderer.render(scene, camera);
        frameQueued = true;
        requestAnimationFrame(animate);
    }

    function kick() {
        if (!frameQueued && tabVisible && heroVisible) {
            frameQueued = true;
            requestAnimationFrame(animate);
        }
    }

    kick();

    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            heroVisible = entries[0].isIntersecting;
            kick();
        }, { threshold: 0 });
        io.observe(container);
    }

    document.addEventListener("visibilitychange", function () {
        tabVisible = document.visibilityState === "visible";
        kick();
    });

    window.addEventListener("themechange", function () {
        readAccent();
        pointsMat.color = accent;
        lineMat.color = accent;
    });

    function resize() {
        width = container.clientWidth;
        height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener("resize", debounce(resize, 150));

    function debounce(fn, wait) {
        var t;
        return function () {
            clearTimeout(t);
            var args = arguments;
            t = setTimeout(function () { fn.apply(null, args); }, wait);
        };
    }
})();
