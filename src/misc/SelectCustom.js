import React from 'react';

import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

function isCustomOption(value, options) {
	for (let o of options) {
		if (o.value === value) {
			return false;
		}
	}

	return true;
}

export default function Component({
	variant = 'outlined',
	label = '',
	value = '',
	disabled = false,
	customKey = 'custom',
	customLabel = '',
	allowCustom = false,
	options = [],
	onChange = function (event) {},
}) {
	const [$value, setValue] = React.useState({
		value: value,
		isCustom: isCustomOption(value, options),
		custom: isCustomOption(value, options) === true ? value : '',
	});

	const handleChange = (event) => {
		const v = event.target.value;

		const value = $value;

		value.isCustom = v === customKey ? true : false;
		if (value.isCustom === true) {
			value.custom = value.value;
		}
		value.value = v;

		setValue({
			...$value,
			value: v,
			isCustom: v === customKey ? true : false,
		});

		onChange({
			target: {
				value: v === customKey ? value.custom : value.value,
			},
		});
	};

	const handleCustomChange = (event) => {
		setValue({
			...$value,
			custom: event.target.value,
		});

		onChange(event);
	};

	const selectOptions = [];

	for (let o of options) {
		selectOptions.push(
			<MenuItem key={o.value} value={o.value} disabled={o.disabled === true}>
				{o.label}
			</MenuItem>,
		);
	}

	return (
		<Grid container spacing={2}>
			{allowCustom === true ? (
				<React.Fragment>
					{$value.isCustom === true ? (
						<React.Fragment>
							<Grid item xs={6}>
								<FormControl variant={variant} fullWidth>
									<InputLabel>{label}</InputLabel>
									<Select
										value={$value.isCustom === false ? $value.value : customKey}
										onChange={handleChange}
										disabled={disabled}
										label={label}
									>
										{selectOptions}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<TextField
									variant={variant}
									fullWidth
									disabled={disabled === true || $value.isCustom === false}
									label={customLabel ? customLabel : label}
									value={$value.custom}
									onChange={handleCustomChange}
								/>
							</Grid>
						</React.Fragment>
					) : (
						<Grid item xs={12}>
							<FormControl variant={variant} fullWidth>
								<InputLabel>{label}</InputLabel>
								<Select value={$value.isCustom === false ? $value.value : customKey} onChange={handleChange} disabled={disabled} label={label}>
									{selectOptions}
								</Select>
							</FormControl>
						</Grid>
					)}
				</React.Fragment>
			) : (
				<Grid item xs={12}>
					<FormControl variant={variant} fullWidth>
						<InputLabel>{label}</InputLabel>
						<Select value={$value.value} onChange={handleChange} disabled={disabled} label={label}>
							{selectOptions}
						</Select>
					</FormControl>
				</Grid>
			)}
		</Grid>
	);
}
