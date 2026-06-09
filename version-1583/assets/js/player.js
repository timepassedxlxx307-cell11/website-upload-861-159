(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        document.querySelectorAll('.video-player').forEach(function (player) {
            var video = player.querySelector('video');
            var button = player.querySelector('[data-play]');
            var stream = player.getAttribute('data-stream');
            var attached = false;
            var attaching = false;
            var hls = null;

            function setPlaying(value) {
                player.classList.toggle('is-playing', value);
            }

            function attachStream() {
                return new Promise(function (resolve, reject) {
                    if (!video || !stream) {
                        reject(new Error('empty'));
                        return;
                    }
                    if (attached) {
                        resolve();
                        return;
                    }
                    if (attaching) {
                        var wait = function () {
                            if (attached) {
                                video.removeEventListener('loadedmetadata', wait);
                                resolve();
                            }
                        };
                        video.addEventListener('loadedmetadata', wait);
                        return;
                    }
                    attaching = true;
                    if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = stream;
                        video.addEventListener('loadedmetadata', function () {
                            attached = true;
                            attaching = false;
                            resolve();
                        }, { once: true });
                        video.addEventListener('error', function () {
                            attaching = false;
                            reject(new Error('native'));
                        }, { once: true });
                        video.load();
                        return;
                    }
                    if (window.Hls && window.Hls.isSupported()) {
                        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                        hls.loadSource(stream);
                        hls.attachMedia(video);
                        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                            attached = true;
                            attaching = false;
                            resolve();
                        });
                        hls.on(window.Hls.Events.ERROR, function (event, data) {
                            if (data && data.fatal) {
                                attaching = false;
                                reject(new Error('hls'));
                            }
                        });
                        return;
                    }
                    reject(new Error('unsupported'));
                });
            }

            function playVideo() {
                attachStream().then(function () {
                    return video.play();
                }).then(function () {
                    setPlaying(true);
                }).catch(function () {
                    setPlaying(false);
                });
            }

            if (button) {
                button.addEventListener('click', function () {
                    playVideo();
                });
            }

            if (video) {
                video.addEventListener('click', function () {
                    if (video.paused) {
                        playVideo();
                    }
                });
                video.addEventListener('play', function () {
                    setPlaying(true);
                });
                video.addEventListener('pause', function () {
                    setPlaying(false);
                });
                video.addEventListener('ended', function () {
                    setPlaying(false);
                });
            }

            window.addEventListener('beforeunload', function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    });
}());
