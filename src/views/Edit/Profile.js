import React from 'react';

import { Trans } from '@lingui/macro';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';

import * as M from '../../utils/metadata';
import BoxText from '../../misc/BoxText';
import EncodingSelect from '../../misc/EncodingSelect';
import PaperFooter from '../../misc/PaperFooter';
import ProbeModal from '../../misc/modals/Probe';
import SourceSelect from './SourceSelect';
import StreamSelect from './StreamSelect';

import FilterSelect from '../../misc/FilterSelect';

export default function Source(props) {
	const [$sources, setSources] = React.useState({
		video: M.initSource('video', props.sources[0]),
		audio: M.initSource('audio', props.sources[1]),
	});
	const [$profile, setProfile] = React.useState(M.initProfile(props.profile));
	const [$videoProbe, setVideoProbe] = React.useState({
		probing: false,
		log: [],
		modal: false,
		status: 'none',
	});
	const [$audioProbe, setAudioProbe] = React.useState({
		probing: false,
		log: [],
		modal: false,
		status: 'none',
	});
	const [$skillsRefresh, setSkillsRefresh] = React.useState(false);
	const [$modal, setModal] = React.useState({
		open: false,
		data: '',
	});
	const [$activeStep, setActiveStep] = React.useState(props.startWith === 'audio' ? 1 : 0);
	const [$ready, setReady] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			await load();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const load = async () => {
		// Add pseudo sources
		props.skills.sources.noaudio = [];

		let audio = $sources.audio;

		if ($profile.custom.selected === false) {
			if ($profile.custom.stream === -1) {
				audio.type = 'noaudio';
			} else {
				audio.type = 'videoaudio';
			}
		}

		let hasAudio = false;
		for (let i = 0; i < $sources.video.streams.length; i++) {
			if ($sources.video.streams[i].type === 'audio') {
				hasAudio = true;
				break;
			}
		}

		if (hasAudio === true) {
			props.skills.sources.videoaudio = [];
		} else {
			delete props.skills.sources.videoaudio;
		}

		setSources({
			...$sources,
			audio: audio,
		});

		setReady(true);
	};

	const handleNextStep = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBackStep = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleProbe = async (type, device, settings, inputs) => {
		if (type === 'video') {
			setVideoProbe({
				...$videoProbe,
				probing: true,
				status: 'none',
			});
		} else {
			setAudioProbe({
				...$audioProbe,
				probing: true,
				status: 'none',
			});
		}

		const res = await props.onProbe(inputs);

		let status = M.analyzeStreams(type, res.streams);

		if (type === 'video') {
			const profile = M.preselectProfile('video', res.streams, $profile, props.skills.encoders);

			// Add pseudo sources
			props.skills.sources.noaudio = [];

			let hasAudio = false;
			for (let i = 0; i < res.streams.length; i++) {
				if (res.streams[i].type === 'audio') {
					hasAudio = true;
					break;
				}
			}

			let audio = $sources.audio;

			if (hasAudio === true) {
				props.skills.sources.videoaudio = [];
				audio.type = 'videoaudio';
			} else {
				delete props.skills.sources.videoaudio;
				audio = M.initSource('audio', {});
			}

			setProfile({
				...$profile,
				...profile,
			});

			setVideoProbe({
				...$videoProbe,
				probing: false,
				log: res.log,
				status: status,
			});

			setAudioProbe({
				...$audioProbe,
				status: 'none',
			});

			setSources({
				...$sources,
				audio: audio,
				video: {
					type: device,
					settings: settings,
					inputs: inputs,
					streams: res.streams,
				},
			});
		} else {
			const profile = M.preselectProfile('audio', res.streams, $profile, props.skills.encoders);

			setProfile({
				...$profile,
				...profile,
			});

			setAudioProbe({
				...$audioProbe,
				probing: false,
				log: res.log,
				status: status,
			});

			setSources({
				...$sources,
				audio: {
					type: device,
					settings: settings,
					inputs: inputs,
					streams: res.streams,
				},
			});
		}

		return status === 'success';
	};

	const handleRefresh = async () => {
		setSkillsRefresh(true);
		await props.onRefresh();
		setSkillsRefresh(false);
	};

	const handleEncoding = (type) => (encoder, decoder) => {
		const profile = $profile[type];

		profile.encoder = encoder;
		profile.decoder = decoder;

		setProfile({
			...$profile,
			[type]: profile,
		});
	};

	const handleFilter = (type) => (filter) => {
		const profile = $profile[type];

		profile.filter = filter;

		setProfile({
			...$profile,
			[type]: profile,
		});
	};

	const handleDone = () => {
		const sources = M.cleanupSources($sources);
		const profile = M.cleanupProfile($profile);

		props.onDone(sources, profile);
	};

	const handleAbort = () => {
		props.onAbort();
	};

	const handleModal = (type) => (event) => {
		event.preventDefault();

		if (type === 'video') {
			setModal({
				...$modal,
				open: true,
				data: $videoProbe.log.join('\n'),
			});
		} else if (type === 'audio') {
			setModal({
				...$modal,
				open: true,
				data: $audioProbe.log.join('\n'),
			});
		} else {
			setModal({
				...$modal,
				open: false,
				data: '',
			});
		}
	};

	const handleSourceChange = (type, source) => {
		const profile = $profile[type];
		const custom = $profile.custom;

		if (type === 'audio') {
			if (source === 'noaudio') {
				custom.selected = false;
				custom.stream = -1;
				profile.stream = -1;
			} else if (source === 'videoaudio') {
				custom.selected = false;

				for (let i = 0; i < $sources.video.streams.length; i++) {
					if ($sources.video.streams[i].type === 'audio') {
						custom.stream = i;
						profile.stream = i;
						break;
					}
				}
			} else {
				custom.selected = true;
				custom.stream = -2;

				profile.stream = -1;
			}
		}

		setProfile({
			...$profile,
			[type]: profile,
			custom: custom,
		});
	};

	const handleSourceSettingsChange = (type, source, settings) => {
		if (type === 'video') {
			setVideoProbe({
				...$videoProbe,
				status: 'none',
			});
		} else {
			setAudioProbe({
				...$audioProbe,
				status: 'none',
			});
		}
	};

	const handleStreamSelect = (type) => (stream) => {
		const profile = $profile[type];

		profile.stream = stream;

		setProfile({
			...$profile,
			[type]: profile,
		});
	};

	if ($ready === false) {
		return null;
	}

	return (
		<React.Fragment>
			{$activeStep === 0 && (
				<React.Fragment>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h3">
								<Trans>Video settings</Trans>
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<SourceSelect
								type="video"
								skills={props.skills}
								source={$sources.video}
								config={props.config}
								onProbe={handleProbe}
								onChange={handleSourceSettingsChange}
								onRefresh={handleRefresh}
							/>
						</Grid>
						{$videoProbe.status !== 'none' && (
							<React.Fragment>
								{$videoProbe.status === 'error' && (
									<Grid item xs={12} align="center">
										<BoxText color="dark">
											<WarningIcon fontSize="large" color="error" />
											<Typography>
												<Trans>
													Failed to probe the source. Please check the{' '}
													<Link color="textSecondary" href="#!" onClick={handleModal('video')}>
														probe details
													</Link>
													.
												</Trans>
											</Typography>
										</BoxText>
									</Grid>
								)}
								{$videoProbe.status === 'nostream' && (
									<Grid item xs={12} align="center">
										<BoxText color="dark">
											<WarningIcon fontSize="large" color="error" />
											<Typography>
												<Trans>
													The source doesn't provide any video streams. Please check the{' '}
													<Link href="#!" onClick={handleModal('video')}>
														probe details
													</Link>
													.
												</Trans>
											</Typography>
										</BoxText>
									</Grid>
								)}
								{$videoProbe.status === 'success' && (
									<React.Fragment>
										<Grid item xs={12}>
											<StreamSelect
												type="video"
												streams={$sources.video.streams}
												selected={$profile.video.stream}
												onChange={handleStreamSelect('video')}
											/>
										</Grid>
										<Grid item xs={12} align="right">
											<Typography>
												<Trans>
													<Link href="#!" onClick={handleModal('video')}>
														Show probe details
													</Link>
												</Trans>
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<EncodingSelect
												type="video"
												streams={$sources.video.streams}
												profile={$profile.video}
												codecs={['copy', 'h264']}
												skills={props.skills}
												onChange={handleEncoding('video')}
											/>
										</Grid>
										{$profile.video.encoder.coder !== 'none' && $profile.video.encoder.coder !== 'copy' && (
											<Grid item xs={12}>
												<FilterSelect
													type="video"
													profile={$profile.video}
													availableFilters={props.skills.filter}
													onChange={handleFilter('video')}
												/>
											</Grid>
										)}
									</React.Fragment>
								)}
							</React.Fragment>
						)}
						<Grid item xs={12}>
							<Divider />
						</Grid>
					</Grid>
					<PaperFooter
						buttonsLeft={
							<React.Fragment>
								<Button variant="outlined" color="default" onClick={handleAbort}>
									<Trans>Abort</Trans>
								</Button>
								<Button variant="outlined" color="primary" disabled={$videoProbe.status !== 'success'} onClick={handleNextStep}>
									<Trans>Next: Audio</Trans>
								</Button>
							</React.Fragment>
						}
					/>
				</React.Fragment>
			)}
			{$activeStep === 1 && (
				<React.Fragment>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h3">
								<Trans>Audio settings</Trans>
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<SourceSelect
								type="audio"
								skills={props.skills}
								source={$sources.audio}
								config={props.config}
								onProbe={handleProbe}
								onSelect={handleSourceChange}
								onChange={handleSourceSettingsChange}
								onRefresh={handleRefresh}
							/>
						</Grid>
						{$profile.custom.selected === false && $profile.custom.stream >= 0 && (
							<React.Fragment>
								<Grid item xs={12}>
									<StreamSelect
										type="audio"
										streams={$sources.video.streams}
										selected={$profile.custom.stream}
										onChange={handleStreamSelect('audio')}
									/>
								</Grid>
								<Grid item xs={12}>
									<EncodingSelect
										type="audio"
										streams={$sources.video.streams}
										profile={$profile.audio}
										codecs={['copy', 'aac', 'mp3']}
										skills={props.skills}
										onChange={handleEncoding('audio')}
									/>
								</Grid>
								{$profile.audio.encoder.coder !== 'none' && $profile.audio.encoder.coder !== 'copy' && (
									<Grid item xs={12}>
										<FilterSelect
											type="audio"
											profile={$profile.audio}
											availableFilters={props.skills.filter}
											onChange={handleFilter('audio')}
										/>
									</Grid>
								)}
							</React.Fragment>
						)}
						{$profile.custom.selected === true && (
							<React.Fragment>
								{$audioProbe.status !== 'none' && (
									<React.Fragment>
										{$audioProbe.status === 'error' && (
											<Grid item xs={12} align="center">
												<BoxText color="dark">
													<WarningIcon fontSize="large" color="error" />
													<Typography>
														<Trans>
															Failed to probe the source. Please check the{' '}
															<Link href="#!" onClick={handleModal('audio')}>
																probe details
															</Link>
															.
														</Trans>
													</Typography>
												</BoxText>
											</Grid>
										)}
										{$audioProbe.status === 'nostream' && (
											<Grid item xs={12} align="center">
												<BoxText color="dark">
													<WarningIcon fontSize="large" color="error" />
													<Typography>
														<Trans>
															The source doesn't provide any audio streams. Please check the{' '}
															<Link href="#!" onClick={handleModal('audio')}>
																probe details
															</Link>
															.
														</Trans>
													</Typography>
												</BoxText>
											</Grid>
										)}
										{$audioProbe.status === 'success' && (
											<React.Fragment>
												<Grid item xs={12}>
													<StreamSelect
														type="audio"
														streams={$sources.audio.streams}
														selected={$profile.audio.stream}
														onChange={handleStreamSelect('audio')}
													/>
												</Grid>
												<Grid item xs={12} align="right">
													<Typography>
														<Trans>
															<Link href="#!" onClick={handleModal('audio')}>
																Show probe details
															</Link>
														</Trans>
													</Typography>
												</Grid>
												<Grid item xs={12}>
													<EncodingSelect
														type="audio"
														streams={$sources.audio.streams}
														profile={$profile.audio}
														codecs={['copy', 'aac', 'mp3']}
														skills={props.skills}
														onChange={handleEncoding('audio')}
													/>
												</Grid>
												{$profile.audio.encoder.coder !== 'none' && $profile.audio.encoder.coder !== 'copy' && (
													<Grid item xs={12}>
														<FilterSelect
															type="audio"
															profile={$profile.audio}
															availableFilters={props.skills.filter}
															onChange={handleFilter('audio')}
														/>
													</Grid>
												)}
											</React.Fragment>
										)}
									</React.Fragment>
								)}
							</React.Fragment>
						)}
						<Grid item xs={12}>
							<Divider />
						</Grid>
					</Grid>
					<PaperFooter
						buttonsLeft={
							<React.Fragment>
								<Button variant="outlined" onClick={handleBackStep}>
									<Trans>Back</Trans>
								</Button>
								<Button
									variant="outlined"
									color="primary"
									disabled={$profile.custom.selected === true && $audioProbe.status !== 'success'}
									onClick={handleDone}
								>
									<Trans>Finish</Trans>
								</Button>
							</React.Fragment>
						}
					/>
				</React.Fragment>
			)}
			<Backdrop open={$videoProbe.probing || $audioProbe.probing || $skillsRefresh}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<ProbeModal open={$modal.open} onClose={handleModal('none')} data={$modal.data} />
		</React.Fragment>
	);
}

Source.defaultProps = {
	skills: {},
	sources: [],
	profile: {},
	config: {},
	startWith: '',
	onDone: function (sources, profile) {},
	onAbort: function () {},
	onProbe: function (inputs) {
		return {
			streams: [],
			log: ['onProbe function not provided for this component'],
		};
	},
	onRefresh: function () {},
};
