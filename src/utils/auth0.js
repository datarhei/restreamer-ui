import { Auth0Client } from '@auth0/auth0-spa-js';
import * as Storage from './storage';

let client = null;

let isAvailable = false;

try {
	new Auth0Client({
		domain: 'example.eu.auth0.com',
		clientId: 'some_client_id',
		audience: 'https://example.com/',
		cacheLocation: 'memory',
	});

	isAvailable = true;
} catch (e) {
	isAvailable = false;
}

const canUseAuth0 = () => {
	return isAvailable;
};

const setConfig = (config) => {
	Storage.Set(
		'auth0',
		JSON.stringify({
			domain: '',
			client_id: '',
			audience: '',
			redirect_uri: window.location.origin,
			...config,
		})
	);
};

const getConfig = () => {
	let config = {
		domain: '',
		client_id: '',
		audience: '',
		redirect_uri: window.location.origin,
	};

	const data = Storage.Get('auth0');
	if (data === null) {
		return config;
	}

	try {
		let parsedConfig = JSON.parse(data);

		config = {
			...config,
			...parsedConfig,
		};
	} catch (e) {}

	return config;
};

const init = () => {
	if (canUseAuth0() === false) {
		return false;
	}

	const config = getConfig();

	if (config.domain.length === 0 || config.client_id.length === 0 || config.audience.length === 0) {
		return false;
	}

	try {
		client = new Auth0Client({
			domain: config.domain,
			clientId: config.client_id,
			cacheLocation: 'localstorage',
		});
	} catch (e) {
		return false;
	}

	return true;
};

const handleRedirectCallback = async () => {
	if (client === null) {
		return {
			initialized: false,
		};
	}

	const urlParams = new URLSearchParams(window.location.search.substring(1));
	if (urlParams.has('error')) {
		return {
			initialized: true,
			error: true,
			description: urlParams.has('error_description') ? urlParams.get('error_description') : 'unknown error',
		};
	}

	if (urlParams.has('code') && urlParams.has('state')) {
		try {
			await client.handleRedirectCallback();
		} catch (e) {
			return {
				initialized: true,
				error: true,
				description: e.message,
			};
		}

		urlParams.delete('code');
		urlParams.delete('state');

		let hash = urlParams.get('hash');
		urlParams.delete('hash');

		let href = window.location.origin + window.location.pathname + '?' + urlParams.toString();
		if (hash !== null) {
			href += '#' + hash;
		}

		window.location.href = href;
	}

	return {
		initialized: true,
		error: false,
	};
};

const login = async (queryParams) => {
	if (client === null) {
		return false;
	}

	const config = {
		redirect_uri: window.location.origin,
		...getConfig(),
	};

    let queryString = [];
    for (let key in queryParams) {
        if (queryParams[key]) {
            queryString.push(`${key}=${queryParams[key]}`); // No encoding for keys or values
        }
    }
    if (queryString) {
        try {
            const url = new URL(config.redirect_uri);
            url.search = url.search ? `${url.search}&${queryString}` : queryString;
            config.redirect_uri = url.href;
        } catch (e) {
            console.error('Error constructing redirect URI:', e);
        }
    }

    const options = {
        authorizationParams: {
            redirect_uri: config.redirect_uri,
            scope: 'openid profile email',
			audience: config.audience
        }
    };

	try {
		await client.loginWithRedirect(options);
	} catch (e) {
		return false;
	}

	return true;
};

const logout = async () => {
	if (client === null) {
		return;
	}

	await client.logout({
		returnTo: window.location.href,
		localOnly: true,
	});
};

const getToken = async () => {
	let token = '';

	if (client === null) {
		return token;
	}

	const config = {
		...getConfig(),
	};
    const options = {
        authorizationParams: {
            scope: config.scope,
			audience: config.audience
        }
    };

	try {
		token = await client.getTokenSilently(options);
	} catch (error) {
		console.error(error);
	}

	return token;
};

const isAuthenticated = async () => {
	if (client === null) {
		return false;
	}

	return await client.isAuthenticated();
};

export { canUseAuth0, setConfig, getConfig, init, login, logout, isAuthenticated, getToken, handleRedirectCallback };
