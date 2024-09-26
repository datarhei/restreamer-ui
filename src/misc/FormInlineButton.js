import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';

const useStyles = makeStyles((theme) => ({
	button: {
		fontSize: '.9rem!important',
		height: '56px!important',
	},
}));
// component="label" variant={variant} color={color} disabled={disabled}
// onClick disabled
// target="blank" href={stream_key_link} component="a"
export default function Component({
	component = 'label',
	variant = 'outlined',
	size = 'large',
	color = 'primary',
	disabled = false,
	target = 'blank',
	href = '#',
	className = null,
	onClick = () => {},
	children = null,
}) {
	const classes = useStyles();

	return (
		<Button
			component={component}
			variant={variant}
			size={size}
			disabled={disabled}
			fullWidth
			color={color}
			className={className ? className : classes.button}
			target={target}
			href={href}
			onClick={onClick}
		>
			{children}
		</Button>
	);
}
