import React from 'react';

import { Trans } from '@lingui/macro';
import makeStyles from '@mui/styles/makeStyles';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Icon from '@mui/icons-material/Cached';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Dialog from '../../../misc/modals/Dialog';
import Filesize from '../../../misc/Filesize';
import FormInlineButton from '../../../misc/FormInlineButton';
import UploadButton from '../../../misc/UploadButton';

const imageTypes = [
	{ mimetype: 'image/png', extension: 'png', maxSize: 2 * 1024 * 1024 },
	{ mimetype: 'image/jpeg', extension: 'jpg', maxSize: 2 * 1024 * 1024 },
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

	input.options.push('-loop', '1');
	input.options.push('-framerate', '1');
	input.options.push('-re');

	return [input];
};

function Source(props) {
	const classes = useStyles();
	const settings = initSettings(props.settings);
	const [$saving, setSaving] = React.useState(false);
	const [$error, setError] = React.useState({
		open: false,
		title: '',
		message: '',
	});

	const handleChange = (what) => (event) => {
		let data = {};

		data[what] = event.target.value;

		props.onChange({
			...settings,
			...data,
		});
	};

	const handleImageUpload = async (data, extension) => {
		const path = await props.onStore('input.' + extension, data);

		handleChange('address')({
			target: {
				value: path,
			},
		});

		setSaving(false);
	};

	const handleUploadStart = () => {
		setSaving(true);
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
						The selected file type ({err.actual}) is not allowed. Allowed file types are {err.allowed}
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

		setSaving(false);

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
		props.onProbe(settings, createInputs(settings));
	};

	return (
		<React.Fragment>
			<Grid container alignItems="flex-start" spacing={2} className={classes.gridContainer}>
				<Grid item xs={12} md={9}>
					<TextField
						variant="outlined"
						fullWidth
						id="logo-url"
						label={<Trans>Image path</Trans>}
						value={settings.address}
						onChange={handleChange('address')}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<UploadButton
						label={<Trans>Upload</Trans>}
						acceptTypes={imageTypes}
						onStart={handleUploadStart}
						onError={handleUploadError(<Trans>Uploading the image failed</Trans>)}
						onUpload={handleImageUpload}
					/>
				</Grid>
				<Grid item xs={12}>
					<FormInlineButton onClick={handleProbe} disabled={!settings.address.length}>
						<Trans>Probe</Trans>
					</FormInlineButton>
				</Grid>
			</Grid>
			<Backdrop open={$saving}>
				<CircularProgress color="inherit" />
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

Source.defaultProps = {
	knownDevices: [],
	settings: {},
	onChange: function (settings) {},
	onProbe: function (settings, inputs) {},
	onRefresh: function () {},
	onStore: function (name, data) {
		return '';
	},
};

function SourceIcon(props) {
	return <Icon style={{ color: '#FFF' }} {...props} />;
}

const id = 'videoloop';
const name = <Trans>Loop</Trans>;
const capabilities = ['video'];
const ffversion = '^4.1.0 || ^5.0.0';

const func = {
	initSettings,
	createInputs,
};

export { id, name, capabilities, ffversion, SourceIcon as icon, Source as component, func };
