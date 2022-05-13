import React from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Sources from './Sources';

function initConfig(initialConfig) {
	let config = {};

	for (let s of Sources.List()) {
		config[s.id] = {};
	}

	config = {
		...config,
		...initialConfig,
	};

	return config;
}

function init(source) {
	const settings = {};

	for (let id of Sources.IDs()) {
		settings[id] = {};
	}

	settings[source.type] = source.settings;

	return settings;
}

function reducer(settings, data) {
	const newSettings = {
		...settings,
		...data,
	};

	return newSettings;
}

export default function SourceSelect(props) {
	// $source holds the currently selected device. It is initialized with the
	// last stored source.
	const [$source, setSource] = React.useState(props.source.type);

	// $settings is for storing the settings of the different devices, such that if
	// the user switches between them, they can be restored. It takes the last
	// stored source settings as initial value.
	const [$settings, setSettings] = React.useReducer(reducer, props.source, init);

	const config = initConfig(props.config);

	const handleSource = (source) => {
		props.onChange(props.type);
		setSource(source);

		props.onSelect(props.type, source);
	};

	const handleProbe = async (settings, inputs) => {
		await props.onProbe(props.type, $source, settings, inputs);
	};

	const handleChange = (source) => (settings) => {
		setSettings({
			...$settings,
			[source]: settings,
		});

		props.onChange(props.type, source, settings);
	};

	let sourceControl = null;

	const s = Sources.Get($source);
	if (s !== null) {
		const Component = s.component;

		sourceControl = (
			<Component
				knownDevices={props.skills.sources[$source]}
				skills={props.skills}
				config={config[$source]}
				settings={$settings[$source]}
				onChange={handleChange($source)}
				onProbe={handleProbe}
			/>
		);
	}

	return (
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<Select type={props.type} selected={$source} availableSources={props.skills.sources} onSelect={handleSource} />
			</Grid>
			<Grid item xs={12}>
				{sourceControl}
			</Grid>
		</Grid>
	);
}

SourceSelect.defaultProps = {
	type: '',
	skills: {},
	source: {},
	config: {},
	onProbe: function (type, device, settings, inputs) {},
	onSelect: function (type, device) {},
	onChange: function (type, device, settings) {},
};

function Select(props) {
	const handleSource = (source) => () => {
		props.onSelect(source);
	};

	let availableSources = [];

	for (let s of Sources.List()) {
		if (!(s.id in props.availableSources)) {
			continue;
		}

		if (!s.capabilities.includes(props.type)) {
			continue;
		}

		const variant = s.id === props.selected ? 'bigSelected' : 'big';
		const Icon = s.icon;

		availableSources.push(
			<Grid item xs={6} md={4} align="center" key={s.id}>
				<Button variant={variant} onClick={handleSource(s.id)}>
					<div>
						<Icon />
						<Typography>{s.name}</Typography>
					</div>
				</Button>
			</Grid>
		);
	}

	return (
		<Grid container spacing={1}>
			{availableSources}
		</Grid>
	);
}

Select.defaultProps = {
	type: '',
	selected: '',
	availableSources: {},
	onSelect: function (source) {},
};
