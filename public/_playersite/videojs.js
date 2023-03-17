var config = {
	controls: true,
	poster: playerConfig.poster + '?t=' + String(new Date().getTime()),
	autoplay: autoplay ? 'muted' : false,
	muted: true,
	liveui: true,
	responsive: true,
	fluid: true,
	// Needed to append the url orgin in order for the source to properly pass to the cast device
	sources: [{ src: playerConfig.source, type: 'application/x-mpegURL' }],
	plugins: {
		license: playerConfig.license,
	},
};

if (chromecast) {
	config.techOrder = ['chromecast', 'html5'];
	config.plugins.chromecast = {};
}

if (airplay) {
	config.plugins.airPlay = {};
}

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
