import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import FormInlineButton from '../../../misc/FormInlineButton';
import Logo from './logos/datarhei.svg';
import Select from '../../../misc/Select';

const id = 'datarheicore';
const name = 'datarhei Core';
const version = '1.0';
const stream_key_link_rtmp = 'https://docs.datarhei.com/restreamer/knowledge-base/manual/system-settings/rtmp';
const stream_key_link_srt = 'https://docs.datarhei.com/restreamer/knowledge-base/manual/system-settings/srt';
const description = (
	<Trans>
		Transmit the main source to an datarhei Core Ressource. More details about the settings can be found{' '}
		<Link color="secondary" target="_blank" href="https://docs.datarhei.com/restreamer">
			here
		</Link>
		.
	</Trans>
);
const image_copyright = <Trans>Please contact the operator of the service and check what happens.</Trans>;
const author = {
	creator: {
		name: 'datarhei.com',
		link: 'https://datarhei.com',
	},
	maintainer: {
		name: 'datarhei.com',
		link: 'https://datarhei.com',
	},
};
const category = 'software';
const requires = {
	protocols: ['rtmp', 'rtmps', 'srt'],
	formats: ['flv', 'mpegts'],
	codecs: {
		audio: ['aac'],
		video: ['h264'],
	},
};

function ServiceIcon(props) {
	return <img src={Logo} alt="datarhei.com Logo" {...props} />;
}

function init(settings) {
	const initSettings = {
		protocol: 'rtmp',
		base_url: '',
		app_path: 'live',
		stream_name: '',
		token: '',
		srt_passphrase: '',
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
			address: null,
			options: null,
		};

		if (settings.protocol !== 'srt') {
			output.address =
				`${settings.protocol}://${settings.base_url}/` +
				(settings.app_path.length !== 0 ? `${settings.app_path}/` : '') +
				settings.stream_name +
				(settings.token.length !== 0 ? `?token=${settings.token}` : '');
			output.options = ['-f', 'flv'];
		} else {
			output.address =
				`srt://${settings.base_url}?mode=caller&transtype=live&streamid=#!:m=publish,r=${settings.stream_name}` +
				(settings.token.length !== 0 ? `,token=${settings.token}` : '') +
				(settings.srt_passphrase.length !== 0 ? `&passphrase=${settings.srt_passphrase}` : '');
			output.options = ['-bsf:v', 'dump_extra', '-f', 'mpegts'];
		}

		return output;
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={3}>
				<Select type="select" label={<Trans>Protocol</Trans>} value={settings.protocol} onChange={handleChange('protocol')}>
					<MenuItem value="rtmp">rtmp://</MenuItem>
					<MenuItem value="rtmps">rtmps://</MenuItem>
					<MenuItem value="srt">srt://</MenuItem>
				</Select>
			</Grid>
			<Grid item xs={12} md={settings.protocol !== 'srt' ? 6 : 9}>
				<TextField
					variant="outlined"
					fullWidth
					label={<Trans>Address</Trans>}
					placeholder="core-address:port"
					value={settings.base_url}
					onChange={handleChange('base_url')}
				/>
			</Grid>
			{settings.protocol !== 'srt' && (
				<Grid item xs={12} md={3}>
					<TextField variant="outlined" fullWidth label={<Trans>App</Trans>} value={settings.app_path} onChange={handleChange('app_path')} />
				</Grid>
			)}
			<Grid item xs={12} md={12}>
				<TextField
					variant="outlined"
					fullWidth
					label={<Trans>Stream name</Trans>}
					value={settings.stream_name}
					onChange={handleChange('stream_name')}
					placeholder={'streamId'}
				/>
			</Grid>
			<Grid item xs={12} md={settings.protocol !== 'srt' ? 9 : 4}>
				<TextField variant="outlined" fullWidth label={<Trans>Security token</Trans>} value={settings.token} onChange={handleChange('token')} />
			</Grid>
			{settings.protocol === 'srt' && (
				<Grid item xs={12} md={4}>
					<TextField
						variant="outlined"
						fullWidth
						label={<Trans>Security passphrase</Trans>}
						value={settings.srt_passphrase}
						onChange={handleChange('srt_passphrase')}
						disabled={settings.protocol !== 'srt'}
					/>
				</Grid>
			)}
			<Grid item xs={12} md={settings.protocol !== 'srt' ? 3 : 4}>
				<FormInlineButton target="blank" href={settings.protocol !== 'srt' ? stream_key_link_rtmp : stream_key_link_srt} component="a">
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

export {
	id,
	name,
	version,
	stream_key_link_rtmp,
	stream_key_link_srt,
	description,
	image_copyright,
	author,
	category,
	requires,
	ServiceIcon as icon,
	Service as component,
};
