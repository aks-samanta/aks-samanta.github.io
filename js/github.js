(function () {
    "use strict";

    var el = document.getElementById("github-pulse");
    if (!el || !window.fetch) return;

    var USERNAME = "aks-samanta";

    function formatRelative(date) {
        var days = Math.floor((Date.now() - date.getTime()) / 86400000);
        if (days <= 0) return "today";
        if (days === 1) return "yesterday";
        if (days < 30) return days + "d ago";
        var months = Math.floor(days / 30);
        if (months < 12) return months + "mo ago";
        return Math.floor(months / 12) + "y ago";
    }

    Promise.all([
        fetch("https://api.github.com/users/" + USERNAME).then(function (r) { return r.ok ? r.json() : null; }),
        fetch("https://api.github.com/users/" + USERNAME + "/repos?sort=pushed&per_page=1").then(function (r) { return r.ok ? r.json() : null; })
    ]).then(function (results) {
        var user = results[0];
        var repos = results[1];
        if (!user) return;

        var reposEl = document.getElementById("gh-repos");
        var followersEl = document.getElementById("gh-followers");
        var updatedEl = document.getElementById("gh-updated");

        if (reposEl && user.public_repos != null) reposEl.textContent = user.public_repos;
        if (followersEl && user.followers != null) followersEl.textContent = user.followers;
        if (updatedEl && Array.isArray(repos) && repos[0] && repos[0].pushed_at) {
            updatedEl.textContent = formatRelative(new Date(repos[0].pushed_at));
        }

        el.hidden = false;
    }).catch(function () {
        // Unauthenticated GitHub API calls are rate-limited; fail silently and
        // just skip the strip rather than show broken/stale data.
    });
})();
