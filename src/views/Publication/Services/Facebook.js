import React from 'react';
import { useParams } from 'react-router-dom';

import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { login as onLoginFacebook, logout as onLogoutFacebook } from '../../../services/facebook';

import Checkbox from '../../../misc/Checkbox';
import FormInlineButton from '../../../misc/FormInlineButton';

const id = 'facebook';
const name = 'Facebook Live';
const version = '1.0';
const stream_key_link = 'https://www.facebook.com/live/producer?ref=datarhei/restreamer';
const description = <Trans>Live-Streaming to Facebook Live RTMP service</Trans>;
const image_copyright = <Trans>More about licenses here</Trans>;
const author = {
	creator: {
		name: 'datarhei',
		link: 'https://github.com/datarhei',
	},
	maintainer: {
		name: 'datarhei',
		link: 'https://github.com/datarhei',
	},
};
const category = 'platform';
const requires = {
	protocols: ['rtmps'],
	formats: ['flv'],
	codecs: {
		audio: ['aac'],
		video: ['h264'],
	},
};

function ServiceIcon(props) {
	return <FontAwesomeIcon icon={faFacebook} style={{ color: '#2D88FF' }} {...props} />;
}

const ServiceLoginButton = ({ cbLogin, cbLogout, setAuthenticated, authenticated }) => {
	const { channelid } = useParams();
	const [snack, setSnack] = React.useState({
		open: false,
		message: '',
		severity: 'success',
	});
	const [loading, setLoading] = React.useState(false);

	const handleLoginFb = () => {
		setLoading(true);

		onLoginFacebook()
			.then(async (res) => {
				if (cbLogin) {
					await cbLogin(id, channelid, { oauth_fb_access_token: res?.accessToken, oauth_fb_user_id: res?.userId });
				}

				setAuthenticated(true);
				setLoading(false);
			})
			.catch((e) => {
				setSnack({ message: e.message || 'Login fail', severity: 'error', open: true });
				setLoading(false);
			});
	};

	const handleLogoutFb = () => {
		setLoading(true);

		setTimeout(() => {
			onLogoutFacebook()
				.then(async () => {
					if (cbLogout) await cbLogout(id, channelid);
					setAuthenticated(false);
					setLoading(false);
				})
				.catch(() => {
					setLoading(false);
				});
		}, [1000]);
	};

	const handleCloseSnack = () => {
		setSnack({ open: false, message: '', severity: 'success' });
	};

	if (authenticated) {
		return (
			<Button
				loading={loading}
				size="small"
				sx={[{ color: '#FFF', backgroundColor: '#747171d6', textTransform: 'capitalize' }, { '&:hover': { backgroundColor: '#747171d6' } }]}
				onClick={handleLogoutFb}
			>
				<Trans>Log out</Trans>
			</Button>
		);
	}

	return (
		<>
			<Button
				loading={loading}
				size="small"
				sx={[{ color: '#FFF', backgroundColor: '#4267B2', textTransform: 'capitalize' }, { '&:hover': { backgroundColor: '#4267B2' } }]}
				onClick={handleLoginFb}
			>
				<Trans>Login</Trans>
			</Button>
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={snack.open}
				autoHideDuration={3000}
				onClose={handleCloseSnack}
			>
				<Alert variant="filled" elevation={6} onClose={handleCloseSnack} severity={snack.severity}>
					{snack.message}
				</Alert>
			</Snackbar>
		</>
	);
};

function init(settings) {
	const initSettings = {
		stream_key_primary: '',
		stream_key_backup: '',
		rtmp_primary: true,
		rtmp_backup: false,
		...settings,
	};

	return initSettings;
}

