import React from 'react';

import { Trans } from '@lingui/macro';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Paper from '../misc/Paper';
import Password from '../misc/Password';
import PaperHeader from '../misc/PaperHeader';
import PaperContent from '../misc/PaperContent';
import PaperFooter from '../misc/PaperFooter';

const generatePassword = (length) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	let password = '';
	for (let i = 0; i < length; i++) {
		password += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return password;
};

export default function ResetPassword(props) {
	const [$login, setLogin] = React.useState({
		username: 'admin',
		password: generatePassword(6) + '-' + generatePassword(6) + '-' + generatePassword(6),
		passwordConfirm: '',
		showPassword: true,
		memorized: false,
	});
	const [$restart, setRestart] = React.useState({
		restarting: false,
		timeout: false,
	});

	const handleReset = async (event) => {
		event.preventDefault();

		setRestart({
			...$restart,
			restarting: true,
			timeout: false,
		});

		const res = await props.onReset($login.username, $login.password);
		switch (res) {
			case 'ERROR':
				setRestart({
					...$restart,
					restarting: false,
				});
				break;
			case 'TIMEOUT':
				setRestart({
					...$restart,
					restarting: true,
					timeout: true,
				});
				break;
			default:
		}
	};

	const handleChange = (what) => (event) => {
		let value = event.target.value;

		setLogin({
			...$login,
			[what]: value,
		});
	};

	const invalid = $login.username.length === 0 || $login.password.length === 0 || ($login.password !== $login.passwordConfirm);

	return (
		<Paper xs={12} sm={10} md={6} className="PaperL">
			<Grid container spacing={3}>
				<Grid item xs={12} align="center">
					<Typography variant="h1">
						<Trans>User registration</Trans>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<form noValidate>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									fullWidth
									id="username"
									label={<Trans>Enter username</Trans>}
									value={$login.username}
									onChange={handleChange('username')}
									autoComplete="username"
								/>
							</Grid>
							<Grid item xs={12}>
								<Password
									value={$login.password}
									id="password"
									label={<Trans>Enter password</Trans>}
									onChange={handleChange('password')}
									show={$login.showPassword}
									autoComplete="current-password"
								/>
							</Grid>
							<Grid item xs={12}>
								<Password
									value={$login.passwordConfirm}
									id="password_confirm"
									label={<Trans>Confirm password</Trans>}
									onChange={handleChange('passwordConfirm')}
									show={$login.showPassword}
								/>
							</Grid>
							<Grid item xs={12}>
								<Divider />
							</Grid>
							<Grid item xs={12}>
								<Button variant="outlined" color="primary" fullWidth size="large" disabled={invalid} type="submit" onClick={handleReset}>
									<Trans>Create user</Trans>
								</Button>
							</Grid>
						</Grid>
					</form>
				</Grid>
			</Grid>
			<Backdrop open={$restart.restarting}>
				<Paper xs={12} sm={4} md={3}>
					<PaperHeader title={<Trans>Restarting</Trans>} />
					<PaperContent>
						{$restart.timeout === false ? (
							<React.Fragment>
								<Typography variant="body1">
									<Trans>Restarting Restreamer Core ...</Trans>
								</Typography>
								<LinearProgress sx={{ mt: '1em' }} />
							</React.Fragment>
						) : (
							<React.Fragment>
								<Typography variant="body1">
									<Trans>Reconnecting to Restreamer Core failed.</Trans>
								</Typography>
								<Typography variant="body1" sx={{ mt: '1em' }}>
									<Trans>This is not necessarily an error. However, it may take a bit longer for Restreamer Core to restart..</Trans>
								</Typography>
							</React.Fragment>
						)}
					</PaperContent>
					<PaperFooter
						buttonsRight={
							<Button variant="outlined" color="primary" disabled={!$restart.timeout} onClick={() => window.location.reload()}>
								<Trans>Reload</Trans>
							</Button>
						}
					/>
				</Paper>
			</Backdrop>
		</Paper>
	);
}

ResetPassword.defaultProps = {
	onReset: function (username, password) {},
};
