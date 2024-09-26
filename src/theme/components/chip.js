/* eslint-disable import/no-anonymous-default-export */
import base from '../base';

const root = {
	textAlign: 'center',
	textTransform: 'uppercase',
	userSelect: 'none',
};

const outlined = {
	base: {
		borderRadius: 4,
		border: 'unset',
		height: 'auto',
		'& .MuiChip-label': {
			padding: '.1em .7em .1em .7em',
			margin: 0,
			fontSize: '.9rem',
		},
		marginRight: '.5em',
	},
	primary: {
		color: base.palette.text.primary,
		backgroundColor: base.palette.background.box_default,
	},
};

export default {
	styleOverrides: {
		root: { ...root },
		outlined: { ...outlined.base },
		outlinedPrimary: { ...outlined.primary },
	},
};
