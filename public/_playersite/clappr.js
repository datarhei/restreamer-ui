var plugins = [];

if (statistics == true) {
	plugins.push(ClapprNerdStats);
	plugins.push(ClapprStats);
}

var config = {
	source: playerConfig.source,
	parentId: '#player',
	baseUrl: 'clappr/',
	persistConfig: false,
	plugins: plugins,
	poster: playerConfig.poster + '?t=' + String(new Date().getTime()),
	mediacontrol: {
		seekbar: playerConfig.color.seekbar,
		buttons: color,
	},
	height: '100%',
	width: '100%',
	disableCanAutoPlay: true,
	autoPlay: autoplay,
	mimeType: 'application/vnd.apple.mpegurl',
	actualLiveTime: false,
	exitFullscreenOnEnd: false,
	mute: mute,
	playback: {
		controls: false,
		playInline: true,
		recycleVideo: Clappr.Browser.isMobile,
		hlsjsConfig: {
			enableWorker: false,
			capLevelToPlayerSize: true,
			capLevelOnFPSDrop: true,
			maxBufferHole: 1,
			highBufferWatchdogPeriod: 1,
		},
	},
	hlsPlayback: {
		preload: false,
	},
	visibilityEnableIcon: false,
	clapprStats: {
		runEach: 1000,
		onReport: (metrics) => {},
	},
	clapprNerdStats: {
		shortcut: ['command+shift+s', 'ctrl+shift+s'],
		iconPosition: 'top-right',
	},
};

if (playerConfig.logo.image.length != 0) {
	config.watermark = playerConfig.logo.image;
	config.position = playerConfig.logo.position;

	if (playerConfig.logo.link.length != 0) {
		config.watermarkLink = playerConfig.logo.link;
	}
}

var player = new window.Clappr.Player(config);
var posterPlugin = player.core.mediaControl.container.getPlugin('poster');
player.on(window.Clappr.Events.PLAYER_STOP, function updatePoster() {
	posterPlugin.options.poster = playerConfig.poster + '?t=' + String(new Date().getTime());
	posterPlugin.render();
});
