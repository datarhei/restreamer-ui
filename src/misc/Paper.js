import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const useStyles = makeStyles((theme) => ({
	PaperM: {
		padding: '3em 3.5em 3em 3.5em!important',
	},
	PaperL: {
		padding: '4em 4.5em 4em 4.5em!important',
	},
	PaperService: {
		padding: '4em 4.5em 4em 4.5em!important',
		border: `1px solid ${theme.palette.background.light1}`,
		backgroundColor: theme.palette.service.contrastText,
	},
}));

const Component = React.forwardRef(
	(
		{
			xs = 12,
			sm = undefined,
			md = undefined,
			lg = undefined,
			elevation = 0,
			className = 'paper',
			style = null,
			marginBottom = '6em',
			tabIndex = 0,
			children = null,
		},
		ref,
	) => {
		const classes = useStyles();

		return (
			<Grid container justifyContent="center" spacing={1} style={{ marginBottom: marginBottom }}>
				<Grid item xs={xs} sm={sm} md={md} lg={lg}>
					<Paper className={classes[className]} elevation={elevation} ref={ref} tabIndex={tabIndex} style={style}>
						{children}
					</Paper>
				</Grid>
			</Grid>
		);
	},
);

export default Component;
