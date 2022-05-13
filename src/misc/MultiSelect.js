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

export default function Component(props) {
	return (
		<FormControl variant="outlined" fullWidth>
			<InputLabel>{props.label}</InputLabel>
			<Select
				multiple
				value={props.value}
				onChange={props.onChange}
				input={<OutlinedInput />}
				renderValue={(selected) => selected.join(', ')}
				MenuProps={MenuProps}
			>
				{props.children}
			</Select>
		</FormControl>
	);
}

Component.defaultProps = {
	label: '',
	value: [],
	onChange: function (event) {},
};
