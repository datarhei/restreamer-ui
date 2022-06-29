import React from 'react';

function createMapping(settings, stream) {
	const local = ['-an'];

	const mapping = {
		global: [],
		local: local,
	};

	return mapping;
}

function Coder(props) {
	const settings = {};
	const stream = props.stream;

	const handleChange = (newSettings) => {
		let automatic = false;
		if (!newSettings) {
			newSettings = settings;
			automatic = true;
		}

		props.onChange(newSettings, createMapping(newSettings, stream), automatic);
	};

	React.useEffect(() => {
		handleChange(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
}

Coder.defaultProps = {
	stream: {},
	settings: {},
	onChange: function (settings, mapping) {},
};

const coder = 'none';
const name = 'No Audio';
const codec = 'none';
const type = 'audio';
const hwaccel = false;

function summarize(settings) {
	return `${name}`;
}

function defaults(stream) {
	const settings = {};

	return {
		settings: settings,
		mapping: createMapping(settings, stream),
	};
}

export { coder, name, codec, type, hwaccel, summarize, defaults, Coder as component };
