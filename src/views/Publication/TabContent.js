import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
	serviceIcon: {
		fontSize: '4rem!important',
		maxHeight: 64,
		marginTop: '-0.065em',
	},
	serviceName: {
		marginTop: '-.2rem',
	},
}));

export default function TabContent(props) {
	const classes = useStyles();

	const renderVersionInfo = (version, loginButton) => {
		const LoginButton = loginButton;

		if (!loginButton) {
			return <Typography>v{props.service.version}</Typography>;
		}

		return (
			<Stack sx={{ width: '100%' }} direction="row" justifyContent="space-between" alignItems="center">
				<Typography>v{props.service.version}</Typography>
				<LoginButton cbLogin={props.cbLogin} cbLogout={props.cbLogout} authenticated={props.authenticated} setAuthenticated={props.setAuthenticated} />
			</Stack>
		);
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Stack sx={{ width: '100%' }} direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
					<props.service.icon className={classes.serviceIcon} />
					<Stack sx={{ width: '100%' }} direction="column" justifyContent="center" alignItems="flex-start" spacing={0}>
						<Typography variant="h1" className={classes.serviceName}>
							{props.service.name}
						</Typography>
						{renderVersionInfo(props.service.version, props.service.loginButton)}
					</Stack>
				</Stack>
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
			{props.children}
		</Grid>
	);
}

TabContent.defaultProps = {
	service: null,
};

TabContent.propTypes = {
	service: PropTypes.object.isRequired,
};
