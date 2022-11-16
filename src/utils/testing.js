import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { HashRouter as DOMRouter } from 'react-router-dom';
import theme from '../theme';
import I18n from '../I18n';

/*
This is wrapper for the render method in order to provide all required providers and
not to repeat them for each test.

If you want to debug a test by having a look at the current output of the component,
simply import the "screen" object from this file and use the "debug()" method:

    test('displays the header and paragraph text', () => {
        render(<Travel />)
        screen.debug()
    })

or of a specific element in the component:

    test('displays the header and paragraph text', () => {
        render(<Travel />)
        const header = screen.getByRole('heading', { name: /travel anywhere/i })
        screen.debug(header)
    })

More about "render" and "screen" on https://testing-library.com/docs

For testing certain conditions, check out https://jestjs.io/docs/expect and for
running tests, check out https://jestjs.io/docs/api.
*/

const AllTheProviders = ({ children }) => {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<I18n>
					<DOMRouter>{children}</DOMRouter>
				</I18n>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
