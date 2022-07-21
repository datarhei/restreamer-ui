import * as AudioCopy from './audio/Copy';
import * as AudioNone from './audio/None';
import * as AAC from './audio/AAC';
import * as AACAudioToolbox from './audio/AACAudioToolbox';
import * as Libopus from './audio/Libopus';
import * as Libvorbis from './audio/Libvorbis';
import * as MP3 from './audio/MP3';
import * as Opus from './audio/Opus';
import * as Vorbis from './audio/Vorbis';

import * as X264 from './video/X264';
import * as X265 from './video/X265';
import * as H264VideoToolbox from './video/H264VideoToolbox';
import * as H264NVENC from './video/H264NVENC';
import * as H264OMX from './video/H264OMX';
import * as H264V4L2M2M from './video/H264V4L2M2M';
import * as H264VAAPI from './video/H264VAAPI';
import * as HEVCVAAPI from './video/HEVCVAAPI';
import * as VP9VAAPI from './video/VP9VAAPI';
import * as VideoCopy from './video/Copy';
import * as VideoNone from './video/None';
import * as VideoRaw from './video/Raw';
import * as VP9 from './video/VP9';

class Registry {
	constructor(type) {
		this.type = type;
		this.services = new Map();
	}

	Register(service) {
		if (service.type !== this.type) {
			return;
		}

		this.services.set(service.coder, service);
	}

	Get(coder) {
		const service = this.services.get(coder);
		if (service) {
			return service;
		}

		return null;
	}

	// Get the first coder for a codec that is in a
	// list of available coders.
	GetCoderForCodec(codec, availableCoders) {
		for (let coder of this.services.values()) {
			if (coder.codec !== codec) {
				continue;
			}

			if (!availableCoders.includes(coder.coder)) {
				continue;
			}

			return coder;
		}

		return null;
	}

	// Get a list of coders for a codec that is in a list of
	// availabled coders. The option for hwAcceleration can be
	// 'any', 'no', or 'yes'.
	GetCodersForCodec(codec, availableCoders, hwAcceleration) {
		const coders = [];

		for (let coder of this.services.values()) {
			if (coder.codec !== codec) {
				continue;
			}

			if (!availableCoders.includes(coder.coder)) {
				continue;
			}

			if (hwAcceleration === 'any') {
				coders.push(coder);
				continue;
			}

			if (hwAcceleration === 'no' && coder.hwaccel === false) {
				coders.push(coder);
				continue;
			}

			if (hwAcceleration === 'yes' && coder.hwaccel === true) {
				coders.push(coder);
				continue;
			}
		}

		return coders;
	}

	Coders() {
		return Array.from(this.services.keys());
	}

	List() {
		return Array.from(this.services.values());
	}
}

const audioRegistry = new Registry('audio');

audioRegistry.Register(AudioCopy);
audioRegistry.Register(AudioNone);
audioRegistry.Register(AAC);
audioRegistry.Register(AACAudioToolbox);
audioRegistry.Register(MP3);
audioRegistry.Register(Opus);
audioRegistry.Register(Libopus);
audioRegistry.Register(Vorbis);
audioRegistry.Register(Libvorbis);

const videoRegistry = new Registry('video');

videoRegistry.Register(VideoCopy);
videoRegistry.Register(VideoNone);
videoRegistry.Register(X264);
videoRegistry.Register(X265);
videoRegistry.Register(H264VideoToolbox);
videoRegistry.Register(H264NVENC);
videoRegistry.Register(H264OMX);
videoRegistry.Register(H264V4L2M2M);
videoRegistry.Register(H264VAAPI);
videoRegistry.Register(HEVCVAAPI);
videoRegistry.Register(VP9VAAPI);
videoRegistry.Register(VP9);
videoRegistry.Register(VideoRaw);

export { audioRegistry as Audio, videoRegistry as Video };
