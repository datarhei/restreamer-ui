import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import CardMedia from '@mui/material/CardMedia';

const useStyles = makeStyles((theme) => ({
	media: {
		paddingTop: '39.25%',
		borderRadius: 4,
	},
}));

export default function Component({ image = '', title = '', height = '0px' }) {
	const classes = useStyles();

	return <CardMedia className={classes.media} style={{ height: height }} image={image} title={title} />;
}
