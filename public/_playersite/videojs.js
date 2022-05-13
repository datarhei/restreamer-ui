var config = {
	controls: true,
	poster: playerConfig.poster + '?t=' + String(new Date().getTime()),
	autoplay: autoplay ? 'muted' : false,
	muted: mute,
	liveui: true,
	responsive: true,
	fluid: true,
	sources: [{ src: playerConfig.source, type: 'application/x-mpegURL' }],
	plugins: {
		license: playerConfig.license,
	},
};

var player = videojs('player', config);
player.ready(function () {
	if (playerConfig.logo.image.length != 0) {
		var overlay = null;

		var imgTag = new Image();
		imgTag.onLoad = function () {
			imgTag.setAttribute('width', this.width);
			imgTag.setAttribute('height'.this.height);
		};
		imgTag.src = playerConfig.logo.image + '?' + Math.random();

		if (playerConfig.logo.link.length !== 0) {
			var aTag = document.createElement('a');
			aTag.setAttribute('href', playerConfig.logo.link);
			aTag.setAttribute('target', '_blank');
			aTag.appendChild(imgTag);
			overlay = aTag.outerHTML;
		} else {
			overlay = imgTag.outerHTML;
		}

		player.overlay({
			align: playerConfig.logo.position,
			overlays: [
				{
					showBackground: false,
					content: overlay,
					start: 'playing',
					end: 'pause',
				},
			],
		});
	}

	if (autoplay === true) {
		// https://videojs.com/blog/autoplay-best-practices-with-video-js/
		player.play();
	}
});
