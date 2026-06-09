(function () {
  function bindMoviePlayer(source) {
    var video = document.querySelector('#movie-player');
    var layer = document.querySelector('.play-layer');
    var hls = null;

    if (!video || !layer || !source) {
      return;
    }

    function revealLayer() {
      layer.classList.remove('is-hidden');
    }

    function playVideo() {
      var request = video.play();
      if (request && typeof request.catch === 'function') {
        request.catch(revealLayer);
      }
    }

    function start() {
      layer.classList.add('is-hidden');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (video.src !== source) {
          video.src = source;
        }
        playVideo();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        if (!hls) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              revealLayer();
            }
          });
        } else {
          playVideo();
        }
        return;
      }

      video.src = source;
      playVideo();
    }

    layer.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
  }

  window.bindMoviePlayer = bindMoviePlayer;
})();
