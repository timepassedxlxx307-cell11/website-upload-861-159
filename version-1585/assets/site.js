(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('.nav-links');
  var navSearch = document.querySelector('.nav-search');

  if (menuButton && navLinks && navSearch) {
    menuButton.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
      navSearch.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var prev = document.querySelector('[data-hero="prev"]');
  var next = document.querySelector('[data-hero="next"]');
  var heroIndex = 0;
  var heroTimer = null;

  function showHero(index) {
    if (!slides.length) {
      return;
    }
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === heroIndex);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === heroIndex);
    });
  }

  function startHero() {
    if (heroTimer) {
      clearInterval(heroTimer);
    }
    if (slides.length > 1) {
      heroTimer = setInterval(function () {
        showHero(heroIndex + 1);
      }, 5600);
    }
  }

  if (slides.length) {
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showHero(dotIndex);
        startHero();
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        showHero(heroIndex - 1);
        startHero();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showHero(heroIndex + 1);
        startHero();
      });
    }
    showHero(0);
    startHero();
  }

  Array.prototype.slice.call(document.querySelectorAll('.page-filter')).forEach(function (input) {
    var target = document.querySelector(input.getAttribute('data-target'));
    if (!target) {
      return;
    }
    var cards = Array.prototype.slice.call(target.querySelectorAll('[data-search]'));
    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = card.getAttribute('data-search') || '';
        card.style.display = haystack.indexOf(keyword) >= 0 ? '' : 'none';
      });
    });
  });

  var searchPage = document.querySelector('[data-search-page]');
  if (searchPage && window.searchItems) {
    var params = new URLSearchParams(window.location.search);
    var queryInput = document.querySelector('.search-input');
    var resultBox = document.querySelector('.search-results');
    var query = params.get('q') || '';
    if (queryInput) {
      queryInput.value = query;
    }

    function escapeHtml(text) {
      return String(text || '').replace(/[&<>"]/g, function (mark) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;'
        }[mark];
      });
    }

    function renderResults(value) {
      var words = value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      var items = window.searchItems.filter(function (item) {
        if (!words.length) {
          return item.featured;
        }
        var text = [item.title, item.region, item.type, item.year, item.genre, item.tags, item.oneLine].join(' ').toLowerCase();
        return words.every(function (word) {
          return text.indexOf(word) >= 0;
        });
      }).slice(0, 120);

      if (!items.length) {
        resultBox.innerHTML = '<div class="empty-state">换一个片名、类型、地区或标签试试</div>';
        return;
      }

      resultBox.innerHTML = '<div class="movie-grid category-grid">' + items.map(function (item) {
        return '<article class="movie-card">' +
          '<a class="poster-link" href="' + escapeHtml(item.url) + '" aria-label="' + escapeHtml(item.title) + '">' +
          '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
          '<span class="poster-shade"></span><span class="poster-play">▶</span></a>' +
          '<div class="card-body"><div class="card-badges"><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.year) + '</span></div>' +
          '<h2><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h2>' +
          '<p>' + escapeHtml(item.oneLine) + '</p>' +
          '<div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.genre) + '</span></div></div></article>';
      }).join('') + '</div>';
    }

    if (queryInput) {
      queryInput.addEventListener('input', function () {
        renderResults(queryInput.value);
      });
    }
    renderResults(query);
  }
})();
