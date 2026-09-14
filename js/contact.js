(function () {
    "use strict";

    var form = document.querySelector(".contact-form");
    if (!form) return;

    var statusEl = form.querySelector(".form-status");
    var submitBtn = form.querySelector("button[type='submit']");

    function setStatus(text, state) {
        if (!statusEl) return;
        statusEl.textContent = text;
        statusEl.setAttribute("data-state", state || "");
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(form);

        if (submitBtn) submitBtn.disabled = true;
        setStatus("Sending...", "");

        fetch(form.action, {
            method: "POST",
            mode: "no-cors",
            body: formData
        })
            .then(function () {
                setStatus("Thanks — I'll get back to you soon.", "success");
                form.reset();
            })
            .catch(function () {
                setStatus("Something went wrong. Email me directly instead.", "error");
            })
            .finally(function () {
                if (submitBtn) submitBtn.disabled = false;
            });
    });
})();
