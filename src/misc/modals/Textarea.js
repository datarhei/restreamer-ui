import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';

import ModalContent from '../ModalContent';
import Textarea from '../Textarea';

const useStyles = makeStyles((theme) => ({
	box: {
		backgroundColor: theme.palette.background.modalbox,
		borderRadius: 4,
		padding: '0em 1em 1em 1em',
	},
}));

const Component = function ({
	open = false,
	title = '',
	value = '',
	rows = 0,
	scrollTo = 'bottom',
	readOnly = true,
	allowCopy = true,
	onClose = null,
	onHelp = null,
}) {
	const classes = useStyles();

	return (
		<Modal open={open} onClose={onClose} className="modal">
			<ModalContent title={title} onClose={onClose} onHelp={onHelp} style={{ overflow: 'hidden' }}>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Stack direction="column" justifyContent="center" alignItems="center" spacing={1} className={classes.box}>
							<Textarea value={value} rows={rows} scrollTo={scrollTo} readOnly={readOnly} allowCopy={allowCopy} />
						</Stack>
					</Grid>
				</Grid>
			</ModalContent>
		</Modal>
	);
};

export default Component;
