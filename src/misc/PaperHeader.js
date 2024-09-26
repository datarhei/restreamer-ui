import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
	root: {
		marginBottom: '.3em',
		'& button': {
			float: 'right',
			marginLeft: '.5em',
		},
	},
}));

const Component = function ({ spacing = 0, padding = null, title = '', variant = 'pagetitle', onAbort = null, onHelp = null, onEdit = null, onAdd = null }) {
	const classes = useStyles();

	return (
		<Grid container spacing={spacing} padding={padding}>
			<Grid item xs={12} className={classes.root}>
				{typeof onAbort === 'function' && (
					<IconButton color="inherit" size="small" onClick={onAbort}>
						<CloseIcon />
					</IconButton>
				)}
				{typeof onEdit === 'function' && (
					<IconButton color="inherit" size="small" onClick={onEdit}>
						<EditIcon />
					</IconButton>
				)}
				{typeof onAdd === 'function' && (
					<IconButton color="inherit" size="small" onClick={onAdd}>
						<AddIcon />
					</IconButton>
				)}
				{typeof onHelp === 'function' && (
					<IconButton color="inherit" size="small" onClick={onHelp}>
						<HelpIcon />
					</IconButton>
				)}
				<Typography variant={variant}>{title}</Typography>
			</Grid>
		</Grid>
	);
};

export default Component;
