import React from 'react';

import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { Trans } from '@lingui/macro';

import Select from '../../../Select';
import Video from '../../settings/Video';

function init(initialState) {
	const state = {
		bitrate: '4096',
		fps: '25',
		gop: '2',
		profile: '77',
		rc_mode: '1',
		quality: '-1',
		...initialState,
	};

	return state;
}

function createMapping(settings) {
	const mapping = [
		'-vaapi_device',
		'/dev/dri/renderD128',
		'-vf',
		'format=nv12,hwupload',
		'-codec:v',
		'h264_vaapi',
		'-profile:v',
		`${settings.profile}`,
		'-quality',
		`${settings.quality}`,
		'-b:v',
		`${settings.bitrate}k`,
		'-maxrate',
		`${settings.bitrate}k`,
		'-bufsize',
		`${settings.bitrate}k`,
		'-r',
		`${settings.fps}`,
		'-g',
		`${settings.gop}`,
		'-vsync',
		'1',
	];

	if (settings.gop !== 'auto') {
		mapping.push('-g', `${Math.round(parseInt(settings.fps) * parseInt(settings.gop)).toFixed(0)}`);
	}

	return mapping;
}

function RateControl(props) {
	return (
		<Select label={<Trans>Rate control</Trans>} value={props.value} onChange={props.onChange}>
			<MenuItem value="0">auto</MenuItem>
			<MenuItem value="1">Constant-quality</MenuItem>
			<MenuItem value="2">Constant-bitrate</MenuItem>
			<MenuItem value="3">Variable-bitrate</MenuItem>
			<MenuItem value="4">Intelligent constant-quality</MenuItem>
			<MenuItem value="5">Quality-defined variable-bitrate</MenuItem>
			<MenuItem value="6">Average variable-bitrate</MenuItem>
		</Select>
	);
}

RateControl.defaultProps = {
	value: '',
	onChange: function (event) {},
};

function Profile(props) {
	return (
		<Select label={<Trans>Profile</Trans>} value={props.value} onChange={props.onChange}>
			<MenuItem value="578">baseline (constrained)</MenuItem>
			<MenuItem value="77">main</MenuItem>
			<MenuItem value="100">high</MenuItem>
		</Select>
	);
}

Profile.defaultProps = {
	value: '',
	onChange: function (event) {},
};

function Coder(props) {
	const settings = init(props.settings);

	const handleChange = (newSettings) => {
		let automatic = false;
		if (!newSettings) {
			newSettings = settings;
			automatic = true;
		}

		props.onChange(newSettings, createMapping(newSettings), automatic);
	};

	const update = (what) => (event) => {
		const newSettings = {
			...settings,
			[what]: event.target.value,
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
				<RateControl value={settings.rc_mode} onChange={update('rc_mode')} />
			</Grid>
			<Grid item xs={12} md={6}>
				<Video.Bitrate value={settings.bitrate} onChange={update('bitrate')} allowCustom />
			</Grid>
			<Grid item xs={12} md={6}>
				<Video.Framerate value={settings.fps} onChange={update('fps')} allowCustom />
			</Grid>
			<Grid item xs={12} md={6}>
				<Video.GOP value={settings.gop} onChange={update('gop')} allowAuto allowCustom />
			</Grid>
			<Grid item xs={6}>
				<TextField variant="outlined" fullWidth label={<Trans>Quality</Trans>} type="number" value={settings.quality} onChange={update('quality')} />
			</Grid>
			<Grid item xs={6}>
				<Profile value={settings.profile} onChange={update('profile')} />
			</Grid>
		</Grid>
	);
}

Coder.defaultProps = {
	stream: {},
	settings: {},
	onChange: function (settings, mapping) {},
};

const coder = 'h264_vaapi';
const name = 'H.264 (Intel VAAPI)';
const codec = 'h264';
const type = 'video';
const hwaccel = true;

function summarize(settings) {
	return `${name}, ${settings.bitrate} kbit/s, ${settings.fps} FPS, Profile: ${settings.profile}`;
}

function defaults() {
	const settings = init({});

	return {
		settings: settings,
		mapping: createMapping(settings),
	};
}

export { coder, name, codec, type, hwaccel, summarize, defaults, Coder as component };
