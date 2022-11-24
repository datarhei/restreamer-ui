function InitStream(initialStream) {
	if (!initialStream) {
		initialStream = {};
	}

	let stream = {
		codec: '',
		...initialStream,
	};

	return stream;
}

function InitSkills(initialSkills) {
	if (!initialSkills) {
		initialSkills = {};
	}

	let skills = {
		ffmpeg: {},
		...initialSkills,
	};

	skills.ffmpeg = {
		version: '5.0.0',
		...skills.ffmpeg,
	};

	return skills;
}

export default {
	InitStream,
	InitSkills,
};
