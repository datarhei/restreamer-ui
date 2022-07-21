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

const initSettings = (initialSettings) => {
	const settings = {
		...S.func.initSettings(initialSettings),
		mode: 'push',
	};

	settings.push.type = 'rtmp';

	return settings;
};

function Source(props) {
	const navigate = useNavigate();
	const settings = initSettings(props.settings);
	const config = S.func.initConfig(props.config);
	const skills = S.func.initSkills(props.skills);

	const handleChange = (newSettings) => {
		newSettings = newSettings || settings;

		const inputs = S.func.createInputs(newSettings, config, skills);
		newSettings.address = inputs[0].address;

		props.onChange(S.id, newSettings, inputs, config.rtmp.enabled);
	};

	React.useEffect(() => {
		handleChange();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (config.rtmp.enabled === false) {
		return (
			<React.Fragment>
				<Grid item xs={12}>
					<Typography>
						<Trans>RTMP server is not enabled</Trans>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Button variant="outlined" size="large" fullWidth color="primary" onClick={() => navigate('/settings/rtmp')}>
						<Trans>Enable RTMP server ...</Trans>
					</Button>
				</Grid>
			</React.Fragment>
		);
	}

	const RTMP = S.func.getRTMP(config, settings.push.name);

	return (
		<React.Fragment>
			<Grid item xs={12}>
				<Typography>
					<Trans>Send stream to this address:</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<BoxTextarea>
					<Textarea rows={1} value={RTMP} readOnly allowCopy />
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

const id = 'rtmp';
const type = 'network';
const name = <Trans>RTMP server</Trans>;
const capabilities = ['audio', 'video'];

export { id, type, name, capabilities, SourceIcon as icon, Source as component };
