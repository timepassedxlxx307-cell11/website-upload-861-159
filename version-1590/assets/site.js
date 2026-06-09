(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector('[data-nav-toggle]');
        var nav = document.getElementById('mainNav');
        if (toggle && nav) {
            toggle.addEventListener('click', function () {
                nav.classList.toggle('open');
            });
        }

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
            var prev = hero.querySelector('[data-hero-prev]');
            var next = hero.querySelector('[data-hero-next]');
            var index = 0;
            var timer = null;

            function show(to) {
                if (!slides.length) {
                    return;
                }
                index = (to + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('active', i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('active', i === index);
                });
            }

            function play() {
                clearInterval(timer);
                timer = setInterval(function () {
                    show(index + 1);
                }, 5000);
            }

            if (prev) {
                prev.addEventListener('click', function () {
                    show(index - 1);
                    play();
                });
            }
            if (next) {
                next.addEventListener('click', function () {
                    show(index + 1);
                    play();
                });
            }
            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function () {
                    show(i);
                    play();
                });
            });
            show(0);
            play();
        }

        var panel = document.querySelector('[data-filter-panel]');
        if (panel) {
            var search = panel.querySelector('[data-filter-search]');
            var type = panel.querySelector('[data-filter-type]');
            var year = panel.querySelector('[data-filter-year]');
            var items = Array.prototype.slice.call(document.querySelectorAll('[data-filterable]'));
            var empty = document.querySelector('[data-empty]');

            function normalize(value) {
                return String(value || '').toLowerCase().trim();
            }

            function apply() {
                var q = normalize(search && search.value);
                var typeValue = normalize(type && type.value);
                var yearValue = normalize(year && year.value);
                var visible = 0;
                items.forEach(function (item) {
                    var haystack = normalize([
                        item.dataset.title,
                        item.dataset.region,
                        item.dataset.type,
                        item.dataset.year,
                        item.dataset.genre,
                        item.dataset.tags
                    ].join(' '));
                    var ok = true;
                    if (q && haystack.indexOf(q) === -1) {
                        ok = false;
                    }
                    if (typeValue && normalize(item.dataset.type) !== typeValue) {
                        ok = false;
                    }
                    if (yearValue && normalize(item.dataset.year) !== yearValue) {
                        ok = false;
                    }
                    item.style.display = ok ? '' : 'none';
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('show', visible === 0);
                }
            }

            [search, type, year].forEach(function (el) {
                if (el) {
                    el.addEventListener('input', apply);
                    el.addEventListener('change', apply);
                }
            });
            apply();
        }
    });
})();
