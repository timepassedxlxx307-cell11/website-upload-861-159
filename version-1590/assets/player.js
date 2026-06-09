(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        var boxes = document.querySelectorAll('[data-player]');
        boxes.forEach(function (box) {
            var video = box.querySelector('video');
            var shade = box.querySelector('.player-shade');
            var start = box.querySelector('.player-start');
            var playToggle = box.querySelector('.play-toggle');
            var muteToggle = box.querySelector('.mute-toggle');
            var fullToggle = box.querySelector('.full-toggle');
            var loaded = false;
            var hls = null;
            var url = video ? video.getAttribute('data-url') : '';

            function load() {
                if (!video || loaded || !url) {
                    return;
                }
                loaded = true;
                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else {
                    video.src = url;
                }
            }

            function begin() {
                load();
                if (!video) {
                    return;
                }
                var promise = video.play();
                if (promise && promise.catch) {
                    promise.catch(function () {});
                }
            }

            function update() {
                if (shade) {
                    shade.classList.toggle('hidden', !video.paused);
                }
                if (playToggle) {
                    playToggle.textContent = video.paused ? '▶' : 'Ⅱ';
                }
                if (muteToggle) {
                    muteToggle.textContent = video.muted ? '静' : '声';
                }
            }

            if (start) {
                start.addEventListener('click', begin);
            }
            if (shade) {
                shade.addEventListener('click', begin);
            }
            if (playToggle) {
                playToggle.addEventListener('click', function () {
                    if (!loaded || video.paused) {
                        begin();
                    } else {
                        video.pause();
                    }
                });
            }
            if (muteToggle) {
                muteToggle.addEventListener('click', function () {
                    if (video) {
                        video.muted = !video.muted;
                        update();
                    }
                });
            }
            if (fullToggle) {
                fullToggle.addEventListener('click', function () {
                    if (!box) {
                        return;
                    }
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else if (box.requestFullscreen) {
                        box.requestFullscreen();
                    }
                });
            }
            if (video) {
                video.addEventListener('click', function () {
                    if (video.paused) {
                        begin();
                    } else {
                        video.pause();
                    }
                });
                video.addEventListener('play', update);
                video.addEventListener('pause', update);
                video.addEventListener('volumechange', update);
                video.addEventListener('ended', update);
                window.addEventListener('pagehide', function () {
                    if (hls) {
                        hls.destroy();
                    }
                });
                update();
            }
        });
    });
})();
