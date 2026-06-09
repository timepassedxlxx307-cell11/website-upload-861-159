(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function setupMobileNav() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-search-input]");
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .rank-row"));
            var active = {};
            var params = new URLSearchParams(window.location.search);
            var urlQuery = params.get("q");
            if (urlQuery && input && !input.value) {
                input.value = urlQuery;
            }

            function apply() {
                var query = input ? input.value.trim().toLowerCase() : "";
                cards.forEach(function (card) {
                    var text = card.getAttribute("data-search") || "";
                    var matchQuery = !query || text.indexOf(query) !== -1;
                    var matchFilters = Object.keys(active).every(function (field) {
                        var value = active[field];
                        if (!value) {
                            return true;
                        }
                        var data = card.getAttribute("data-" + field) || "";
                        return data.indexOf(value) !== -1;
                    });
                    card.classList.toggle("is-filtered-out", !(matchQuery && matchFilters));
                });
            }

            if (input) {
                input.addEventListener("input", apply);
            }

            Array.prototype.slice.call(scope.querySelectorAll("[data-filter-field]")).forEach(function (button) {
                button.addEventListener("click", function () {
                    var field = button.getAttribute("data-filter-field");
                    var value = button.getAttribute("data-filter-value") || "";
                    active[field] = value;
                    Array.prototype.slice.call(scope.querySelectorAll('[data-filter-field="' + field + '"]')).forEach(function (item) {
                        item.classList.toggle("is-active", item === button);
                    });
                    apply();
                });
            });
            apply();
        });
    }

    ready(function () {
        setupMobileNav();
        setupHero();
        setupFilters();
    });
}());

function initPlayer(videoId, overlayId, streamUrl) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    if (!video || !overlay || !streamUrl) {
        return;
    }
    var attached = false;
    var hlsInstance = null;

    function attach() {
        if (attached) {
            return;
        }
        attached = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
    }

    function play() {
        attach();
        overlay.classList.add("is-hidden");
        var action = video.play();
        if (action && typeof action.catch === "function") {
            action.catch(function () {});
        }
    }

    overlay.addEventListener("click", play);
    video.addEventListener("play", function () {
        overlay.classList.add("is-hidden");
    });
    video.addEventListener("emptied", function () {
        if (hlsInstance && typeof hlsInstance.destroy === "function") {
            hlsInstance.destroy();
        }
    });
}
