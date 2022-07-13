import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// Import all filters (audio/video)
import * as Filters from './filters';

// Import all encoders (audio/video)
import * as Encoders from './coders/Encoders';

export default function FilterSelect(props) {
	const profile = props.profile;

	// handleFilterChange
	// what: Filter name
	// settings (component settings):  {Key: Value}
	// mapping (FFmpeg -af/-vf args): ['String', ...]
	const handleFilterSettingsChange = (what) => (settings, mapping, automatic) => {
		const filter = profile.filter;

		// Store mapping/settings per component
		filter.settings[what] = {
			mapping: mapping,
			settings: settings,
		};

		// Combine FFmpeg args
		let settings_mapping = [];
		for (let i in filter.settings) {
			if (filter.settings[i].mapping.length !== 0) {
				settings_mapping.push(filter.settings[i].mapping);
			}
		}

		// Create the real filter mapping
		// ['-af/-vf', 'args,args']
		if (settings_mapping.length !== 0) {
			if (props.type === 'video') {
				filter.mapping = ['-vf', settings_mapping.join(',')];
			} else if (props.type === 'audio') {
				filter.mapping = ['-af', settings_mapping.join(',')];
			}
		} else {
			filter.mapping = [];
		}

		props.onChange(profile.filter, filter, automatic);
	};

	// Set filterRegistry by type
	let filterRegistry = null;
	if (props.type === 'video') {
		filterRegistry = Filters.Video;
	} else if (props.type === 'audio') {
		filterRegistry = Filters.Audio;
	} else {
		return null;
	}

	// Checks the state of hwaccel (gpu encoding)
	let encoderRegistry = null;
	let hwaccel = false;
	if (props.type === 'video') {
		encoderRegistry = Encoders.Video;
		for (let i in encoderRegistry.List()) {
			if (encoderRegistry.List()[i].codec === props.videoProfile.encoder.coder && encoderRegistry.List()[i].hwaccel) {
				hwaccel = true;
			}
		}
	}

	// Creates filter components
	let filterSettings = [];
	if (!hwaccel) {
		for (let c of filterRegistry.List()) {
			// Checks FFmpeg skills (filter is available)
			if (props.availableFilters.includes(c.filter)) {
				const Settings = c.component;

				filterSettings.push(
					<Settings
						key={c.filter}
						settings={profile.filter.settings[c.filter] ? profile.filter.settings[c.filter].settings : []}
						onChange={handleFilterSettingsChange(c.filter)}
					/>
				);
			}
		}
	}

	// No suitable filter found
	if (filterSettings === null && !hwaccel) {
		return (
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography>
						<Trans>No suitable filter found.</Trans>
					</Typography>
				</Grid>
			</Grid>
		);

		// hwaccel requires further settings
	} else if (hwaccel) {
		return false;
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography>
					<Trans>Select your filter settings (optional):</Trans>
				</Typography>
			</Grid>
			{filterSettings}
		</Grid>
	);
}

FilterSelect.defaultProps = {
	type: '',
	filters: [],
	availableFilters: [],
	onChange: function (filter) {},
};
