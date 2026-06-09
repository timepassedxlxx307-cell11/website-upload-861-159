(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    ready(function () {
        var toggle = document.querySelector('[data-menu-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (toggle && panel) {
            toggle.addEventListener('click', function () {
                panel.classList.toggle('is-open');
            });
        }

        document.querySelectorAll('[data-search-form]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var input = form.querySelector('input[name="q"]');
                var query = input ? input.value.trim() : '';
                if (!query) {
                    event.preventDefault();
                    if (input) {
                        input.focus();
                    }
                    return;
                }
                event.preventDefault();
                window.location.href = './search.html?q=' + encodeURIComponent(query);
            });
        });

        document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
            var prev = carousel.querySelector('.hero-prev');
            var next = carousel.querySelector('.hero-next');
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, current) {
                    slide.classList.toggle('is-active', current === index);
                });
                dots.forEach(function (dot, current) {
                    dot.classList.toggle('is-active', current === index);
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

            dots.forEach(function (dot, current) {
                dot.addEventListener('click', function () {
                    show(current);
                    start();
                });
            });

            if (prev) {
                prev.addEventListener('click', function () {
                    show(index - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener('click', function () {
                    show(index + 1);
                    start();
                });
            }

            carousel.addEventListener('mouseenter', stop);
            carousel.addEventListener('mouseleave', start);
            show(0);
            start();
        });

        document.querySelectorAll('.filter-input').forEach(function (input) {
            var list = document.querySelector('.filter-list');
            if (!list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
            input.addEventListener('input', function () {
                var query = normalize(input.value);
                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute('data-search'));
                    card.style.display = !query || text.indexOf(query) !== -1 ? '' : 'none';
                });
            });
        });

        document.querySelectorAll('[data-side-play]').forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                var playerButton = document.querySelector('[data-play]');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (playerButton) {
                    window.setTimeout(function () {
                        playerButton.click();
                    }, 280);
                }
            });
        });

        var resultBox = document.getElementById('search-results');
        var status = document.getElementById('search-status');
        if (resultBox && status && window.searchIndex) {
            var params = new URLSearchParams(window.location.search);
            var query = normalize(params.get('q'));
            var pageInput = document.querySelector('.page-search input[name="q"]');
            if (pageInput && query) {
                pageInput.value = params.get('q');
            }
            if (!query) {
                return;
            }
            var results = window.searchIndex.filter(function (movie) {
                return normalize(movie.search).indexOf(query) !== -1;
            });
            status.textContent = results.length ? '为你找到相关影视内容' : '未找到相关内容';
            var fragment = document.createDocumentFragment();
            results.forEach(function (movie) {
                fragment.appendChild(createCard(movie));
            });
            resultBox.appendChild(fragment);
        }
    });

    function createCard(movie) {
        var article = document.createElement('article');
        article.className = 'movie-card card-grid-item';

        var poster = document.createElement('a');
        poster.className = 'poster-link';
        poster.href = movie.page;

        var image = document.createElement('img');
        image.src = movie.cover;
        image.alt = movie.title;
        image.loading = 'lazy';
        poster.appendChild(image);

        var badge = document.createElement('span');
        badge.className = 'poster-badge';
        badge.textContent = movie.type;
        poster.appendChild(badge);

        var body = document.createElement('div');
        body.className = 'card-body';

        var title = document.createElement('a');
        title.className = 'card-title';
        title.href = movie.page;
        title.textContent = movie.title;
        body.appendChild(title);

        var desc = document.createElement('p');
        desc.textContent = movie.oneLine;
        body.appendChild(desc);

        var tagRow = document.createElement('div');
        tagRow.className = 'tag-row';
        movie.tags.slice(0, 3).forEach(function (tag) {
            var span = document.createElement('span');
            span.textContent = tag;
            tagRow.appendChild(span);
        });
        body.appendChild(tagRow);

        var meta = document.createElement('div');
        meta.className = 'card-meta';
        var region = document.createElement('span');
        region.textContent = movie.region;
        var year = document.createElement('span');
        year.textContent = movie.year;
        meta.appendChild(region);
        meta.appendChild(year);
        body.appendChild(meta);

        article.appendChild(poster);
        article.appendChild(body);
        return article;
    }
}());
