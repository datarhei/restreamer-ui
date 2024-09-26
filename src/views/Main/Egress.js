import React from 'react';

import { Trans } from '@lingui/macro';
import makeStyles from '@mui/styles/makeStyles';
import DeviceUnknownIcon from '@mui/icons-material/DeviceUnknown';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Services from '../Publication/Services';

const useStyles = makeStyles((theme) => ({
	egressBar: {
		marginTop: '-.4em',
		marginBottom: '-.2em',
		'& .svg-inline--fa': {
			width: '1.4em',
			height: '1.4em',
		},
		'& .egress-icon': {
			height: '1.4em',
			paddingButton: '.1em',
		},
		'& .egress-left': {
			minHeight: 24,
			minWidth: 30,
			marginRight: 6,
			float: 'left',
			'& img': {
				maxWidth: 22,
				maxHeight: 22,
				marginBottom: '0!important',
			},
		},
		'& .egress-right-edit': {
			float: 'right',
			marginLeft: 5,
			marginTop: 2,
		},
		'& .egress-right-switch': {
			float: 'right',
			marginLeft: 5,
		},
		'& .egress-name': {
			float: 'left',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			maxWidth: '100%',
			fontSize: '.9rem',
		},
		'& .player-icon': {
			color: theme.palette.secondary.main,
			fontSize: '1.5rem',
		},
	},
}));

export default function Egress({
	service = '',
	name = '',
	state = 'disconnected',
	order = 'stop',
	reconnect = true,
	onEdit = function () {},
	onOrder = function (order) {},
}) {
	const classes = useStyles();
	const [$order, setOrder] = React.useState('stop');

	React.useEffect(() => {
		(async () => {
			await update();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const update = async () => {
		setOrder(order);
	};

	const handleSwitch = async (event) => {
		const checked = event.target.checked;

		const egrees_order = checked === true ? 'start' : 'stop';

		setOrder(egrees_order);

		let egress_onOrder = egrees_order;
		if (egrees_order === 'start' && $order === 'start') {
			egress_onOrder = 'restart';
		}

		const res = await onOrder(egress_onOrder);

		if (res === false) {
			setOrder(egrees_order === 'start' ? 'stop' : 'start');
		}
	};

	let egress_name = <Trans>Unknown</Trans>;
	let egress_icon = <DeviceUnknownIcon />;

	if (service === 'player') {
		egress_name = <Trans>Player</Trans>;
		egress_icon = <OndemandVideoIcon className="player-icon" />;
	} else {
		let s = Services.Get(service);
		if (s !== null) {
			const Icon = s.icon;

			egress_name = s.name;
			if (name && name.length !== 0) {
				egress_name = name;
			}

			egress_icon = <Icon />;
		}
	}

	let checked = order === 'start' ? true : false;
	if (reconnect === false) {
		if (state === 'error' || state === 'disconnected') {
			checked = false;
		}
	}

	let color = 'secondary';
	switch (state) {
		case 'disconnecting':
		case 'connecting':
			color = 'warning';
			break;
		case 'error':
		case 'disconnected':
			color = 'error';
			break;
		default:
			color = 'secondary';
			break;
	}

	return (
		<Grid container className={classes.egressBar}>
			<Grid item xs={12}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
					<Stack className="egress-left" direction="row" alignItems="center" spacing={0}>
						<IconButton size="small" className="egress-left">
							{egress_icon}
						</IconButton>
						<Typography className="egress-name">{egress_name}</Typography>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={0}>
						{service !== 'player' && (
							<Switch
								checked={checked}
								disabled={order !== $order}
								onChange={handleSwitch}
								color={color}
								size="small"
								className="egress-right-switch"
							/>
						)}
						<IconButton size="small" className="egress-right-edit" onClick={onEdit}>
							<EditIcon />
						</IconButton>
					</Stack>
				</Stack>
			</Grid>
		</Grid>
	);
}
