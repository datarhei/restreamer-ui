import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles((theme) => ({
	root: {
		fontWeight: 'bold',
		backgroundColor: theme.palette.background.dark1,
	},
}));

const Component = React.forwardRef(({ key = '', name = '', value = '', selected = false }, ref) => {
	const classes = useStyles();

	return (
		<MenuItem key={key} value={value} className={selected ? classes.root : ''} ref={ref}>
			{name}
		</MenuItem>
	);
});

export default Component;
