import * as ALSA from './ALSA';
import * as AudioLoop from './AudioLoop';
import * as AVFoundation from './AVFoundation';
import * as Network from './Network';
import * as NoAudio from './NoAudio';
import * as Raspicam from './Raspicam';
import * as SDP from './SDP';
import * as Video4Linux from './V4L';
import * as VideoAudio from './VideoAudio';
import * as VideoLoop from './VideoLoop';
import * as VirtualAudio from './VirtualAudio';
import * as VirtualVideo from './VirtualVideo';
import * as X11grab from './X11grab';
import * as Channel from './Channel';

class Registry {
	constructor() {
		this.services = new Map();
	}

	Register(service) {
		this.services.set(service.id, service);
	}

	Get(id) {
		const service = this.services.get(id);
		if (service) {
			return service;
		}

		return null;
	}

	IDs() {
		return Array.from(this.services.keys());
	}

	List() {
		return Array.from(this.services.values());
	}
}

const registry = new Registry();

registry.Register(Network);
registry.Register(ALSA);
registry.Register(AVFoundation);
registry.Register(Video4Linux);
registry.Register(Raspicam);
registry.Register(VirtualAudio);
registry.Register(VirtualVideo);
registry.Register(NoAudio);
registry.Register(VideoAudio);
registry.Register(VideoLoop);
registry.Register(AudioLoop);
registry.Register(SDP);
registry.Register(X11grab);
registry.Register(Channel);

export default registry;
