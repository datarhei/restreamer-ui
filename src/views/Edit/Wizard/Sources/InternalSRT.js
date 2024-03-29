import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Trans } from '@lingui/macro';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Icon from '@mui/icons-material/KeyboardTab';
import Typography from '@mui/material/Typography';

import * as S from '../../Sources/Network';
import BoxTextarea from '../../../../misc/BoxTextarea';
import Textarea from '../../../../misc/Textarea';

const initSettings = (initialSettings, config) => {
	const settings = {
		...S.func.initSettings(initialSettings, config),
		mode: 'push',
	};

	settings.push.type = 'srt';

	return settings;
};

function Source(props) {
	const navigate = useNavigate();
	const config = S.func.initConfig(props.config);
	const settings = initSettings(props.settings, config);
	const skills = S.func.initSkills(props.skills);

	const handleChange = (newSettings) => {
		newSettings = newSettings || settings;

		const inputs = S.func.createInputs(newSettings, config, skills);
		newSettings.address = inputs[0].address;

		props.onChange(S.id, newSettings, inputs, config.srt.enabled);
	};

	React.useEffect(() => {
		handleChange();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (config.srt.enabled === false) {
		return (
			<React.Fragment>
				<Grid item xs={12}>
					<Typography>
						<Trans>SRT server is not enabled</Trans>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Button variant="outlined" size="large" fullWidth color="primary" onClick={() => navigate('/settings/srt')}>
						<Trans>Enable SRT server ...</Trans>
					</Button>
				</Grid>
			</React.Fragment>
		);
	}

	const SRT = S.func.getSRT(config, settings.push.name);

	return (
		<React.Fragment>
			<Grid item xs={12}>
				<Typography>
					<Trans>Send stream to this address:</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<BoxTextarea>
					<Textarea rows={1} value={SRT} readOnly allowCopy />
				</BoxTextarea>
			</Grid>
		</React.Fragment>
	);
}

Source.defaultProps = {
	settings: {},
	config: null,
	skills: null,
	onChange: function (type, settings, inputs, ready) {},
};

function SourceIcon(props) {
	return <Icon style={{ color: '#FFF' }} {...props} />;
}

const id = 'srt';
const type = 'network';
const name = <Trans>SRT server</Trans>;
const capabilities = ['audio', 'video'];

export { id, type, name, capabilities, SourceIcon as icon, Source as component };
