import React from 'react';

import { useLingui } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import Icon from '@mui/icons-material/Apple';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import * as S from '../../Sources/AVFoundation';
import Select from '../../../../misc/Select';

function initSettings(initialSettings) {
	const settings = {
		...S.func.initSettings(initialSettings),
		format: 'nv12',
		framerate: 25,
		size: 'auto',
	};

	return settings;
}

function Source(props) {
	const { i18n } = useLingui();
	const settings = initSettings(props.settings);

	const handleChange = (newSettings) => {
		newSettings = newSettings || settings;

		props.onChange(S.id, newSettings, S.func.createInputs(newSettings), true);
	};

	const update = (what) => (event) => {
		const value = event.target.value;
		const newSettings = settings;

		if (what in newSettings) {
			newSettings[what] = value;
		}

		handleChange(newSettings);
	};

	React.useEffect(() => {
		handleChange();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let filteredDevices = props.knownDevices.filter((device) => device.media === 'video');
	let options = filteredDevices.map((device) => {
		return (
			<MenuItem key={device.id} value={device.id}>
				{device.name}
			</MenuItem>
		);
	});

	options.unshift(
		<MenuItem key="default" value="default">
			{i18n._(t`Default`)}
		</MenuItem>
	);

	const videoDevices = (
		<Select label={<Trans>Video device</Trans>} value={settings.vindex} onChange={update('vindex')}>
			{options}
		</Select>
	);

	filteredDevices = props.knownDevices.filter((device) => device.media === 'audio');
	options = filteredDevices.map((device) => {
		return (
			<MenuItem key={device.id} value={device.id}>
				{device.name}
			</MenuItem>
		);
	});

	options.unshift(
		<MenuItem key="none" value="none">
			{i18n._(t`None`)}
		</MenuItem>
	);
	options.unshift(
		<MenuItem key="default" value="default">
			{i18n._(t`Default`)}
		</MenuItem>
	);

	const audioDevices = (
		<Select label={<Trans>Audio Device</Trans>} value={settings.aindex} onChange={update('aindex')}>
			{options}
		</Select>
	);

	return (
		<React.Fragment>
			<Grid item xs={12}>
				<Typography>
					<Trans>Select a device:</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Grid container alignItems="center" spacing={1}>
					<Grid item xs={12}>
						{videoDevices}
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Grid container alignItems="center" spacing={1}>
					<Grid item xs={12}>
						{audioDevices}
					</Grid>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

Source.defaultProps = {
	knownDevices: [],
	settings: {},
	onChange: function (type, settings, inputs, ready) {},
};

function SourceIcon(props) {
	return <Icon style={{ color: '#FFF' }} {...props} />;
}

const id = 'avfoundation';
const type = 'avfoundation';
const name = <Trans>Connected device</Trans>;
const capabilities = ['audio', 'video'];

export { id, type, name, capabilities, SourceIcon as icon, Source as component };
