import { H as Hls } from './hls-vendor.js';

(function () {
  var players = document.querySelectorAll('[data-player]');

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-player-button]');
    var overlay = player.querySelector('[data-player-overlay]');
    var errorBox = player.querySelector('[data-player-error]');
    var source = video ? video.getAttribute('data-video-url') : '';
    var loaded = false;
    var hlsInstance = null;

    function showError(message) {
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.hidden = false;
      }
    }

    function hideError() {
      if (errorBox) {
        errorBox.textContent = '';
        errorBox.hidden = true;
      }
    }

    function loadSource() {
      if (!video || loaded || !source) {
        return;
      }

      loaded = true;
      hideError();

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showError('视频暂时无法播放');
          }
        });
        return;
      }

      showError('视频暂时无法播放');
    }

    function startPlayback() {
      if (!video) {
        return;
      }

      loadSource();

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        startPlayback();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayback();
        } else {
          video.pause();
        }
      });

      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
