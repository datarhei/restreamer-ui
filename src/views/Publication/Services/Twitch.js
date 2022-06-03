import React from 'react';

import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import FormInlineButton from '../../../misc/FormInlineButton';
import Select from '../../../misc/Select';

const id = 'twitch';
const name = 'Twitch';
const version = '1.0';
const stream_key_link = 'https://dashboard.twitch.tv/settings/stream';
const description = <Trans>Live-Streaming to Twitch Live RTMP Service.</Trans>;
const image_copyright = <Trans>More about licenses here</Trans>;
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
	return <FontAwesomeIcon icon={faTwitch} style={{ color: '#9147FF' }} {...props} />;
}

function init(settings) {
	const initSettings = {
		region: 'live',
		key: '',
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
			address: 'rtmp://' + settings.region + '.twitch.tv/app/' + settings.key,
			options: ['-f', 'flv'],
		};

		return output;
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Select label={<Trans>Region</Trans>} value={settings.region} onChange={handleChange('region')}>
					<MenuItem value="live">Autodetect</MenuItem>
					<MenuItem value="live-hkg">Asia - Hong Kong</MenuItem>
					<MenuItem value="live-sel">Asia - Seoul, South Korea</MenuItem>
					<MenuItem value="live-sin">Asia - Singapore</MenuItem>
					<MenuItem value="live-tpe">Asia - Taipei, Taiwan</MenuItem>
					<MenuItem value="live-tyo">Asia - Tokyo, Japan</MenuItem>
					<MenuItem value="live-syd">Australia - Sydney</MenuItem>
					<MenuItem value="live-ams">EU - Amsterdam, NL</MenuItem>
					<MenuItem value="live-ber">EU - Berlin, DE</MenuItem>
					<MenuItem value="live-cph">Europe - Copenhagen, DK</MenuItem>
					<MenuItem value="live-fra">EU - Frankfurt, DE</MenuItem>
					<MenuItem value="live-hel">EU - Helsinki, FI</MenuItem>
					<MenuItem value="live-lis">EU - Lisbon, Portugal</MenuItem>
					<MenuItem value="live-lhr">EU - London, UK</MenuItem>
					<MenuItem value="live-mad">EU - Madrid, Spain</MenuItem>
					<MenuItem value="live-mrs">EU - Marseille, FR</MenuItem>
					<MenuItem value="live-mil">EU - Milan, Italy</MenuItem>
					<MenuItem value="live-osl">EU - Norway, Oslo</MenuItem>
					<MenuItem value="live-cdg">EU - Paris, FR</MenuItem>
					<MenuItem value="live-prg">EU - Prague, CZ</MenuItem>
					<MenuItem value="live-arn">EU - Stockholm, SE</MenuItem>
					<MenuItem value="live-vie">EU - Vienna, Austria</MenuItem>
					<MenuItem value="live-waw">EU - Warsaw, Poland</MenuItem>
					<MenuItem value="live-qro">NA - Mexico City</MenuItem>
					<MenuItem value="live-ymq">NA - Quebec, Canada</MenuItem>
					<MenuItem value="live-yto">NA - Toronto, Canada</MenuItem>
					<MenuItem value="live-eze">South America - Argentina</MenuItem>
					<MenuItem value="live-scl">South America - Chile</MenuItem>
					<MenuItem value="live-lim">South America - Lima, Peru</MenuItem>
					<MenuItem value="live-mde">South America - Medellin, Colombia</MenuItem>
					<MenuItem value="live-rio">South America - Rio de Janeiro, Brazil</MenuItem>
					<MenuItem value="live-sao">South America - Sao Paulo, Brazil</MenuItem>
					<MenuItem value="live-dfw">US Central - Dallas, TX</MenuItem>
					<MenuItem value="live-den">US Central - Denver, CO</MenuItem>
					<MenuItem value="live-hou">US Central - Houston, TX</MenuItem>
					<MenuItem value="live-slc">US Central - Salt Lake City, UT</MenuItem>
					<MenuItem value="live-iad">US East - Ashburn, VA</MenuItem>
					<MenuItem value="live-atl">US East - Atlanta, GA</MenuItem>
					<MenuItem value="live-ord">US East - Chicago</MenuItem>
					<MenuItem value="live-mia">US East - Miami, FL</MenuItem>
					<MenuItem value="live-jfk">US East - New York, NY</MenuItem>
					<MenuItem value="live-lax">US West - Los Angeles, CA</MenuItem>
					<MenuItem value="live-phx">US West - Phoenix, AZ</MenuItem>
					<MenuItem value="live-pdx">US West - Portland, Oregon</MenuItem>
					<MenuItem value="live-sfo">US West - San Francisco, CA</MenuItem>
					<MenuItem value="live-sjc">US West - San Jose, CA</MenuItem>
					<MenuItem value="live-sea">US West - Seattle, WA</MenuItem>
				</Select>
			</Grid>
			<Grid item xs={12} md={9}>
				<TextField variant="outlined" fullWidth label={<Trans>Stream key</Trans>} value={settings.key} onChange={handleChange('key')} />
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
