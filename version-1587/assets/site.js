(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");
        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        var carousel = document.querySelector("[data-carousel]");
        if (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
            var current = 0;
            var timer = null;

            function showSlide(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            function startTimer() {
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(function () {
                    showSlide(current + 1);
                }, 5200);
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                    startTimer();
                });
            });

            if (slides.length > 1) {
                startTimer();
            }
        }

        Array.prototype.slice.call(document.querySelectorAll("[data-search-input]")).forEach(function (input) {
            var targetSelector = input.getAttribute("data-target");
            var target = targetSelector ? document.querySelector(targetSelector) : null;
            if (!target) {
                return;
            }
            var cards = Array.prototype.slice.call(target.querySelectorAll("[data-card]"));
            var panel = input.closest(".search-panel");
            var clearButton = panel ? panel.querySelector("[data-search-clear]") : null;

            function normalize(value) {
                return String(value || "").trim().toLowerCase();
            }

            function applyFilter() {
                var keyword = normalize(input.value);
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-year"),
                        card.textContent
                    ].join(" "));
                    card.classList.toggle("is-hidden", keyword && haystack.indexOf(keyword) === -1);
                });
            }

            input.addEventListener("input", applyFilter);
            if (clearButton) {
                clearButton.addEventListener("click", function () {
                    input.value = "";
                    applyFilter();
                    input.focus();
                });
            }
        });
    });
})();
