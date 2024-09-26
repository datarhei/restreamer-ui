import React from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';

const MenuProps = {
	PaperProps: {
		style: {
			width: 250,
		},
	},
};

export default function Component({
	variant = 'outlined',
	label = '',
	value = [],
	disabled = false,
	renderValue = (selected) => selected.join(', '),
	onChange = function (event) {},
	children = null,
}) {
	return (
		<FormControl variant={variant} disabled={disabled} fullWidth>
			<InputLabel>{label}</InputLabel>
			<Select multiple value={value} onChange={onChange} input={<OutlinedInput />} renderValue={renderValue} MenuProps={MenuProps}>
				{children}
			</Select>
		</FormControl>
	);
}
