import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function Component({ color = 'inherit', value = -1 }) {
	if (value < 0) {
		return <CircularProgress color={color} />;
	}

	return (
		<Box sx={{ position: 'relative', display: 'inline-flex' }}>
			<CircularProgress variant="determinate" value={value} color={color} />
			<Box
				sx={{
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					position: 'absolute',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Typography component="div" sx={{ color: 'text.secondary' }}>
					{`${Math.round(value)}%`}
				</Typography>
			</Box>
		</Box>
	);
}
