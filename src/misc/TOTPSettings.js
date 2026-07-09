import React from 'react';

import { Trans } from '@lingui/macro';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import QRCode from 'react-qr-code';

export default function TOTPSettings(props) {
	const [$status, setStatus] = React.useState({ enrolled: false, pending: false });
	const [$setup, setSetup] = React.useState(null);
	const [$confirmCode, setConfirmCode] = React.useState('');
	const [$disableCode, setDisableCode] = React.useState('');
	const [$showDisable, setShowDisable] = React.useState(false);
	const [$busy, setBusy] = React.useState(false);
	const [$error, setError] = React.useState('');

	const refreshStatus = React.useCallback(async () => {
		const status = await props.restreamer.TOTPStatus();
		if (status !== null) {
			setStatus(status);
		}
	}, [props.restreamer]);

	React.useEffect(() => {
		refreshStatus();
	}, [refreshStatus]);

	const handleSetup = async () => {
		setBusy(true);
		setError('');

		const setup = await props.restreamer.TOTPSetup();
		setBusy(false);

		if (setup === null) {
			setError('Failed to start TOTP setup');
			return;
		}

		setSetup(setup);
		await refreshStatus();
	};

	const handleEnable = async () => {
		setBusy(true);
		setError('');

		const ok = await props.restreamer.TOTPEnable($confirmCode);
		setBusy(false);

		if (ok === false) {
			setError('Failed to enable TOTP');
			return;
		}

		setSetup(null);
		setConfirmCode('');
		await refreshStatus();
	};

	const handleDisable = async () => {
		setBusy(true);
		setError('');

		const ok = await props.restreamer.TOTPDisable($disableCode);
		setBusy(false);

		if (ok === false) {
			setError('Failed to disable TOTP');
			return;
		}

		setDisableCode('');
		setShowDisable(false);
		setSetup(null);
		await refreshStatus();
	};

	const handleStartDisable = () => {
		setError('');
		setDisableCode('');
		setShowDisable(true);
	};

	const handleCancelDisable = () => {
		setError('');
		setDisableCode('');
		setShowDisable(false);
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography variant="h3">
					<Trans>Two-factor authentication (TOTP)</Trans>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="caption">
					<Trans>
						Optional authenticator-app protection for login. When enabled, a one-time code is required in addition to the password.
					</Trans>
				</Typography>
			</Grid>
			{$error.length > 0 && (
				<Grid item xs={12}>
					<Alert severity="error">{$error}</Alert>
				</Grid>
			)}
			{$status.enrolled === false && $setup === null && (
				<Grid item xs={12}>
					<Button variant="outlined" color="primary" onClick={handleSetup} disabled={$busy}>
						<Trans>Enable TOTP</Trans>
					</Button>
				</Grid>
			)}
			{$setup !== null && $status.enrolled === false && (
				<React.Fragment>
					<Grid item xs={12}>
						<Typography>
							<Trans>Scan the QR code with your authenticator app, or enter the secret manually, then confirm with a generated code.</Trans>
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Box
							sx={{
								display: 'inline-block',
								p: 2,
								bgcolor: 'background.paper',
								borderRadius: 1,
								border: 1,
								borderColor: 'divider',
							}}
						>
							<QRCode value={$setup.uri} size={200} />
						</Box>
					</Grid>
					<Grid item xs={12}>
						<TextField variant="outlined" fullWidth label={<Trans>Secret</Trans>} value={$setup.secret} InputProps={{ readOnly: true }} />
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							label={<Trans>Authenticator code</Trans>}
							value={$confirmCode}
							onChange={(event) => setConfirmCode(event.target.value)}
							inputProps={{ inputMode: 'numeric', autoComplete: 'one-time-code' }}
						/>
					</Grid>
					<Grid item xs={12}>
						<Button variant="outlined" color="primary" onClick={handleEnable} disabled={$busy || $confirmCode.length === 0}>
							<Trans>Confirm and enable</Trans>
						</Button>
					</Grid>
				</React.Fragment>
			)}
			{$status.enrolled === true && (
				<React.Fragment>
					<Grid item xs={12}>
						<Alert severity="success">
							<Trans>TOTP is enabled for this Restreamer instance.</Trans>
						</Alert>
					</Grid>
					{$showDisable === false && (
						<Grid item xs={12}>
							<Button variant="outlined" color="secondary" onClick={handleStartDisable} disabled={$busy}>
								<Trans>Disable TOTP</Trans>
							</Button>
						</Grid>
					)}
					{$showDisable === true && (
						<React.Fragment>
							<Grid item xs={12}>
								<Typography variant="caption">
									<Trans>Enter a code from your authenticator app to disable two-factor authentication.</Trans>
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									fullWidth
									label={<Trans>Authenticator code</Trans>}
									value={$disableCode}
									onChange={(event) => setDisableCode(event.target.value)}
									inputProps={{ inputMode: 'numeric', autoComplete: 'one-time-code' }}
									autoFocus
								/>
							</Grid>
							<Grid item xs={12}>
								<Stack direction="row" spacing={2}>
									<Button
										variant="outlined"
										color="secondary"
										onClick={handleDisable}
										disabled={$busy || $disableCode.length === 0}
									>
										<Trans>Confirm disable</Trans>
									</Button>
									<Button variant="text" color="primary" onClick={handleCancelDisable} disabled={$busy}>
										<Trans>Cancel</Trans>
									</Button>
								</Stack>
							</Grid>
						</React.Fragment>
					)}
				</React.Fragment>
			)}
		</Grid>
	);
}

TOTPSettings.defaultProps = {
	restreamer: null,
};
