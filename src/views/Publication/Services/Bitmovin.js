import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';

import Logo from './logos/bitmovin.svg';

const id = 'bitmovin';
const name = 'Bitmovin';
const version = '1.0';
const stream_key_link = '';
const description = (
	<Trans>
		Transmit the main source to the Bitmovin cloud encoding service, a powerful tool for live streaming. More details about the settings can be founds{' '}
		<Link color="secondary" target="_blank" href="https://bitmovin.com/docs/encoding/tutorials/create-a-live-encoding-from-an-srt-stream">
			here
		</Link>
		.
	</Trans>
);
const image_copyright = <Trans>Please contact the operator of the service and check what happens.</Trans>;
const author = {
	creator: {
		name: 'datarhei',
		link: 'https://github.com/datarhei',
	},
	maintainer: {
		name: 'datarhei',
		link: 'https://github.com/datarhei',
	},
};
const category = 'platform';
const requires = {
	protocols: ['rtmp'],
	formats: ['flv'],
	codecs: {
		audio: ['aac', 'mp3'],
		video: ['h264'],
	},
};

function ServiceIcon(props) {
	return <img src={Logo} alt="Bitmovin Logo" {...props} />;
}

function init(settings) {
	const initSettings = {
		protocol: 'srt://',
		address: '',
		port: ':2088',
		...settings,
	};

	return initSettings;
}

function Service(props) {
	const settings = init(props.settings);

	const handleChange = (what) => (event) => {
		const value = event.target.value;

		settings.settings[what] = value;

		const output = createOutput(settings);

		props.onChange([output], settings);
	};

	const createOutput = (settings) => {
		const options = ['-strict', '-2', '-f', 'mpegts'];

		const output = {
			address: settings.protocol + settings.ip + settings.port,
			options: options,
		};

		return output;
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={3}>
				<TextField variant="outlined" fullWidth label={<Trans>Protocol</Trans>} value={settings.protocol} readOnly disabled />
			</Grid>
			<Grid item xs={12} md={6}>
				<TextField variant="outlined" fullWidth label={<Trans>IP address</Trans>} value={settings.ip} onChange={handleChange('ip')} />
			</Grid>
			<Grid item xs={12} md={3}>
				<TextField variant="outlined" fullWidth label={<Trans>Port</Trans>} value={settings.port} readOnly disabled />
			</Grid>
		</Grid>
	);
}

Service.defaultProps = {
	settings: {},
	skills: {},
	metadata: {},
	streams: [],
	onChange: function (output, settings) {},
};

export { id, name, version, stream_key_link, description, image_copyright, author, category, requires, ServiceIcon as icon, Service as component };
