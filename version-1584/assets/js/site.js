(function() {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"]/g, function(char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;"
            }[char];
        });
    }

    function setupMenu() {
        var button = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function() {
            var isOpen = panel.hasAttribute("hidden") === false;
            if (isOpen) {
                panel.setAttribute("hidden", "");
                button.setAttribute("aria-expanded", "false");
            } else {
                panel.removeAttribute("hidden");
                button.setAttribute("aria-expanded", "true");
            }
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function() {
                show(index + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        if (prev) {
            prev.addEventListener("click", function() {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function() {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function(dot) {
            dot.addEventListener("click", function() {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });
        var hero = document.querySelector(".hero-carousel");
        if (hero) {
            hero.addEventListener("mouseenter", stop);
            hero.addEventListener("mouseleave", start);
        }
        start();
    }

    function setupFilter() {
        var input = document.querySelector("[data-filter-input]");
        var grid = document.querySelector("[data-filter-grid]");
        var empty = document.querySelector("[data-filter-empty]");
        if (!input || !grid) {
            return;
        }
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
        input.addEventListener("input", function() {
            var query = input.value.trim().toLowerCase();
            var visible = 0;
            cards.forEach(function(card) {
                var text = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags")
                ].join(" ").toLowerCase();
                var matched = text.indexOf(query) !== -1;
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        });
    }

    function searchCard(item) {
        var tags = (item.tags || []).slice(0, 3).map(function(tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return "" +
            "<a class=\"movie-card\" href=\"" + escapeHtml(item.href) + "\">" +
            "<span class=\"poster-wrap\">" +
            "<img src=\"" + escapeHtml(item.cover) + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">" +
            "<span class=\"poster-mask\"></span>" +
            "<span class=\"year-badge\">" + escapeHtml(item.year) + "</span>" +
            "</span>" +
            "<span class=\"movie-card-body\">" +
            "<strong>" + escapeHtml(item.title) + "</strong>" +
            "<span class=\"movie-meta\">" + escapeHtml(item.region) + " · " + escapeHtml(item.type) + "</span>" +
            "<span class=\"movie-desc\">" + escapeHtml(item.oneLine) + "</span>" +
            "<span class=\"tag-row\">" + tags + "</span>" +
            "</span>" +
            "</a>";
    }

    function setupSearchPage() {
        var results = document.getElementById("search-results");
        var summary = document.getElementById("search-summary");
        var input = document.getElementById("search-query");
        if (!results || !summary || !window.MOVIE_SEARCH_DATA) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = (params.get("q") || "").trim();
        if (input) {
            input.value = query;
        }
        if (!query) {
            summary.textContent = "热门影片推荐";
            return;
        }
        var lowered = query.toLowerCase();
        var matched = window.MOVIE_SEARCH_DATA.filter(function(item) {
            return [
                item.title,
                item.region,
                item.type,
                item.genre,
                item.categoryName,
                item.oneLine,
                (item.tags || []).join(" ")
            ].join(" ").toLowerCase().indexOf(lowered) !== -1;
        });
        summary.textContent = "搜索“" + query + "”的相关结果";
        if (matched.length === 0) {
            results.className = "empty-state";
            results.innerHTML = "没有匹配的影片";
            return;
        }
        results.className = "movie-grid";
        results.innerHTML = matched.map(searchCard).join("");
    }

    ready(function() {
        setupMenu();
        setupHero();
        setupFilter();
        setupSearchPage();
    });
})();
