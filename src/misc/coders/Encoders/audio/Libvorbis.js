import React from 'react';

import Grid from '@mui/material/Grid';

import Audio from '../../settings/Audio';

function init(initialState) {
	const state = {
		bitrate: '64',
		...initialState,
	};

	return state;
}

function createMapping(settings, stream) {
	const local = ['-codec:a', 'libvorbis', '-b:a', `${settings.bitrate}k`, '-shortest'];

	const mapping = {
		global: [['-vsync', 'drop']],
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
		</Grid>
	);
}

Coder.defaultProps = {
	stream: {},
	settings: {},
	onChange: function (settings, mapping) {},
};

const coder = 'libvorbis';
const name = 'Vorbis (libvorbis)';
const codec = 'vorbis';
const type = 'audio';
const hwaccel = false;

function summarize(settings) {
	return `${name}, ${settings.bitrate} kbit/s`;
}

function defaults(stream) {
	const settings = init({});

	return {
		settings: settings,
		mapping: createMapping(settings, stream),
	};
}

export { coder, name, codec, type, hwaccel, summarize, defaults, Coder as component };
