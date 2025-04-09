import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';

import Logo from './logos/earthcam.svg';
import FormInlineButton from '../../../misc/FormInlineButton';

const id = 'earthcam';
const name = 'EarthCam';
const version = '1.0';
const stream_key_link = 'https://www.earthcam.com/myearthcam/settings.php';
const description = (
	<Trans>
		Transmit your Livestream to an EarthCam RTMP service.{' '}
		<Link color="secondary" target="_blank" href="https://www.earthcam.com/myearthcam/help/gettingstarted.php">
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
	protocols: ['rtmp'],
	formats: ['flv'],
	codecs: {
		audio: ['aac'],
		video: ['h264'],
	},
};

function ServiceIcon(props) {
	return <img src={Logo} alt="EarthCam.com Logo" {...props} />;
}

function init(settings) {
	const initSettings = {
		server_url: 'rtmp://video1.earthcam.com/myearthcam',
		stream_key: '',
		...settings,
	};

	return initSettings;
}

function Service({ settings = {}, skills = {}, metadata = {}, streams = [], onChange = function (output, settings) {} }) {
	settings = init(settings);

	const handleChange = (what) => (event) => {
		const value = event.target.value;

		settings[what] = value;

		const output = createOutput(settings);

		onChange([output], settings);
	};

	const createOutput = (settings) => {
		const output = {
			address: settings.server_url + '/' + settings.stream_key,
			//options: ['-rtmp_playpath', settings.stream_key, '-f', 'flv'],
		};

		return output;
	};

	return (
		<Grid container spacing={2}>
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

export { id, name, version, stream_key_link, description, image_copyright, author, category, requires, ServiceIcon as icon, Service as component };
