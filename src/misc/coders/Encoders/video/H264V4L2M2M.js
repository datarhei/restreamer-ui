import React from 'react';

import Grid from '@mui/material/Grid';

import Video from '../../settings/Video';

function init(initialState) {
	const state = {
		bitrate: '4096',
		fps: '25',
		gop: '2',
		profile: 'auto',
		...initialState,
	};

	return state;
}

// https://forums.raspberrypi.com/viewtopic.php?t=294161
// ffmpeg -y -nostdin -f v4l2 -threads auto -input_format yuyv422 -fflags +genpts -flags +global_header \
// -i /dev/video0 -s 1280x720 -r 25 \
// -vcodec h264_v4l2m2m \
// -num_output_buffers 32 -num_capture_buffers 16 \
// -keyint_min 25 -force_key_frames "expr:gte(t,n_forced*1)" \
// -g 50 -b:v 6M -pix_fmt nv12 \
// -f mp4 -f segment -segment_format_options movflags=+faststart -segment_time 1 -reset_timestamps 1 -segment_time 1 -segment_time_delta 1 -segment_format mp4 -muxdelay 0 -muxpreload 0 /home/pi/Videos/%d-output.mp4

/**
v4l2-ctl --list-ctrls-menu -d 11

Codec Controls

             video_bitrate_mode 0x009909ce (menu)   : min=0 max=1 default=0 value=0 (Variable Bitrate) flags=update
				0: Variable Bitrate
				1: Constant Bitrate
                  video_bitrate 0x009909cf (int)    : min=25000 max=25000000 step=25000 default=10000000 value=10000000
           sequence_header_mode 0x009909d8 (menu)   : min=0 max=1 default=1 value=1 (Joined With 1st Frame)
				0: Separate Buffer
				1: Joined With 1st Frame
         repeat_sequence_header 0x009909e2 (bool)   : default=0 value=0
                force_key_frame 0x009909e5 (button) : value=0 flags=write-only, execute-on-write
          h264_minimum_qp_value 0x00990a61 (int)    : min=0 max=51 step=1 default=20 value=20
          h264_maximum_qp_value 0x00990a62 (int)    : min=0 max=51 step=1 default=51 value=51
            h264_i_frame_period 0x00990a66 (int)    : min=0 max=2147483647 step=1 default=60 value=60
                     h264_level 0x00990a67 (menu)   : min=0 max=13 default=11 value=11 (4)
				0: 1
				1: 1b
				2: 1.1
				3: 1.2
				4: 1.3
				5: 2
				6: 2.1
				7: 2.2
				8: 3
				9: 3.1
				10: 3.2
				11: 4
				12: 4.1
				13: 4.2
                   h264_profile 0x00990a6b (menu)   : min=0 max=4 default=4 value=4 (High)
				0: Baseline
				1: Constrained Baseline
				2: Main
				4: High
 */

function createMapping(settings) {
	const local = [
		'-codec:v',
		'h264_v4l2m2m',
		'-b:v',
		`${settings.bitrate}k`,
		'-maxrate',
		`${settings.bitrate}k`,
		'-bufsize',
		`${settings.bitrate}k`,
		'-r',
		`${settings.fps}`,
		'-pix_fmt',
		'yuv420p',
	];

	if (settings.gop !== 'auto') {
		local.push('-g', `${Math.round(parseInt(settings.fps) * parseInt(settings.gop)).toFixed(0)}`);
	}

	if (settings.profile !== 'auto') {
		local.push('-profile:v', `${settings.profile}`);
	}

	const mapping = {
		global: [],
		local: local,
	};

	return mapping;
}

function Coder(props) {
	const settings = init(props.settings);

	const handleChange = (newSettings) => {
		let automatic = false;
		if (!newSettings) {
			newSettings = settings;
			automatic = true;
		}

		props.onChange(newSettings, createMapping(newSettings), automatic);
	};

	const update = (what) => (event) => {
		const newSettings = {
			...settings,
			[what]: event.target.value,
		};

		handleChange(newSettings);
	};

	React.useEffect(() => {
		handleChange(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Video.Bitrate value={settings.bitrate} onChange={update('bitrate')} allowCustom />
			</Grid>
			<Grid item xs={12}>
				<Video.Framerate value={settings.fps} onChange={update('fps')} allowCustom />
			</Grid>
			<Grid item xs={12}>
				<Video.GOP value={settings.gop} onChange={update('gop')} allowAuto allowCustom />
			</Grid>
		</Grid>
	);
}

Coder.defaultProps = {
	stream: {},
	settings: {},
	onChange: function (settings, mapping) {},
};

const coder = 'h264_v4l2m2m';
const name = 'H.264 (V4L2 Memory to Memory)';
const codec = 'h264';
const type = 'video';
const hwaccel = true;

function summarize(settings) {
	return `${name}, ${settings.bitrate} kbit/s, ${settings.fps} FPS, Profile: ${settings.profile}`;
}

function defaults() {
	const settings = init({});

	return {
		settings: settings,
		mapping: createMapping(settings),
	};
}

export { coder, name, codec, type, hwaccel, summarize, defaults, Coder as component };
