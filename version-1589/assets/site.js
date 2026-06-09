(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setHidden(element, hidden) {
    if (!element) {
      return;
    }
    element.hidden = hidden;
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = all('[data-hero-slide]', hero);
    var dots = all('[data-hero-dot]', hero);
    var previous = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('active', itemIndex === current);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('active', itemIndex === current);
      });
    }

    if (slides.length < 2) {
      return;
    }

    if (previous) {
      previous.addEventListener('click', function () {
        show(current - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function setupSearch() {
    var inputs = all('[data-search-input]');
    inputs.forEach(function (input) {
      var shell = input.closest('main') || document;
      var cards = all('[data-movie-card]', shell);
      var empty = shell.querySelector('[data-empty-state]');
      input.addEventListener('input', function () {
        var query = input.value.trim().toLowerCase();
        var shown = 0;
        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags'),
            card.textContent
          ].join(' ').toLowerCase();
          var matched = !query || text.indexOf(query) !== -1;
          card.style.display = matched ? '' : 'none';
          if (matched) {
            shown += 1;
          }
        });
        setHidden(empty, shown !== 0);
      });
    });
  }

  window.initMoviePlayer = function (movieUrl) {
    var video = document.getElementById('movie-player');
    var playButton = document.querySelector('[data-player-play]');
    var overlay = document.querySelector('[data-player-overlay]');
    var started = false;
    var hls = null;

    if (!video || !movieUrl) {
      return;
    }

    function attachSource() {
      if (started) {
        return;
      }
      started = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(movieUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = movieUrl;
      } else {
        video.src = movieUrl;
      }
    }

    function playVideo() {
      attachSource();
      var playResult = video.play();
      if (playResult && typeof playResult.then === 'function') {
        playResult.catch(function () {});
      }
    }

    if (playButton) {
      playButton.addEventListener('click', playVideo);
    }

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (overlay && video.currentTime === 0) {
        overlay.classList.remove('hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupSearch();
  });
})();
