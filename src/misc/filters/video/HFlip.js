import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';

import Checkbox from '../../Checkbox';

// HFlip Filter
// http://ffmpeg.org/ffmpeg-all.html#hflip

function init(initialState) {
	const state = {
		value: false,
		...initialState,
	};

	return state;
}

function createMapping(settings) {
	const mapping = [];

	if (settings.value) {
		mapping.push('hflip');
	}

	return mapping;
}

function HFlip(props) {
	return (
		<Checkbox label={<Trans>Horizontal Flip</Trans>} checked={props.value} onChange={props.onChange} />
	);
}

HFlip.defaultProps = {
	value: '',
	onChange: function (event) {},
};

function Filter(props) {
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
		};
		if (['value'].includes(what)) {
			newSettings[what] = !settings.value;
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
		<Grid item>
			<HFlip value={settings.value} onChange={update('value')} allowCustom />
		</Grid>
	);
}

Filter.defaultProps = {
	settings: {},
	onChange: function (settings, mapping) {},
};

const filter = 'hflip';
const name = 'Horizonal Flip';
const type = 'video';
const hwaccel = false;

function summarize(settings) {
	return `${name}`;
}

function defaults() {
	const settings = init({});

	return {
		settings: settings,
		mapping: createMapping(settings),
	};
}

export { name, filter, type, hwaccel, summarize, defaults, Filter as component };
