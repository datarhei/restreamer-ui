import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import theme from '../theme';
import I18n from '../I18n';

const AllTheProviders = ({ children }) => {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<I18n>{children}</I18n>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
