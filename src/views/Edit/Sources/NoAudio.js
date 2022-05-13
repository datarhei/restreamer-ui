import React from 'react';

import { Trans } from '@lingui/macro';
import Icon from '@mui/icons-material/Block';

// This is a pseudo audio source for selecting no audio

const initSettings = (initialSettings) => {
	if (!initialSettings) {
		initialSettings = {};
	}

	const settings = {
		...initialSettings,
	};

	return settings;
};

const createInputs = (settings) => {
	const input = {
		address: '',
		options: [],
	};

	return [input];
};

function Source(props) {
	return null;
}

Source.defaultProps = {
	knownDevices: [],
	settings: {},
	onChange: function (settings) {},
	onProbe: function (settings, inputs) {},
};

function SourceIcon(props) {
	return <Icon {...props} />;
}

const id = 'noaudio';
const name = <Trans>No audio</Trans>;
const capabilities = ['audio'];

const func = {
	initSettings,
	createInputs,
};

export { id, name, capabilities, SourceIcon as icon, Source as component, func };
