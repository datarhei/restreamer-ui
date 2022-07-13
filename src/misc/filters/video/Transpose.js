import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import Select from '../../Select';

// Transpose Filter
// http://ffmpeg.org/ffmpeg-all.html#transpose-1

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
		if (settings.value === 3) {
			mapping.push('transpose=2', 'transpose=2');
		} else {
			mapping.push(`transpose=${settings.value}`);
		}
	}

	return mapping;
}

// filter
function Rotate(props) {
	return (
		<Select label={<Trans>Rotate</Trans>} value={props.value} onChange={props.onChange}>
			<MenuItem value={false}>None</MenuItem>
			<MenuItem value={1}>90°</MenuItem>
			<MenuItem value={3}>180°</MenuItem>
			<MenuItem value={2}>270°</MenuItem>
		</Select>
	);
}

Rotate.defaultProps = {
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
			[what]: event.target.value,
		};

		handleChange(newSettings);
	};

	React.useEffect(() => {
		handleChange(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Grid item xs={12}>
			<Rotate value={settings.value} onChange={update('value')} allowCustom />
		</Grid>
	);
}

Filter.defaultProps = {
	settings: {},
	onChange: function (settings, mapping) {},
};

const filter = 'transpose';
const name = 'Filter (transpose)';
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
