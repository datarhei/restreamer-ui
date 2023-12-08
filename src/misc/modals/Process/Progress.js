import React from 'react';

import { Trans } from '@lingui/macro';
import makeStyles from '@mui/styles/makeStyles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Duration from '../../Duration';
import Number from '../../Number';

const useStyles = makeStyles((theme) => ({
	box: {
		backgroundColor: theme.palette.background.modalbox,
		borderRadius: 4,
		padding: '1em',
		height: '100%',
	},
}));

function init(props) {
	const initProps = {
		time: 0,
		fps: 0,
		bitrate: 0,
		q: -1,
		speed: 0,
		drop: 0,
		dup: 0,
		frames: 0,
		cpu: 0,
		memory: 0,
		...props,
	};

	return initProps;
}

function IO(props) {
	if (props.progress === null) {
		return (
			<Typography variant="body2" gutterBottom>
				<Trans>Not available</Trans>
			</Typography>
		);
	}

	const progress = props.progress;

	return (
		<Grid container>
			<Grid item xs={12}>
				<Typography variant="body2" gutterBottom>
					{progress.type}: {progress.codec}{' '}
					{progress.type === 'video' ? (
						<React.Fragment>
							{progress.width}x{progress.height} {progress.pix_fmt}
						</React.Fragment>
					) : (
						<React.Fragment>
							{progress.layout} {progress.sampling_hz} Hz
						</React.Fragment>
					)}
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.bitrate_kbit} digits={2} minDigits={2} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>kbit/s</Trans>
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.fps} digits={2} minDigits={2} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>FPS</Trans>
				</Typography>
			</Grid>
		</Grid>
	);
}

IO.defaultProps = {
	progress: null,
};

export default function Progress(props) {
	const classes = useStyles();

	const progress = init(props);

	console.log(progress);

	let input_video = null;
	let input_audio = null;
	let output_video = null;
	let output_audio = null;

	for (let i = 0; i < progress.inputs.length; i++) {
		if (progress.inputs[i].type === 'video') {
			input_video = progress.inputs[i];
		} else if (progress.inputs[i].type === 'audio') {
			input_audio = progress.inputs[i];
		}
	}

	for (let i = 0; i < progress.outputs.length; i++) {
		if (progress.outputs[i].type === 'video') {
			output_video = progress.outputs[i];
		} else if (progress.outputs[i].type === 'audio') {
			output_audio = progress.outputs[i];
		}
	}

	return (
		<Grid container>
			<Grid item xs={3}>
				<Typography variant="h4">
					<strong>
						<Duration seconds={progress.time} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Uptime</Trans>
				</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.bitrate} digits={2} minDigits={2} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>kbit/s</Trans>
				</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.q} digits={2} minDigits={2} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Quality</Trans>
				</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.speed} digits={2} minDigits={2} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Speed</Trans>
				</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography variant="h4">
					<strong>
						<Number value={!isNaN((props.drop * 100) / props.frames) || 0} digits={2} minDigits={2} />%
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Frame drops</Trans>
				</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.dup} digits={0} minDigits={0} />
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Dup. frames</Trans>
				</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.cpu} digits={2} minDigits={2} />%
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>CPU</Trans>
				</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography variant="h4">
					<strong>
						<Number value={progress.memory / 1024 / 1024} digits={0} minDigits={0} /> MB
					</strong>
				</Typography>
				<Typography variant="body2" gutterBottom>
					<Trans>Memory</Trans>
				</Typography>
			</Grid>
			{input_video || input_audio ? (
				<React.Fragment>
					<Grid item xs={12}>
						<Typography variant="body2" gutterBottom>
							<Trans>Inputs</Trans>
						</Typography>
					</Grid>
					{input_video && (
						<Grid item xs={12}>
							<IO progress={input_video}></IO>
						</Grid>
					)}
					{input_audio && (
						<Grid item xs={12}>
							<IO progress={input_audio}></IO>
						</Grid>
					)}
				</React.Fragment>
			) : (
				<Grid item xs={12}>
					<Typography variant="body2" gutterBottom>
						<Trans>No inputs</Trans>
					</Typography>
				</Grid>
			)}
			{output_video || output_audio ? (
				<React.Fragment>
					<Grid item xs={12}>
						<Typography variant="body2" gutterBottom>
							<Trans>Outputs</Trans>
						</Typography>
					</Grid>
					{output_video && (
						<Grid item xs={12}>
							<IO progress={output_video}></IO>
						</Grid>
					)}
					{output_audio && (
						<Grid item xs={12}>
							<IO progress={output_audio}></IO>
						</Grid>
					)}
				</React.Fragment>
			) : (
				<Grid item xs={12}>
					<Typography variant="body2" gutterBottom>
						<Trans>No outputs</Trans>
					</Typography>
				</Grid>
			)}
		</Grid>
	);
}

Progress.defaultProps = {
	time: 0,
	fps: 0,
	bitrate: 0,
	q: -1,
	speed: 0,
	drop: 0,
	dup: 0,
	frame: 0,
	cpu: 0,
	memory: 0,
};
