import React from 'react';

import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';

import FormInlineButton from '../../../misc/FormInlineButton';

const id = 'tiktok';
const name = 'TikTok';
const version = '1.0';
const stream_key_link = 'https://livecenter.tiktok.com/producer';
const description = (
	<Trans>
		Transmit your Livestream to an TikTok RTMP service.{' '}
		<Link color="secondary" target="_blank" href="https://livecenter.tiktok.com/producer">
			Here{' '}
		</Link>
		you can find more details about the settings.
	</Trans>
);
const image_copyright = <Trans>Please get in touch with the operator of the service and check what happens.</Trans>;
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
	protocols: ['rtmps'],
	formats: ['flv'],
	codecs: {
		audio: ['aac', 'mp3'],
		video: ['h264'],
	},
};

function ServiceIcon(props) {
	return <FontAwesomeIcon icon={faTiktok} style={{ color: '#FFF' }} {...props} />;
}

function init(settings) {
	const initSettings = {
		server_url: '',
		stream_key: '',
		...settings,
	};

	return initSettings;
}

function Service(props) {
	const settings = init(props.settings);

	const handleChange = (what) => (event) => {
		const value = event.target.value;

		settings[what] = value;

		const output = createOutput(settings);

		props.onChange([output], settings);
	};

	const createOutput = (settings) => {
		const output = {
			address: settings.server_url,
			options: ['-rtmp_playpath', settings.stream_key, '-f', 'flv'],
		};

		return output;
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<TextField
					variant="outlined"
					fullWidth
					placeholder="rtmps://xxx.tiktokcdn.com"
					label={<Trans>Server URL</Trans>}
					value={settings.server_url}
					onChange={handleChange('server_url')}
					error={settings.server_url.includes('rtmps://') ? false : true}
					helperText={settings.server_url.includes('rtmps://') ? false : 'Please enter a valid RTMPS URL.'}
				/>
			</Grid>
			<Grid item xs={12} md={9}>
				<TextField
					variant="outlined"
					fullWidth
					placeholder="abc123"
					label={<Trans>Stream key</Trans>}
					value={settings.stream_key}
					onChange={handleChange('stream_key')}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<FormInlineButton target="blank" href={stream_key_link} component="a">
					<Trans>GET</Trans>
				</FormInlineButton>
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
