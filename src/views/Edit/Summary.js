import React from 'react';

import { useLingui } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import * as Coders from '../../misc/coders/Encoders';
import BoxText from '../../misc/BoxText';
import Sources from './Sources';

export default function Summary(props) {
	const { i18n } = useLingui();
	const sources = props.sources;
	const profile = props.profile;

	let source = null;
	let stream = null;

	if (profile.source >= 0 && profile.source < sources.length) {
		source = sources[profile.source];

		if (profile.stream >= 0 && profile.stream < source.streams.length) {
			stream = source.streams[profile.stream];
		}
	}

	let name = i18n._(t`No source selected`);
	let address = '';
	let encodingSummary = i18n._(t`None`);

	let showEncoding = false;

	if (source !== null && stream !== null) {
		const s = Sources.Get(source.type);
		if (s !== null) {
			name = s.name;
			address = stream.url.replace(/^playout:/, '');

			showEncoding = true;
		}

		let coder = null;

		if (props.type === 'video') {
			coder = Coders.Video.Get(profile.encoder.coder);
		} else if (props.type === 'audio') {
			coder = Coders.Audio.Get(profile.encoder.coder);
		}

		if (coder !== null) {
			encodingSummary = coder.summarize(profile.encoder.settings);
		}
	}

	return (
		<BoxText>
			<Grid container spacing={1}>
				<Grid item xs={12}>
					<Typography variant="subtitle2">{name}</Typography>
					<Typography variant="body1">{address}</Typography>
				</Grid>
				{showEncoding === true && (
					<Grid item xs={12}>
						<Typography variant="subtitle2">
							<Trans>Encoding</Trans>
						</Typography>
						<Typography variant="body1">{encodingSummary}</Typography>
					</Grid>
				)}
			</Grid>
		</BoxText>
	);
}

Summary.defaultProps = {
	type: '',
	sources: [],
	profile: null,
};
