import React from 'react';

import { Trans } from '@lingui/macro';
import makeStyles from '@mui/styles/makeStyles';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Icon from '@mui/icons-material/Cached';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import CircularProgress from '../../../misc/CircularProgress';
import Dialog from '../../../misc/modals/Dialog';
import Filesize from '../../../misc/Filesize';
import FormInlineButton from '../../../misc/FormInlineButton';
import UploadButton from '../../../misc/UploadButton';

const imageTypes = [
	{ mimetype: 'image/*', extension: 'image', maxSize: 0 },
	{ mimetype: 'video/*', extension: 'video', maxSize: 0 },
];

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
		address: '',
		mimetype: '',
		...initialSettings,
	};

	return settings;
};

const createInputs = (settings) => {
	const address = '{diskfs}' + settings.address;
	const input = {
		address: address,
		options: [],
	};

	if (settings.mimetype.startsWith('image/')) {
		input.options.push('-framerate', '1');
		input.options.push('-loop', '1');
	} else {
		input.options.push('-stream_loop', '-1');
	}
	input.options.push('-re');

	return [input];
};

function Source({
	knownDevices = [],
	settings = {},
	onChange = function (settings) {},
	onProbe = function (settings, inputs) {},
	onRefresh = function () {},
	onStore = function (name, data) {
		return '';
	},
}) {
	const classes = useStyles();
	settings = initSettings(settings);

	const [$progress, setProgress] = React.useState({
		enable: false,
		value: -1,
	});
	const [$error, setError] = React.useState({
		open: false,
		title: '',
		message: '',
	});

	const handleFileUpload = async (data, extension, mimetype) => {
		const path = await onStore('videoloop.source', data, (computable, progress, total) => {
			setProgress((current) => {
				return {
					...current,
					enable: true,
					value: computable ? progress * 100 : -1,
				};
			});
		});

		onChange({
			...settings,
			address: path,
			mimetype: mimetype,
		});

		setProgress({
			...$progress,
			enable: false,
		});
	};

	const handleUploadStart = () => {
		setProgress({
			...$progress,
			enable: true,
		});
	};

	const handleUploadError = (title) => (err) => {
		let message = null;

		switch (err.type) {
			case 'nofiles':
				message = <Trans>Please select a file to upload.</Trans>;
				break;
			case 'mimetype':
				message = (
					<Trans>
						The selected file type ({err.actual}) is not allowed. Allowed file types are {err.allowed.join(', ')}
					</Trans>
				);
				break;
			case 'size':
				message = (
					<Trans>
						The selected file is too big (<Filesize bytes={err.actual} />
						). Only <Filesize bytes={err.allowed} /> are allowed.
					</Trans>
				);
				break;
			case 'read':
				message = <Trans>There was an error during upload: {err.message}</Trans>;
				break;
			default:
				message = <Trans>Unknown upload error</Trans>;
		}

		setProgress({
			...$progress,
			enable: false,
		});

		showUploadError(title, message);
	};

	const showUploadError = (title, message) => {
		setError({
			...$error,
			open: true,
			title: title,
			message: message,
		});
	};

	const hideUploadError = () => {
		setError({
			...$error,
			open: false,
		});
	};

	const handleProbe = () => {
		onProbe(settings, createInputs(settings));
	};

	return (
		<React.Fragment>
			<Grid container alignItems="flex-start" spacing={2} className={classes.gridContainer}>
				<Grid item xs={12}>
					<Typography variant="caption">
						<Trans>Upload an image or video file ({imageTypes.map((t) => t.mimetype).join(', ')}) in order to loop it.</Trans>
					</Typography>
				</Grid>
				<Grid item xs={12} md={9}>
					<TextField variant="outlined" fullWidth label={<Trans>File path</Trans>} value={settings.address} readOnly />
				</Grid>
				<Grid item xs={12} md={3}>
					<UploadButton
						label={<Trans>Upload</Trans>}
						acceptTypes={imageTypes}
						onStart={handleUploadStart}
						onError={handleUploadError(<Trans>Uploading the file failed</Trans>)}
						onUpload={handleFileUpload}
					/>
				</Grid>
				<Grid item xs={12}>
					<FormInlineButton onClick={handleProbe} disabled={!settings.address.length}>
						<Trans>Probe</Trans>
					</FormInlineButton>
				</Grid>
			</Grid>
			<Backdrop open={$progress.enable}>
				<CircularProgress color="inherit" value={$progress.value} />
			</Backdrop>
			<Dialog
				open={$error.open}
				title={$error.title}
				onClose={hideUploadError}
				buttonsRight={
					<Button variant="outlined" color="primary" onClick={hideUploadError}>
						<Trans>OK</Trans>
					</Button>
				}
			>
				<Typography variant="body1">{$error.message}</Typography>
			</Dialog>
		</React.Fragment>
	);
}

function SourceIcon(props) {
	return <Icon style={{ color: '#FFF' }} {...props} />;
}

const id = 'videoloop';
const name = <Trans>Loop</Trans>;
const capabilities = ['video'];
const ffversion = '^4.1.0 || ^5.0.0 || ^6.1.0 || ^7.0.0';

const func = {
	initSettings,
	createInputs,
};

export { id, name, capabilities, ffversion, SourceIcon as icon, Source as component, func };
