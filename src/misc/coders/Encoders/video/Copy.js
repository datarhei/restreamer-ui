import React from 'react';

function createMapping(settings, stream, skills) {
	const local = ['-codec:v', 'copy'];

	const mapping = {
		global: [],
		local: local,
	};

	return mapping;
}

function Coder(props) {
	const settings = {};

	const handleChange = (newSettings) => {
		let automatic = false;
		if (!newSettings) {
			newSettings = settings;
			automatic = true;
		}

		props.onChange(newSettings, createMapping(newSettings, props.stream, props.skills), automatic);
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
	skills: {},
	onChange: function (settings, mapping) {},
};

function summarize(settings) {
	return `${name}`;
}

function defaults(stream, skills) {
	return {
		settings: {},
		mapping: createMapping({}, stream, skills),
	};
}

const coder = 'copy';
const name = 'Passthrough (copy)';
const codec = 'copy';
const type = 'video';
const hwaccel = false;

export { coder, name, codec, type, hwaccel, summarize, defaults, Coder as component };
