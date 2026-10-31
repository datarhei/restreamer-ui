import React from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import '@fontsource/dosis';
import '@fontsource/roboto';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme';
import RestreamerUI from './RestreamerUI';

const ENV_ADDRESS = process.env.REACT_APP_RESTREAMER_ADDRESS;

let address = window.location.protocol + '//' + window.location.host;
if (window.location.pathname.endsWith('/ui/')) {
	address += window.location.pathname.replace(/ui\/$/, '');
}

// Override with env var if provided at build-time
if (ENV_ADDRESS && ENV_ADDRESS.length > 0) {
	address = ENV_ADDRESS;
}

const urlParams = new URLSearchParams(window.location.search.substring(1));
if (urlParams.has('address') === true) {
	address = urlParams.get('address');
}

createRoot(document.getElementById('root')).render(
	<StyledEngineProvider injectFirst>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<RestreamerUI address={address} />
		</ThemeProvider>
	</StyledEngineProvider>
);
