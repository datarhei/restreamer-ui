import React from 'react';
import ReactDOM from 'react-dom';

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import '@fontsource/dosis';
import '@fontsource/roboto';
import CssBaseline from '@mui/material/CssBaseline';

import fbSDK from './utils/fbSDK';

import theme from './theme';
import RestreamerUI from './RestreamerUI';

let address = window.location.protocol + '//' + window.location.host;
// let address = 'http://127.0.0.1:8080';

const urlParams = new URLSearchParams(window.location.search.substring(1));
if (urlParams.has('address') === true) {
	address = urlParams.get('address');
}

fbSDK().then(() => {
	ReactDOM.render(
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<RestreamerUI address={address} />
			</ThemeProvider>
		</StyledEngineProvider>,
		document.getElementById('root')
	);
});
