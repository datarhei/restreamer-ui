import React from 'react';

import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';

import Checkbox from '../../../misc/Checkbox';
import FormInlineButton from '../../../misc/FormInlineButton';

const id = 'instagram';
const name = 'Instagram';
const version = '1.1';
const stream_key_link = 'https://instafeed.me/rtmp/';
const stream_key_link_yd = 'https://yellowduck.tv/';
const description = (
	<Trans>
		Live-Streaming to Instagram Live RTMP Service. The stream key requires a service such as{' '}
		<Link color="secondary" target="_blank" href="https://instafeed.me/">
			Instafeed.me
		</Link>{' '}
		or{' '}
		<Link color="secondary" target="_blank" href="https://yellowduck.tv/">
			Yellow Duck
		</Link>
		.
	</Trans>
);
const image_copyright = '';
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
	return <FontAwesomeIcon icon={faInstagram} style={{ color: '#E1306C' }} {...props} />;
}

function init(settings) {
	const initSettings = {
		key: '',
		service_instafeed: false,
		service_yellowduck: false,
		...settings,
	};

	return initSettings;
}

function Service(props) {
	const settings = init(props.settings);

	const handleChange = (what) => (event) => {
		const value = event.target.value;

		if (['service_instafeed', 'service_yellowduck'].includes(what)) {
			settings[what] = !settings[what];
		} else {
			settings[what] = value;
		}

		const output = createOutput(settings);

		props.onChange([output], settings);
	};

	const createOutput = (settings) => {
		const output = {
			address: 'rtmps://live-upload.instagram.com:443/rtmp/' + settings.key,
			options: ['-f', 'flv'],
		};

		return output;
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={9}>
				<TextField variant="outlined" fullWidth label={<Trans>Stream key</Trans>} value={settings.key} onChange={handleChange('key')} />
			</Grid>
			{!settings.service_instafeed && !settings.service_yellowduck && (
				<Grid item xs={12} md={3}>
					<FormInlineButton target="blank" component="a" disabled>
						<Trans>GET</Trans>
					</FormInlineButton>
				</Grid>
			)}
			{settings.service_instafeed && (
				<Grid item xs={12} md={3}>
					<FormInlineButton target="blank" href={stream_key_link} component="a">
						<Trans>GET</Trans>
					</FormInlineButton>
				</Grid>
			)}
			{settings.service_yellowduck && (
				<Grid item xs={12} md={3}>
					<FormInlineButton target="blank" href={stream_key_link_yd} component="a">
						<Trans>GET</Trans>
					</FormInlineButton>
				</Grid>
			)}
			<Grid item xs={12}>
				<Checkbox
					label={<Trans>Instafeed.me</Trans>}
					checked={settings.service_instafeed}
					onChange={handleChange('service_instafeed')}
					disabled={settings.service_yellowduck}
				/>
				<Checkbox
					label={<Trans>Yellow Duck</Trans>}
					checked={settings.service_yellowduck}
					onChange={handleChange('service_yellowduck')}
					disabled={settings.service_instafeed}
				/>
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
