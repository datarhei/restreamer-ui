import React from 'react';

import VideoJS from './videojs';

export default function Player({
	type = 'videojs-internal',
	source = '',
	poster = '',
	controls = false,
	autoplay = false,
	mute = false,
	logo = {
		image: '',
		position: 'top-right',
		link: '',
	},
	logo2 = {
		image: '',
		position: 'top-left',
		link: '',
	},
	ga = {
		account: '',
		name: '',
	},
	colors = {
		seekbar: '#fff',
		buttons: '#fff',
	},
	statistics = false,
}) {
	type = type ? type : 'videojs-internal';

	if (type === 'videojs-internal' || type === 'videojs-public') {
		const config = {
			controls: controls,
			poster: poster,
			autoplay: type === 'videojs-internal' ? true : autoplay ? (mute === 'muted' ? true : false) : false,
			muted: type === 'videojs-internal' ? 'muted' : mute,
			liveui: true,
			responsive: true,
			fluid: true,
			plugins: {
				reloadSourceOnError: {},
			},
			sources: [{ src: source, type: 'application/x-mpegURL' }],
		};

		return (
			<VideoJS
				type={type}
				options={config}
				onReady={(player) => {
					const overlays = [];

					if (logo.image.length !== 0) {
						var overlay = null;

						var imgTag = new Image();
						imgTag.onLoad = function () {
							imgTag.setAttribute('width', this.width);
							imgTag.setAttribute('height'.this.height);
						};
						imgTag.src = logo.image + '?' + Math.random();

						if (logo.link.length !== 0) {
							var aTag = document.createElement('a');
							aTag.setAttribute('href', logo.link);
							aTag.setAttribute('target', '_blank');
							aTag.appendChild(imgTag);
							overlay = aTag.outerHTML;
						} else {
							overlay = imgTag.outerHTML;
						}

						overlays.push({
							showBackground: false,
							content: overlay,
							start: 'play',
							end: 'pause',
							align: logo.position,
						});
					}

					if (logo2.image.length !== 0) {
						var overlay2 = null;

						var imgTag2 = new Image();
						imgTag2.onLoad = function () {
							imgTag2.setAttribute('width', this.width);
							imgTag2.setAttribute('height'.this.height);
						};
						imgTag2.src = logo2.image + '?' + Math.random();

						if (logo2.link.length !== 0) {
							var aTag2 = document.createElement('a');
							aTag2.setAttribute('href', logo2.link);
							aTag2.setAttribute('target', '_blank');
							aTag2.appendChild(imgTag2);
							overlay2 = aTag2.outerHTML;
						} else {
							overlay2 = imgTag2.outerHTML;
						}

						overlays.push({
							showBackground: false,
							content: overlay2,
							start: 'play',
							end: 'pause',
							align: logo2.position,
						});
					}

					// Apply overlays after setup
					setTimeout(() => {
						if (overlays.length > 0 && player.overlay) {
							player.overlay({
								overlays: overlays,
							});
						}
					}, 100);

					if (autoplay === true) {
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
								},
							);
						}
					}
				}}
			/>
		);
	}
}
