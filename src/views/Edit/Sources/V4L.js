import React from 'react';

import { faUsb } from '@fortawesome/free-brands-svg-icons';
import { useLingui } from '@lingui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans, t } from '@lingui/macro';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import Typography from '@mui/material/Typography';

import FormInlineButton from '../../../misc/FormInlineButton';
import SelectCustom from '../../../misc/SelectCustom';
import Video from '../../../misc/coders/settings/Video';

const useStyles = makeStyles((theme) => ({
	gridContainer: {
		marginTop: '0.5em',
	},
}));

const initSettings = (initialSettings) => {
	if (!initialSettings) {
		initialSettings = {};
	}

	const settings = {
		device: 'none',
		format: 'nv12',
		framerate: '25',
		size: '1280x720',
		...initialSettings,
	};

	return settings;
};

const createInputs = (settings) => {
	const address = settings.device === 'custom' || settings.device === 'none' ? settings.deviceCustom : settings.device;
	const input = {
		address: address,
		options: [],
	};

	input.options.push('-thread_queue_size', '512');
	input.options.push('-re');
	input.options.push('-r', '' + settings.framerate);
	input.options.push('-f', 'video4linux2');
	input.options.push('-framerate', '' + settings.framerate);
	input.options.push('-video_size', settings.size);
	input.options.push('-input_format', settings.format);

	return [input];
};

function Source({ knownDevices = [], settings = {}, onChange = function (settings) {}, onProbe = function (settings, inputs) {}, onRefresh = function () {} }) {
	const classes = useStyles();
	const { i18n } = useLingui();
	settings = initSettings(settings);

	const handleChange = (what) => (event) => {
		let data = {};

		if (['device', 'format', 'framerate', 'size'].includes(what)) {
			data[what] = event.target.value;
		}

		onChange({
			...settings,
			...data,
		});
	};

	const handleRefresh = () => {
		onRefresh();
	};

	const handleProbe = () => {
		onProbe(settings, createInputs(settings));
	};

	const filteredDevices = knownDevices.filter((device) => device.media === 'video');
	const options = filteredDevices.map((device) => {
		return {
			value: device.id,
			label: device.name + ' (' + device.id + ')',
		};
	});

	options.unshift({
		value: 'none',
		label: i18n._(t`Choose an input device ...`),
		disabled: true,
	});

	options.push({
		value: 'custom',
		label: i18n._(t`Custom ...`),
	});

	return (
		<Grid container alignItems="flex-start" spacing={2} className={classes.gridContainer}>
			<Grid item xs={12}>
				<Typography>
					<Trans>Select a device:</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<SelectCustom
					options={options}
					label={<Trans>Video device</Trans>}
					customLabel={<Trans>Custom video device</Trans>}
					value={settings.device}
					onChange={handleChange('device')}
					variant="outlined"
					allowCustom
				/>
				<Button size="small" startIcon={<RefreshIcon />} onClick={handleRefresh} sx={{ float: 'right' }}>
					<Trans>Refresh</Trans>
				</Button>
			</Grid>
			<Grid item xs={12}>
				<Video.Format value={settings.format} onChange={handleChange('format')} allowCustom />
			</Grid>
			<Grid item xs={12}>
				<Video.Framerate value={settings.framerate} onChange={handleChange('framerate')} allowCustom />
			</Grid>
			<Grid item xs={12}>
				<Video.Size value={settings.size} onChange={handleChange('size')} allowCustom />
			</Grid>
			<Grid item xs={12}>
				<FormInlineButton onClick={handleProbe}>
					<Trans>Probe</Trans>
				</FormInlineButton>
			</Grid>
		</Grid>
	);
}

function SourceIcon(props) {
	return <FontAwesomeIcon icon={faUsb} style={{ color: '#FFF' }} {...props} />;
}

const id = 'video4linux2';
const name = <Trans>Hardware device</Trans>;
const capabilities = ['video'];
const ffversion = '^4.1.0 || ^5.0.0 || ^6.1.0 || ^7.0.0';

const func = {
	initSettings,
	createInputs,
};

export { id, name, capabilities, ffversion, SourceIcon as icon, Source as component, func };
