import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import * as Encoders from '../coders/Encoders';
import Checkbox from '../Checkbox';
import Select from '../Select';

function init(settings) {
	const initSettings = {
		enable: true,
		video_encoder: 'libx264',
		audio_encoder: 'aac',
		...settings,
	};

	return initSettings;
}

export default function Control({ settings = {}, availableEncoders = [], onChange = function (settings, automatic) {} }) {
	settings = init(settings);

	// Set the defaults
	React.useEffect(() => {
		onChange(settings, true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = (what) => (event) => {
		const value = event.target.value;

		if (['enable'].includes(what)) {
			settings[what] = !settings[what];
		} else {
			settings[what] = value;
		}

		onChange(settings, false);
	};

	const encoders = Encoders.Video.GetCodersForCodec('h264', availableEncoders, 'any');

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Checkbox label={<Trans>Enable browser-compatible H.264 stream</Trans>} checked={settings.enable} onChange={handleChange('enable')} />
			</Grid>
			<Grid item xs={12} md={6}>
				<Select label={<Trans>Video Codec</Trans>} value={settings.video_encoder} disabled={!settings.enable} onChange={handleChange('video_encoder')}>
					{encoders.map((encoder) => (
						<MenuItem key={encoder.coder} value={encoder.coder}>
							{encoder.name}
						</MenuItem>
					))}
				</Select>
				<Typography variant="caption">
					<Trans>The H.264 encoder used.</Trans>
				</Typography>
			</Grid>
		</Grid>
	);
}
