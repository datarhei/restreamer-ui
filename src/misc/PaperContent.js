import React from 'react';

import Grid from '@mui/material/Grid';

const Component = function ({ spacing = 3, textAlign = 'left', children = null }) {
	return (
		<Grid container justifyContent="center" spacing={spacing} align={textAlign}>
			<Grid item xs={12}>
				{children}
			</Grid>
		</Grid>
	);
};

export default Component;