function Service(props) {
	const { authenticated, setAuthenticated, channelId, restreamer } = props;
	const settings = init(props.settings);
	const [accountInfo, setAccountInfo] = React.useState({});
	const [livestream, setLivestream] = React.useState({});
	const [snack, setSnack] = React.useState({
		open: false,
		message: '',
		severity: 'success',
	});

	const handleCloseSnack = () => {
		setSnack({ open: false, message: '', severity: 'success' });
	};

	React.useEffect(() => {
		(async () => {
			if (!authenticated && restreamer?.CheckAuthFb) {
				const status = await restreamer.CheckAuthFb(channelId).catch(() => ({ is_authenticated: false }));

				if (authenticated !== !!status.is_authenticated) {
					setAuthenticated(!!status?.is_authenticated);
				}
			}
		})();
	}, []);

	React.useEffect(() => {
		if (authenticated && restreamer?.GetFBAccountInfo) {
			restreamer
				.GetFBAccountInfo(channelId)
				.then((info) => {
					setAccountInfo(info);
				})
				.catch((e) => {
					if (e?.details?.includes('fb_err_190')) {
						setSnack({ message: 'Phiên đăng nhập hết hạn', severity: 'error', open: true });
					}
				});
		}
	}, [authenticated]);

	const handleChange = (what) => (event) => {
		const value = event.target.value;

		if (['rtmp_primary', 'rtmp_backup'].includes(what)) {
			settings[what] = !settings[what];
		} else {
			settings[what] = value;
		}

		const output = createOutput(settings);

		props.onChange(output, settings);
	};

	const createOutput = (settings) => {
		const outputs = [];

		const output_primary = {
			address: 'rtmps://live-api-s.facebook.com:443/rtmp/' + settings.stream_key_primary,
			options: ['-f', 'flv'],
		};

		const output_backup = {
			address: 'rtmps://live-api-s.facebook.com:443/rtmp/' + settings.stream_key_backup,
			options: ['-f', 'flv'],
		};

		if (settings.stream_key_primary.length !== 0) {
			if (settings.rtmp_primary) {
				outputs.push(output_primary);
			}
		}

		if (settings.stream_key_backup.length !== 0) {
			if (settings.rtmp_backup) {
				outputs.push(output_backup);
			}
		}

		return outputs;
	};

	const handleCreateFbLiveStream = async (pageId) => {
		if (restreamer?.CreateFbLiveStream) {
			restreamer
				.CreateFbLiveStream(channelId, pageId)
				.then((live) => {
					setLivestream(live)
				})
				.catch((e) => {
					setSnack({ message: e.message || 'Không thể tạo livestream', severity: 'error', open: true });
				});
		}
	};

	if (authenticated) {
		if (!Array.isArray(accountInfo?.data) || accountInfo.data.length === 0) return null;

		if (livestream?.id) {
			return (<>
				<p>ID: {livestream.id}</p>
				<p>Stream URL: {livestream.stream_url}</p>
				<p>Secure Stream URL: {livestream.secure_stream_url}</p>
			</>)
		}

		return (
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<List sx={{ width: '100%' }}>
						{accountInfo.data.map((page) => (
							<ListItem
								dense
								key={page.id}
								sx={{ backgroundColor: '#FFF', marginBottom: 1, borderRadius: 1, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)', cursor: 'pointer' }}
								onClick={() => {
									handleCreateFbLiveStream(page.id);
								}}
							>
								<ListItemAvatar>
									<Avatar>
										<img src={page.picture?.data?.url} alt={page.name} />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary={<span style={{ color: '#313234', fontWeight: 'bold' }}>{page.name}</span>} />
							</ListItem>
						))}
					</List>
				</Grid>
				<Snackbar
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={snack.open}
					autoHideDuration={3000}
					onClose={handleCloseSnack}
				>
					<Alert variant="filled" elevation={6} onClose={handleCloseSnack} severity={snack.severity}>
						{snack.message}
					</Alert>
				</Snackbar>
			</Grid>
		);
	}

	return (
		<Grid container spacing={2}>
			{settings.rtmp_primary === true && (
				<Grid item xs={12} md={9}>
					<TextField
						variant="outlined"
						fullWidth
						label={<Trans>Primary stream key</Trans>}
						value={settings.stream_key_primary}
						onChange={handleChange('stream_key_primary')}
					/>
				</Grid>
			)}
			{settings.rtmp_primary === true && (
				<Grid item xs={12} md={3}>
					<FormInlineButton target="blank" href={stream_key_link} component="a">
						<Trans>GET</Trans>
					</FormInlineButton>
				</Grid>
			)}
			{settings.rtmp_backup === true && (
				<Grid item xs={12} md={9}>
					<TextField
						variant="outlined"
						fullWidth
						label={<Trans>Backup stream key</Trans>}
						value={settings.stream_key_backup}
						onChange={handleChange('stream_key_backup')}
					/>
				</Grid>
			)}
			{settings.rtmp_backup === true && (
				<Grid item xs={12} md={3}>
					<FormInlineButton target="blank" href={stream_key_link} component="a">
						<Trans>GET</Trans>
					</FormInlineButton>
				</Grid>
			)}
			<Grid item xs={12}>
				<Checkbox label={<Trans>Enable primary stream</Trans>} checked={settings.rtmp_primary} onChange={handleChange('rtmp_primary')} />
				<Checkbox label={<Trans>Enable backup stream</Trans>} checked={settings.rtmp_backup} onChange={handleChange('rtmp_backup')} />
			</Grid>
		</Grid>
	);
}

Service.defaultProps = {
	settings: {},
	skills: {},
	metadata: {},
	streams: [],
	onChange: function (output, settings) {},
};

export {
	id,
	name,
	version,
	stream_key_link,
	description,
	image_copyright,
	author,
	category,
	requires,
	ServiceIcon as icon,
	Service as component,
	ServiceLoginButton as loginButton,
};
