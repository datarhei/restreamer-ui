import React from 'react';

import Clappr from './clappr';
import VideoJS from './videojs';

export default function Player(props) {
	const type = props.type ? props.type : 'clappr';

	if (type === 'videojs-internal' || type === 'videojs-public') {
		const config = {
			controls: props.controls,
			poster: props.poster,
			autoplay: type === 'videojs-internal' ? true : props.autoplay ? (props.mute === 'muted' ? true : false) : false,
			muted: type === 'videojs-internal' ? 'muted' : props.mute,
			liveui: true,
			responsive: true,
			fluid: true,
			plugins: {
				reloadSourceOnError: {}
			},
			sources: [{ src: props.source, type: 'application/x-mpegURL' }],
		};

		return (
			<VideoJS
				type={type}
				options={config}
				onReady={(player) => {
					if (props.logo.image.length !== 0) {
						var overlay = null;

						var imgTag = new Image();
						imgTag.onLoad = function () {
							imgTag.setAttribute('width', this.width);
							imgTag.setAttribute('height'.this.height);
						};
						imgTag.src = props.logo.image + '?' + Math.random();

						if (props.logo.link.length !== 0) {
							var aTag = document.createElement('a');
							aTag.setAttribute('href', props.logo.link);
							aTag.setAttribute('target', '_blank');
							aTag.appendChild(imgTag);
							overlay = aTag.outerHTML;
						} else {
							overlay = imgTag.outerHTML;
						}

						player.overlay({
							align: props.logo.position,
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

					if (props.autoplay === true) {
						// https://videojs.com/blog/autoplay-best-practices-with-video-js/
						const p = player.play();

						if (!p) {
							// no autoplay;
						} else {
							p.then(
								() => {
									// autoplay worked;
								},
								() => {
									// autoplay did not work
								}
							);
						}
					}
				}}
			/>
		);
	} else {
		const config = {
			poster: props.poster,
			autoPlay: props.autoplay,
			mute: props.mute,
			disableCanAutoPlay: true,
			playback: {
				playInline: true,
				hlsjsConfig: {
					enableWorker: false,
				},
			},
			chromeless: !props.controls,
			height: '100%',
			width: '100%',
			mediacontrol: {
				seekbar: props.colors.seekbar,
				buttons: props.colors.buttons,
			},
		};

		if (props.logo.image.length !== 0) {
			config.watermark = props.logo.image + '?' + Math.random();
			config.position = props.logo.position;

			if (props.logo.link.length !== 0) {
				config.watermarkLink = props.logo.link;
			}
		}

		if (props.ga.account.length !== 0) {
			config.gaAccount = props.ga.account;

			if (props.ga.name.length !== 0) {
				config.gaTrackerName = props.ga.name;
			}
		}

		if (props.statistics === true) {
			config.plugins.push('ClapprStats', 'clapprNerdStats');
			config.clapprStats = {
				runEach: 1000,
				onReport: (metrics) => {},
			};
			config.clapprNerdStats = {
				shortcut: ['command+shift+s', 'ctrl+shift+s'],
				iconPosition: 'top-right',
			};
		}

		return <Clappr source={props.source} config={config} />;
	}
}

Player.defaultProps = {
	type: 'videojs-internal',
	source: '',
	poster: '',
	controls: false,
	autoplay: false,
	mute: false,
	logo: {
		image: '',
		position: 'top-right',
		link: '',
	},
	ga: {
		account: '',
		name: '',
	},
	colors: {
		seekbar: '#fff',
		buttons: '#fff',
	},
	statistics: false,
};
