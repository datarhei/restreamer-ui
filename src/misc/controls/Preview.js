import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import Checkbox from '../Checkbox';
import Select from '../Select';

const encoderOptions = {
    'libx264': 'H.264 (libx264)',
    'h264_nvenc': 'H.264 (NVENC)',
    'h264_omx': 'H.264 (OpenMAX IL)',
    'h264_v4l2m2m': 'H.264 (V4L2 Memory to Memory)',
    'h264_vaapi': 'H.264 (Intel VAAPI)',
    'h264_videotoolbox': 'H.264 (VideoToolbox)',
};

function init(settings) {
	const initSettings = {
		enable: true,
		video_encoder: 'libx264',
		audio_encoder: 'aac',
		...settings,
	};

	return initSettings;
}

export default function Control({ settings = {}, encoders = [], onChange = function (settings, automatic) {} }) {
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

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Checkbox label={<Trans>Enable browser-compatible H.264 stream</Trans>} checked={settings.enable} onChange={handleChange('enable')} />
			</Grid>
			<Grid item xs={12} md={6}>
				<Select
					label={<Trans>Video Codec</Trans>}
					value={settings.video_encoder}
					disabled={!settings.enable}
					onChange={handleChange('video_encoder')}
				>
					{Object.entries(encoderOptions).map(([value, label]) => (
						encoders.includes(value) && (
							<MenuItem key={value} value={value}>
								{label}
							</MenuItem>
						)
					))}
				</Select>
				<Typography variant="caption">
					<Trans>The H.264 encoder used.</Trans>
				</Typography>
			</Grid>
		</Grid>
	);
}
