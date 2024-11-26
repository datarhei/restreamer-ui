import React from 'react';

import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import { Trans } from '@lingui/macro';

import Select from '../../../Select';
import Video from '../../settings/Video';
import Helper from '../../helper';

function init(initialState) {
	const state = {
		bitrate: '4096',
		fps: '25',
		gop: '2',
		preset: 'p4',
		tune: 'll',
		level: 'auto',
		rc: 'auto',
		...initialState,
	};

	return state;
}

function createMapping(settings, stream, skills) {
	stream = Helper.InitStream(stream);
	skills = Helper.InitSkills(skills);

	const local = [
		'-codec:v',
		'av1_nvenc',
		'-preset:v',
		`${settings.preset}`,
		'-tune:v',
		`${settings.tune}`,
		'-b:v',
		`${settings.bitrate}k`,
		'-maxrate',
		`${settings.bitrate}k`,
		'-bufsize',
		`${settings.bitrate}k`,
		'-r',
		`${settings.fps}`,
		'-pix_fmt',
		'yuv420p',
	];

	if (settings.gop !== 'auto') {
		local.push('-g', `${Math.round(parseInt(settings.fps) * parseInt(settings.gop)).toFixed(0)}`);
	}

	if (settings.level !== 'auto') {
		local.push('-level:v', `${settings.level}`);
	}

	if (settings.rc !== 'auto') {
		local.push('-rc:v', `${settings.rc}`);
	}

	const mapping = {
		global: [],
		local: local,
		filter: [],
	};

	return mapping;
}

function Preset({ value = '', onChange = function (event) {} }) {
	return (
		<Select label={<Trans>Preset</Trans>} value={value} onChange={onChange}>
			<MenuItem value="medium">HQ 1 pass</MenuItem>
			<MenuItem value="fast">HQ 1 pass</MenuItem>
			<MenuItem value="p1">fastest</MenuItem>
			<MenuItem value="p2">faster</MenuItem>
			<MenuItem value="p3">fast</MenuItem>
			<MenuItem value="p4">medium</MenuItem>
			<MenuItem value="p5">slow</MenuItem>
			<MenuItem value="p6">slower</MenuItem>
			<MenuItem value="p7">slowest</MenuItem>
		</Select>
	);
}

function Tune({ value = '', onChange = function (event) {} }) {
	return (
		<Select label={<Trans>Tune</Trans>} value={value} onChange={onChange}>
			<MenuItem value="hq">High quality</MenuItem>
			<MenuItem value="ll">Low latency</MenuItem>
			<MenuItem value="ull">Ultra low latency</MenuItem>
			<MenuItem value="lossless">Lossless</MenuItem>
		</Select>
	);
}

function Level({ value = '', onChange = function (event) {} }) {
	return (
		<Select label={<Trans>Level</Trans>} value={value} onChange={onChange}>
			<MenuItem value="auto">auto</MenuItem>
			<MenuItem value="2">2</MenuItem>
			<MenuItem value="2.0">2.0</MenuItem>
			<MenuItem value="2.1">2.1</MenuItem>
			<MenuItem value="2.2">2.2</MenuItem>
			<MenuItem value="2.3">2.3</MenuItem>
			<MenuItem value="3">3</MenuItem>
			<MenuItem value="3.0">3.0</MenuItem>
			<MenuItem value="3.1">3.1</MenuItem>
			<MenuItem value="3.2">3.2</MenuItem>
			<MenuItem value="3.3">3.3</MenuItem>
			<MenuItem value="4">4</MenuItem>
			<MenuItem value="4.0">4.0</MenuItem>
			<MenuItem value="4.1">4.1</MenuItem>
			<MenuItem value="4.2">4.2</MenuItem>
			<MenuItem value="4.3">4.3</MenuItem>
			<MenuItem value="5">5</MenuItem>
			<MenuItem value="5.0">5.0</MenuItem>
			<MenuItem value="5.1">5.1</MenuItem>
			<MenuItem value="5.2">5.2</MenuItem>
			<MenuItem value="5.3">5.3</MenuItem>
			<MenuItem value="6">6</MenuItem>
			<MenuItem value="6.0">6.0</MenuItem>
			<MenuItem value="6.1">6.1</MenuItem>
			<MenuItem value="6.2">6.2</MenuItem>
			<MenuItem value="6.3">6.3</MenuItem>
			<MenuItem value="7">7</MenuItem>
			<MenuItem value="7.0">7.0</MenuItem>
			<MenuItem value="7.1">7.1</MenuItem>
			<MenuItem value="7.2">7.2</MenuItem>
			<MenuItem value="7.3">7.3</MenuItem>
		</Select>
	);
}

function RateControl({ value = '', onChange = function (event) {} }) {
	return (
		<Select label={<Trans>Rate control</Trans>} value={value} onChange={onChange}>
			<MenuItem value="auto">auto</MenuItem>
			<MenuItem value="constqp">constqp</MenuItem>
			<MenuItem value="vbr">vbr</MenuItem>
			<MenuItem value="cbr">cbr</MenuItem>
		</Select>
	);
}

function Coder({ stream = {}, settings = {}, skills = {}, onChange = function (settings, mapping) {} }) {
	settings = init(settings);
	stream = Helper.InitStream(stream);
	skills = Helper.InitSkills(skills);

	const handleChange = (newSettings) => {
		let automatic = false;
		if (!newSettings) {
			newSettings = settings;
			automatic = true;
		}

		onChange(newSettings, createMapping(newSettings, stream, skills), automatic);
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
				<Video.Bitrate value={settings.bitrate} onChange={update('bitrate')} allowCustom />
			</Grid>
			<Grid item xs={12}>
				<Video.Framerate value={settings.fps} onChange={update('fps')} allowCustom />
			</Grid>
			<Grid item xs={12}>
				<Video.GOP value={settings.gop} onChange={update('gop')} allowAuto allowCustom />
			</Grid>
			<Grid item xs={6}>
				<Preset value={settings.preset} onChange={update('preset')} />
			</Grid>
			<Grid item xs={6}>
				<Tune value={settings.tune} onChange={update('tune')} />
			</Grid>
			<Grid item xs={6}>
				<Level value={settings.level} onChange={update('level')} />
			</Grid>
			<Grid item xs={6}>
				<RateControl value={settings.rc} onChange={update('rc')} />
			</Grid>
		</Grid>
	);
}

const coder = 'av1_nvenc';
const name = 'AV1 (NVENC)';
const codec = 'av1';
const type = 'video';
const hwaccel = true;

function summarize(settings) {
	return `${name}, ${settings.bitrate} kbit/s, ${settings.fps} FPS, Profile: ${settings.profile}`;
}

function defaults(stream, skills) {
	const settings = init({});

	return {
		settings: settings,
		mapping: createMapping(settings, stream, skills),
	};
}

export { coder, name, codec, type, hwaccel, summarize, defaults, Coder as component };
