import React from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Env from './Env';

export default function Password({
	id = 'password',
	label = '',
	value = '',
	disabled = false,
	autoComplete = 'current-password',
	env = false,
	show = false,
	helperText = false,
	inputProps = {},
	error = false,
	onChange = function (value) {},
}) {
	const [$visible, setVisible] = React.useState(show);

	const handleClickShowPassword = () => {
		setVisible(!$visible);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	let adornment = (
		<InputAdornment position="end">
			<IconButton edge="end" size="large">
				<VisibilityOff />
			</IconButton>
			{env ? <Env /> : null}
		</InputAdornment>
	);

	if (disabled === false) {
		adornment = (
			<InputAdornment position="end">
				<IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" size="large">
					{$visible ? <Visibility /> : <VisibilityOff />}
				</IconButton>
				{env ? <Env /> : null}
			</InputAdornment>
		);
	}

	return (
		<FormControl variant="outlined" disabled={disabled} fullWidth>
			<InputLabel htmlFor={id}>{label}</InputLabel>
			<OutlinedInput
				id={id}
				type={$visible && !disabled ? 'text' : 'password'}
				value={value}
				onChange={onChange}
				endAdornment={adornment}
				label={label}
				autoComplete={autoComplete}
				inputProps={inputProps}
				error={error}
			/>
			{helperText && <FormHelperText>{helperText}</FormHelperText>}
		</FormControl>
	);
}
