import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';

import Video from '../../coders/settings/Video';

// Scale Filter
// https://ffmpeg.org/ffmpeg-all.html#scale-1

function init(initialState) {
	const state = {
		value: 'none',
		...initialState,
	};

	return state;
}

function createGraph(settings) {
	settings = init(settings);

	const mapping = [];

	if (settings.value !== 'none') {
		mapping.push(`scale=-1:${settings.value}`);
	}

	return mapping.join(',');
}

function Filter(props) {
	const settings = init(props.settings);

	const handleChange = (newSettings) => {
		let automatic = false;
		if (!newSettings) {
			newSettings = settings;
			automatic = true;
		}

		props.onChange(newSettings, createGraph(newSettings), automatic);
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
		<React.Fragment>
			<Grid item xs={12}>
				<Video.Height allowNone allowCustom label={<Trans>Scale by height</Trans>} value={settings.value} onChange={update('value')}></Video.Height>
			</Grid>
		</React.Fragment>
	);
}

Filter.defaultProps = {
	settings: {},
	onChange: function (settings, mapping) {},
};

const filter = 'scale';
const name = 'Scale';
const type = 'video';
const hwaccel = false;

function summarize(settings) {
	return `${name} (-1:${settings.value})`;
}

function defaults() {
	const settings = init({});

	return {
		settings: settings,
		graph: createGraph(settings),
	};
}

export { name, filter, type, hwaccel, summarize, defaults, createGraph, Filter as component };
