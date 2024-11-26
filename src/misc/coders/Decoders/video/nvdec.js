import React from 'react';

import Grid from '@mui/material/Grid';

import Helper from '../../helper';
import Video from '../../settings/Video';

function init(initialState) {
	const state = {
		gpu: '0',
		...initialState,
	};

	return state;
}

function createMapping(settings, stream, skills) {
	stream = Helper.InitStream(stream);
	skills = Helper.InitSkills(skills);

	const mapping = {
		global: [],
		local: ['-hwaccel', 'cuda', '-hwaccel_output_format', 'nv12', '-hwaccel_device', `${settings.gpu}`],
		filter: [],
	};

	return mapping;
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
			<Grid item xs={6}>
				<Video.GPU value={settings.gpu} onChange={update('gpu')} />
			</Grid>
			<Grid item xs={12}></Grid>
		</Grid>
	);
}

// -hwaccel cuda -hwaccel_output_format cuda

const coder = 'cuda';
const name = 'NVDEC (CUDA)';
const codecs = ['h264', 'hevc', 'mpeg1', 'mpeg2', 'mpeg4', 'vp8', 'vp9', 'vc1'];
const type = 'video';
const hwaccel = true;

function defaults(stream, skills) {
	const settings = init({});

	return {
		settings: settings,
		mapping: createMapping(settings, stream, skills),
	};
}

export { coder, name, codecs, type, hwaccel, defaults, Coder as component };
