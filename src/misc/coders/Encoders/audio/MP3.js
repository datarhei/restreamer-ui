import React from 'react';

import Grid from '@mui/material/Grid';

import Audio from '../../settings/Audio';

function init(initialState) {
	const state = {
		bitrate: '64',
		channels: '2',
		layout: 'stereo',
		sampling: '44100',
		...initialState,
	};

	return state;
}

function createMapping(settings, stream) {
	let sampling = settings.sampling;
	let layout = settings.layout;

	if (sampling === 'inherit') {
		sampling = stream.sampling_hz;
	}

	if (layout === 'inherit') {
		layout = stream.layout;
	}

	// '-qscale:a', '6'
	const local = ['-codec:a', 'libmp3lame', '-b:a', `${settings.bitrate}k`, '-shortest', '-filter:a', `aresample=osr=${sampling}:ocl=${layout}`];

	const mapping = {
		global: [],
		local: local,
	};

	return mapping;
}

function Coder(props) {
	const settings = init(props.settings);
	const stream = props.stream;

	const handleChange = (newSettings) => {
		let automatic = false;
		if (!newSettings) {
			newSettings = settings;
			automatic = true;
		}

		props.onChange(newSettings, createMapping(newSettings, stream), automatic);
	};

	const update = (what) => (event) => {
		const value = event.target.value;

		const newSettings = {
			...settings,
			[what]: value,
		};

		if (what === 'layout') {
			let channels = stream.channels;

			switch (value) {
				case 'mono':
					channels = 1;
					break;
				case 'stereo':
					channels = 2;
					break;
				default:
					break;
			}

			newSettings.channels = channels;
		}

		handleChange(newSettings);
	};

	React.useEffect(() => {
		handleChange(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Audio.Bitrate value={settings.bitrate} onChange={update('bitrate')} allowCustom />
			</Grid>
			<Grid item xs={12}>
				<Audio.Sampling value={settings.sampling} onChange={update('sampling')} allowInherit allowCustom />
			</Grid>
			<Grid item xs={12}>
				<Audio.Layout value={settings.layout} onChange={update('layout')} allowInherit />
			</Grid>
		</Grid>
	);
}

Coder.defaultProps = {
	stream: {},
	settings: {},
	onChange: function (settings, mapping) {},
};

const coder = 'libmp3lame';
const name = 'MP3 (libmp3lame)';
const codec = 'mp3';
const type = 'audio';
const hwaccel = false;

function summarize(settings) {
	return `${name}, ${settings.bitrate} kbit/s, ${settings.layout}, ${settings.sampling}Hz`;
}

function defaults(stream) {
	const settings = init({});

	return {
		settings: settings,
		mapping: createMapping(settings, stream),
	};
}

export { coder, name, codec, type, hwaccel, summarize, defaults, Coder as component };
