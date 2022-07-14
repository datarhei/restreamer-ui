import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';

import Checkbox from '../../Checkbox';

// Loudnorm Filter
// http://ffmpeg.org/ffmpeg-all.html#loudnorm

function init(initialState) {
	const state = {
		enabled: false,
		...initialState,
	};

	return state;
}

function createGraph(settings) {
	const mapping = [];

	if (settings.enabled) {
		mapping.push('loudnorm');
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
		};
		if (['enabled'].includes(what)) {
			newSettings[what] = !settings.enabled;
		} else {
			newSettings[what] = event.target.value;
		}

		handleChange(newSettings);
	};

	React.useEffect(() => {
		handleChange(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<React.Fragment>
			<Grid item>
				<Checkbox label={<Trans>Loudness Normalization</Trans>} checked={settings.enabled} onChange={update('enabled')} />
			</Grid>
		</React.Fragment>
	);
}

Filter.defaultProps = {
	settings: {},
	onChange: function (settings, mapping) {},
};

const filter = 'loudnorm';
const name = 'Loudness Normalization';
const type = 'audio';
const hwaccel = false;

function summarize(settings) {
	return `${name}`;
}

function defaults() {
	const settings = init({});

	return {
		settings: settings,
		graph: createGraph(settings),
	};
}

export { name, filter, type, hwaccel, summarize, defaults, Filter as component };
