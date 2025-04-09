import React from 'react';

import Grid from '@mui/material/Grid';
import { Trans } from '@lingui/macro';

import Helper from '../../helper';
import Video from '../../settings/Video';

function init(initialState) {
	const state = {
		gpu: '0',
		resize: 'auto',
		...initialState,
	};

	return state;
}

function createMapping(settings, stream, skills) {
	stream = Helper.InitStream(stream);
	skills = Helper.InitSkills(skills);

	let local = ['-c:v', 'vp9_cuvid', '-gpu', `${settings.gpu}`];

	if (settings.resize !== 'auto') {
		local.push('-resize', `${settings.resize}`);
	}

	const mapping = {
		global: [],
		local: local,
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
				<Video.Size
					value={settings.resize}
					label={<Trans>Resize</Trans>}
					customLabel={<Trans>Custom size</Trans>}
					onChange={update('resize')}
					allowCustom={true}
					allowAuto={true}
				/>
			</Grid>
			<Grid item xs={6}>
				<Video.GPU value={settings.gpu} onChange={update('gpu')} />
			</Grid>
			<Grid item xs={12}></Grid>
		</Grid>
	);
}

const coder = 'vp9_cuvid';
const name = 'VP9 (CUVID)';
const codecs = ['vp9'];
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
