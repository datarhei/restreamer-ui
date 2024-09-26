import React from 'react';

import Helper from '../../helper';

function createMapping(settings, stream, skills) {
	stream = Helper.InitStream(stream);
	skills = Helper.InitSkills(skills);

	const local = ['-codec:a', 'copy'];

	//if (stream.codec === 'aac') {
	//	local.push('-bsf:a', 'aac_adtstoasc');
	//}

	const mapping = {
		global: [],
		local: local,
		filter: [],
	};

	return mapping;
}

function Coder({ stream = {}, settings = {}, skills = {}, onChange = function (settings, mapping) {} }) {
	settings = {};
	stream = Helper.InitStream(stream);
	skills = Helper.InitSkills(skills);

	const handleChange = (newSettings) => {
		let automatic = false;
		if (!newSettings) {
			newSettings = settings;
			automatic = true;
		}

		onChange(newSettings, createMapping(newSettings, stream, skills), automatic);
	};

	React.useEffect(() => {
		handleChange(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
}

const coder = 'copy';
const name = 'Passthrough (copy)';
const codec = 'copy';
const type = 'audio';
const hwaccel = false;

function summarize(settings) {
	return `${name}`;
}

function defaults(stream, skills) {
	const settings = {};

	return {
		settings: settings,
		mapping: createMapping(settings, stream, skills),
	};
}

export { coder, name, codec, type, hwaccel, summarize, defaults, Coder as component };
