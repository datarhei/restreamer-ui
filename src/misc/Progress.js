import React from 'react';

import { Trans } from '@lingui/macro';
import makeStyles from '@mui/styles/makeStyles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Duration from './Duration';
import Number from './Number';

const useStyles = makeStyles((theme) => ({
	box: {
		backgroundColor: theme.palette.background.modalbox,
		borderRadius: 4,
		padding: '1em',
		height: '100%',
	},
}));

function init({
	valid = false,
	order = 'stop',
	state = 'disconnected',
	error = '',
	reconnect = -1,
	bitrate = 0,
	fps = 0,
	time = 0,
	speed = 0,
	q = -1,
	frames = 0,
	drop = 0,
	dup = 0,
	command = [],
	cpu = 0,
	memory = 0,
	video_codec = '',
	audio_codec = '',
}) {
	const initProps = {
		valid: valid,
		order: order,
		state: state,
		error: error,
		reconnect: reconnect,
		bitrate: bitrate,
		fps: fps,
		time: time,
		speed: speed,
		q: q,
		frames: frames,
		drop: drop,
		dup: dup,
		command: command,
		cpu: cpu,
		memory: memory,
		video_codec: video_codec,
		audio_codec: audio_codec,
	};

	return initProps;
}

export default function Progress({
	valid = false,
	order = 'stop',
	state = 'disconnected',
	error = '',
	reconnect = -1,
	bitrate = 0,
	fps = 0,
	time = 0,
	speed = 0,
	q = -1,
	frames = 0,
	drop = 0,
	dup = 0,
	command = [],
	cpu = 0,
	memory = 0,
	video_codec = '',
	audio_codec = '',
}) {
	const classes = useStyles();

	const progress = init({
		valid: valid,
		order: order,
		state: state,
		error: error,
		reconnect: reconnect,
		bitrate: bitrate,
		fps: fps,
		time: time,
		speed: speed,
		q: q,
		frames: frames,
		drop: drop,
		dup: dup,
		command: command,
		cpu: cpu,
		memory: memory,
		video_codec: video_codec,
		audio_codec: audio_codec,
	});

	return (
		<Grid container className={classes.box}>
			<Grid item xs={12}>
				<Typography variant="h4">
					<strong>
						<Duration seconds={progress.time} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Uptime</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.cpu} digits={2} minDigits={2} />%
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>CPU</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.memory / 1024 / 1024} digits={0} minDigits={0} /> MB
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Memory</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.fps} digits={2} minDigits={2} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>FPS</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.bitrate} digits={2} minDigits={2} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>kbit/s</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.q} digits={2} minDigits={2} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Quality</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.speed} digits={2} minDigits={2} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Speed</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h4">
					<strong>
						<Number value={!isNaN((progress.drop * 100) / progress.frames) || 0} digits={2} minDigits={2} />%
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Frame drops</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.dup} digits={2} minDigits={2} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Dup. frames</Trans>
				</Typography>
			</Grid>
		</Grid>
	);
}
