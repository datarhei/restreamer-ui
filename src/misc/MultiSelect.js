import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const MenuProps = {
	PaperProps: {
		style: {
			width: 250,
		},
	},
};

const useStyles = makeStyles((theme) => ({
	root: {
		fontWeight: 'bold',
		backgroundColor: theme.palette.background.dark1,
	},
}));

export default function Component({
	variant = 'outlined',
	label = '',
	value = [],
	disabled = false,
	renderValue = (selected) => selected.join(', '),
	onChange = function (event) {},
	items = [],
}) {
	const classes = useStyles();

	return (
		<FormControl variant={variant} disabled={disabled} fullWidth>
			<InputLabel>{label}</InputLabel>
			<Select multiple value={value} onChange={onChange} input={<OutlinedInput label={label} />} renderValue={renderValue} MenuProps={MenuProps}>
				{items.map((item) => {
					if (!('key' in item)) {
						item.key = item.value;
					}
					if (!('name' in item)) {
						item.name = item.value;
					}
					return (
						<MenuItem key={item.key} value={item.value} className={item.selected ? classes.root : ''}>
							{item.name}
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
}
