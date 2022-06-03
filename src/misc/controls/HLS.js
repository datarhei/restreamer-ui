import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Checkbox from '../Checkbox';

function init(settings) {
	const initSettings = {
		lhls: false,
		segmentDuration: 2,
		listSize: 6,
		cleanup: true,
		...settings,
	};

	return initSettings;
}

export default function Control(props) {
	const settings = init(props.settings);

	// Set the defaults
	React.useEffect(() => {
		props.onChange(settings, true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = (what) => (event) => {
		const value = event.target.value;

		if (['lhls', 'cleanup'].includes(what)) {
			settings[what] = !settings[what];
		} else {
			settings[what] = value;
		}

		props.onChange(settings, false);
	};
	return (
		<Grid container spacing={2}>
			{/*
				lhls problems:
				- naming of the manifests and media files does not work
				- segmentation of audio and video creates a playback error
				- hls inputs requires encoding
				- have to wait for the final integration in hls.js

				<Grid item xs={12}>
					<Checkbox label={<Trans>Low latency Mode (LHLS/CMAF)</Trans>} checked={settings.lhls} onChange={handleChange('lhls')} />
					<Typography variant="caption">
						<Trans>Experimental function. Older browsers and clients may not be supported.</Trans>
					</Typography>
				</Grid>
			*/}
			<Grid item xs={12} md={6}>
				<TextField
					variant="outlined"
					fullWidth
					label={<Trans>Segment length (seconds)</Trans>}
					value={settings.segmentDuration}
					onChange={handleChange('segmentDuration')}
				/>
				<Typography variant="caption">
					<Trans>Segment will be cut on the following keyframe after this time has passed. 2 is recommended.</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12} md={6}>
				<TextField
					variant="outlined"
					fullWidth
					label={<Trans>List size (segments)</Trans>}
					value={settings.listSize}
					onChange={handleChange('listSize')}
				/>
				<Typography variant="caption">
					<Trans>The maximum number of playlist segments. 0 will contain all the segments. 6 is recommended.</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Checkbox label={<Trans>Automatic cleanup of all media data</Trans>} checked={settings.cleanup} onChange={handleChange('cleanup')} />
			</Grid>
		</Grid>
	);
}

Control.defaulProps = {
	settings: {},
	onChange: function (settings, automatic) {},
};
