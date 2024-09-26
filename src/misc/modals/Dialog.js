import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
	modalHeader: {
		marginBottom: '.7em',
		'& button': {
			float: 'right',
			marginLeft: '.5em',
		},
	},
	modalFooter: {
		marginTop: '1.2em',
		minHeight: '38px',
		'& button': {
			marginRight: '.5em',
		},
		'& div button': {
			float: 'right',
			marginRight: '0',
			marginLeft: '.5em',
		},
	},
	modalPaper: {
		padding: '1em 1.5em 1.3em 1.5em',
		width: '95%',
		maxWidth: 540,
		maxHeight: '95%',
		overflow: 'scroll',
		backgroundColor: theme.palette.background.modal,
		color: theme.palette.text.primary,
	},
}));

// todo: use MuiDialog

const Component = React.forwardRef(
	({ open = false, title = '', onClose = null, onHelp = null, buttonsRight = null, buttonsLeft = null, maxWidth = -1, children = null }, ref) => {
		const classes = useStyles();

		const paperStyle = {};

		if (maxWidth > 0) {
			paperStyle.maxWidth = maxWidth + 'px';
		}

		return (
			<Modal open={open} onClose={onClose} className="modal" disableScrollLock>
				<Paper className={classes.modalPaper} elevation={0} ref={ref} tabIndex={-1} style={paperStyle}>
					<Grid container spacing={0}>
						<Grid item xs={12} className={classes.modalHeader}>
							<Typography variant="button">{title}</Typography>
							{typeof onClose === 'function' && (
								<IconButton color="inherit" size="small" onClick={onClose}>
									<CloseIcon fontSize="small" />
								</IconButton>
							)}
							{typeof onHelp === 'function' && (
								<IconButton color="inherit" size="small" onClick={onHelp}>
									<HelpIcon fontSize="small" />
								</IconButton>
							)}
						</Grid>
					</Grid>
					<Grid item xs={12}>
						{children}
					</Grid>
					<Grid container spacing={0}>
						<Grid item xs={12} className={classes.modalFooter}>
							<div>{buttonsRight}</div>
							{buttonsLeft}
						</Grid>
					</Grid>
				</Paper>
			</Modal>
		);
	},
);

export default Component;
