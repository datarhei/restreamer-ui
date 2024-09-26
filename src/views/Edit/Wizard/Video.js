import React from 'react';

import { Trans } from '@lingui/macro';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';

import BoxText from '../../../misc/BoxText';

import Paper from '../../../misc/Paper';
import PaperHeader from '../../../misc/PaperHeader';

export default function Video({
	onAbort = () => {},
	onHelp = () => {},
	onBack = () => {},
	onNext = () => {},
	sourceid = '',
	status = '',
	ready = false,
	children = null,
}) {
	return (
		<Paper xs={12} sm={9} md={6} marginBottom="6em" className="PaperM">
			<PaperHeader spacing={2} variant="h1" title={<Trans>Video setup</Trans>} onAbort={onAbort} onHelp={onHelp} />
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				{children}
				<Grid item xs={12}>
					{status === 'error' && (
						<BoxText color="dark">
							<WarningIcon fontSize="large" color="error" />
							<Typography textAlign="center">
								{sourceid === 'rtmp' || sourceid === 'hls' ? (
									<Trans>No live stream was detected. Please check the software that sends the stream.</Trans>
								) : (
									<Trans>Failed to verify the source. Please check the address.</Trans>
								)}
							</Typography>
						</BoxText>
					)}
					{status === 'nostream' && (
						<BoxText color="dark">
							<WarningIcon fontSize="large" color="error" />
							<Typography textAlign="center">
								<Trans>The source doesn't provide any video streams. Please check the device.</Trans>
							</Typography>
						</BoxText>
					)}
					{status === 'nocoder' && (
						<BoxText color="dark">
							<WarningIcon fontSize="large" color="error" />
							<Typography textAlign="center">
								<Trans>
									The source doesn't provide any compatible video streams. Please check the{' '}
									<Link color="secondary" target="_blank" href="https://github.com/datarhei/restreamer">
										requirements
									</Link>
									.
								</Trans>
							</Typography>
						</BoxText>
					)}
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={3}>
					<Button variant="outlined" color="default" fullWidth onClick={onBack}>
						<Trans>Back</Trans>
					</Button>
				</Grid>
				<Grid item xs={9}>
					<Button variant="outlined" fullWidth color="primary" disabled={!ready} onClick={onNext}>
						<Trans>Next</Trans>
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
}
