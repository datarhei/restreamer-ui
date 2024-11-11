import React from 'react';

import { useLingui } from '@lingui/react';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import { Trans, t } from '@lingui/macro';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import Typography from '@mui/material/Typography';

import FormInlineButton from '../../../misc/FormInlineButton';
import SelectCustom from '../../../misc/SelectCustom';
import Checkbox from '../../../misc/Checkbox';
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
		probesize: 42_000_000, // bytes
		fflags: ['nobuffer'],
		thread_queue_size: 1028,
		size: 'cif',
		framerate: '25',
		device: ':1',
		draw_mouse: false,
		follow_mouse: 'centered',
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

	input.options.push('-thread_queue_size', settings.thread_queue_size);
	input.options.push('-probesize', '' + settings.probesize);
	input.options.push('-fflags', settings.fflags.join(','));
	input.options.push('-f', 'x11grab');
	input.options.push('-video_size', settings.size);
	input.options.push('-framerate', settings.framerate);
	if (settings.follow_mouse) {
		input.options.push('-draw_mouse', '1');
		input.options.push('-follow_mouse', settings.follow_mouse);
	} else {
		input.options.push('-draw_mouse', '0');
	}

	return [input];
};


function FollowMouse({
	value = '',
	allowCustom = false,
	onChange = function (event) {},
}) {
	const { i18n } = useLingui();
	const values = [
		{ value: 'centered', label: 'Centered' },
	];

	values.push({ value: 'custom', label: i18n._(t`Custom ...`) });

	return (
		<SelectCustom
			options={values}
			label={<Trans>Follow mouse</Trans>}
			customLabel={<Trans>Follow mouse</Trans>}
			value={value}
			onChange={onChange}
			variant={'outlined'}
			allowCustom={allowCustom}
		/>
	);
}

function Source({ knownDevices = [], settings = {}, onChange = function (settings) {}, onProbe = function (settings, inputs) {}, onRefresh = function () {} }) {
	const classes = useStyles();
	const { i18n } = useLingui();
	settings = initSettings(settings);

	const handleChange = (what) => (event) => {
		let data = {};

		if (['device', 'framerate', 'size'].includes(what)) {
			data[what] = event.target.value;
		}

		if (['draw_mouse'].includes(what)) {
			data[what] = !settings.draw_mouse;
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
				<Video.Framerate value={settings.framerate} onChange={handleChange('framerate')} allowCustom />
			</Grid>
			<Grid item xs={12}>
				<Video.Size value={settings.size} onChange={handleChange('size')} allowCustom />
			</Grid>
			<Grid item xs={12}>
				<Grid item>
					<Checkbox label={<Trans>Draw mouse</Trans>} checked={settings.draw_mouse} onChange={handleChange('draw_mouse')} />
				</Grid>
			</Grid>
			<Grid item xs={6}>
				{settings.draw_mouse && (
					<Grid item>
						<FollowMouse value={settings.follow_mouse} onChange={handleChange('follow_mouse')} allowCustom />
					</Grid>
				)}
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
	return <ScreenshotMonitorIcon style={{ color: '#FFF' }} {...props} />;
}

const id = 'x11grab';
const name = <Trans>X11-grap</Trans>;
const capabilities = ['video'];
const ffversion = '^4.1.0 || ^5.0.0 || ^6.1.0';

const func = {
	initSettings,
	createInputs,
};

export { id, name, capabilities, ffversion, SourceIcon as icon, Source as component, func };
