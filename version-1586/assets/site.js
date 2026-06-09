(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-nav-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var sliders = document.querySelectorAll('[data-hero-slider]');
  sliders.forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  var searchPage = document.querySelector('[data-search-page]');

  if (searchPage) {
    var params = new URLSearchParams(window.location.search);
    var keywordInput = document.getElementById('search-keyword');
    var regionFilter = document.getElementById('region-filter');
    var typeFilter = document.getElementById('type-filter');
    var yearFilter = document.getElementById('year-filter');
    var clearButton = document.getElementById('clear-filter');
    var resultText = document.getElementById('search-result-text');
    var emptyState = document.getElementById('empty-state');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));

    keywordInput.value = params.get('q') || '';
    regionFilter.value = params.get('region') || '';
    typeFilter.value = params.get('type') || '';
    yearFilter.value = params.get('year') || '';

    function typeMatches(cardType, value) {
      if (!value) {
        return true;
      }
      return cardType.indexOf(value) !== -1;
    }

    function yearMatches(cardYear, value) {
      if (!value) {
        return true;
      }
      if (value === 'older') {
        var numeric = parseInt(cardYear, 10);
        return !numeric || numeric < 2019;
      }
      return cardYear === value;
    }

    function applyFilters() {
      var keyword = keywordInput.value.trim().toLowerCase();
      var region = regionFilter.value;
      var type = typeFilter.value;
      var year = yearFilter.value;
      var visible = 0;

      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchesRegion = !region || card.getAttribute('data-region-group') === region;
        var matchesType = typeMatches(card.getAttribute('data-type') || '', type);
        var matchesYear = yearMatches(card.getAttribute('data-year') || '', year);
        var show = matchesKeyword && matchesRegion && matchesType && matchesYear;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });

      resultText.textContent = '匹配结果：' + visible + ' 部';
      emptyState.hidden = visible !== 0;
    }

    [keywordInput, regionFilter, typeFilter, yearFilter].forEach(function (element) {
      element.addEventListener('input', applyFilters);
      element.addEventListener('change', applyFilters);
    });

    clearButton.addEventListener('click', function () {
      keywordInput.value = '';
      regionFilter.value = '';
      typeFilter.value = '';
      yearFilter.value = '';
      applyFilters();
    });

    applyFilters();
  }
})();
