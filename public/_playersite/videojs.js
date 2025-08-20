var config = {
	controls: true,
	poster: playerConfig.poster + '?t=' + String(new Date().getTime()),
	autoplay: autoplay ? 'muted' : false,
	muted: true,
	liveui: true,
	responsive: true,
	fluid: true,
	// Needed to append the url origin in order for the source to properly pass to the cast device
	sources: [{ src: window.location.origin + '/' + playerConfig.source, type: 'application/x-mpegURL' }],
	plugins: {},
};

if (chromecast) {
	config.techOrder = ['chromecast', 'html5'];
	config.plugins.chromecast = {
		// Provide a default reciever application ID
		receiverApplicationId: 'CC1AD845',
	};
}

var player = videojs('player', config);

player.ready(function () {
	if (chromecast) {
		player.chromecast();
	}

	if (airplay) {
		player.airPlay();
	}

	player.license(playerConfig.license);

	var overlays = [];

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

		overlays.push({
			showBackground: false,
			content: overlay,
			start: 'playing',
			end: 'pause',
			align: playerConfig.logo.position,
		});
	}

	if (playerConfig.logo2.image.length != 0) {
		var overlay2 = null;

		var imgTag2 = new Image();
		imgTag2.onLoad = function () {
			imgTag2.setAttribute('width', this.width);
			imgTag2.setAttribute('height'.this.height);
		};
		imgTag2.src = playerConfig.logo2.image + '?' + Math.random();

		if (playerConfig.logo2.link.length !== 0) {
			var aTag2 = document.createElement('a');
			aTag2.setAttribute('href', playerConfig.logo2.link);
			aTag2.setAttribute('target', '_blank');
			aTag2.appendChild(imgTag2);
			overlay2 = aTag2.outerHTML;
		} else {
			overlay2 = imgTag2.outerHTML;
		}

		overlays.push({
			showBackground: false,
			content: overlay2,
			start: 'playing',
			end: 'pause',
			align: playerConfig.logo2.position,
		});
	}

	// Apply overlays after setup
	setTimeout(function() {
		if (overlays.length > 0) {
			player.overlay({
				overlays: overlays,
			});
		}
	}, 100);

	if (autoplay === true) {
		// https://videojs.com/blog/autoplay-best-practices-with-video-js/
		player.play();
	}
});
