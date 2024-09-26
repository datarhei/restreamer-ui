import React from 'react';

import { Trans } from '@lingui/macro';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import Dialog from './Dialog';
import Select from '../Select';
import Video from '../coders/settings/Video';
import Audio from '../coders/settings/Audio';

const Stream = function ({ stream = {}, onChange = () => {} }) {
	const handleChange = (what) => (event) => {
		const value = event.target.value;

		stream = {
			...stream,
		};

		if (what === 'type') {
			if (value === 'audio') {
				stream.codec = 'aac';
				if (stream.sampling_hz === 0) {
					stream.sampling_hz = '44100';
				}
				if (stream.layout === '') {
					stream.layout = 'stereo';
					stream.channels = 2;
				}
			} else {
				stream.codec = 'h264';
				if (stream.width === 0) {
					stream.width = 1920;
					stream.height = 1080;
				}

				if (stream.pix_fmt === '') {
					stream.pix_fmt = 'yuv240p';
				}
			}
			stream.type = value;
		} else if (what === 'size') {
			const [width, height] = value.split('x');

			stream.width = width;
			stream.height = height;
		} else {
			stream[what] = value;
		}

		onChange(stream);
	};

	return (
		<Grid container spacing={2}>
			{/* <Grid item xs={6}>
				<Select label={<Trans>Type</Trans>} value={stream.type} onChange={handleChange('type')}>
					<MenuItem value="audio">Audio</MenuItem>
					<MenuItem value="video">Video</MenuItem>
				</Select>
			</Grid> */}
			{stream.type === 'audio' ? (
				<React.Fragment>
					<Grid item xs={12}>
						<Select label={<Trans>Codec</Trans>} value={stream.codec} onChange={handleChange('codec')}>
							<MenuItem value="aac">AAC</MenuItem>
							<MenuItem value="mp3">MP3</MenuItem>
						</Select>
					</Grid>
					<Grid item xs={12}>
						<Audio.Sampling value={stream.sampling_hz} onChange={handleChange('sampling_hz')} allowCustom />
					</Grid>
					<Grid item xs={12}>
						<Audio.Layout value={stream.layout} onChange={handleChange('layout')} allowCustom />
					</Grid>
				</React.Fragment>
			) : (
				<React.Fragment>
					<Grid item xs={12}>
						<Select label={<Trans>Codec</Trans>} value={stream.codec} onChange={handleChange('codec')}>
							<MenuItem value="h264">H264</MenuItem>
							<MenuItem value="hevc">HEVC</MenuItem>
							<MenuItem value="vp9">VP9</MenuItem>
							<MenuItem value="av1">AV1</MenuItem>
							<MenuItem value="vp8">VP8</MenuItem>
						</Select>
					</Grid>
					<Grid item xs={12}>
						<Video.Size value={stream.width + 'x' + stream.height} onChange={handleChange('size')} allowCustom />
					</Grid>
					<Grid item xs={12}>
						<Video.PixFormat value={stream.pix_fmt} onChange={handleChange('pix_fmt')} allowCustom />
					</Grid>
				</React.Fragment>
			)}
		</Grid>
	);
};

const Streams = function ({ streams = [], type = '', onChange = () => {} }) {
	const handleChange = (index) => (stream) => {
		streams = streams.slice();

		streams[index] = stream;

		onChange(streams);
	};

	const handleAddStream = () => {
		streams = streams.slice();

		streams.push({
			index: type === 'video' ? 0 : 1,
			stream: streams.length,
			type: 'audio',
			codec: 'aac',
			width: 0,
			height: 0,
			sampling_hz: 44100,
			layout: 'stereo',
			channels: 2,
		});

		onChange(streams);
	};

	const handleRemoveStream = (index) => () => {
		streams = streams.toSpliced(index, 1);

		onChange(streams);
	};

	return (
		<Grid container spacing={1}>
			{streams.map((stream, index) => (
				<Grid key={stream.index + ':' + stream.stream} item xs={12}>
					<Stack>
						<Typography sx={{ textTransform: 'UPPERCASE', marginBottom: 2 }}>{stream.type}</Typography>
						<Stream stream={stream} onChange={handleChange(index)} />
					</Stack>
				</Grid>
			))}
			<Grid item xs={12}>
				{streams.length < 2 && (
					<Button variant="outlined" color="default" onClick={handleAddStream}>
						<Trans>Add Audio</Trans>
					</Button>
				)}
				{streams.length === 2 && (
					<Button variant="outlined" color="secondary" onClick={handleRemoveStream(1)}>
						<Trans>Remove Audio</Trans>
					</Button>
				)}
			</Grid>
		</Grid>
	);
};

const Component = function ({ open = false, title = '', streams = [], type = '', onClose = null, onDone = () => {}, onChange = () => {}, onHelp = null }) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			title={title}
			buttonsLeft={
				<Button variant="outlined" color="secondary" onClick={onClose}>
					<Trans>Close</Trans>
				</Button>
			}
			buttonsRight={
				<Button variant="outlined" color="default" onClick={onDone}>
					<Trans>Save</Trans>
				</Button>
			}
		>
			<Streams type={type} streams={streams} onChange={onChange} />
		</Dialog>
	);
};

export default Component;
