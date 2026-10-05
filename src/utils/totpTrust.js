import * as Storage from './storage';

const KEY_PREFIX = 'totp-trust';

function storageKey(address, username) {
	return `${KEY_PREFIX}:${address}:${username}`;
}

function trustDurationMs(rememberDevice) {
	if (rememberDevice === '1y') {
		return 365 * 24 * 60 * 60 * 1000;
	}

	return 30 * 24 * 60 * 60 * 1000;
}

export function getToken(address, username) {
	if (!address || !username) {
		return null;
	}

	const raw = Storage.Get(storageKey(address, username));
	if (raw === null) {
		return null;
	}

	try {
		const data = JSON.parse(raw);
		if (!data.token || !data.expires_at) {
			Storage.Remove(storageKey(address, username));
			return null;
		}

		if (Date.now() >= data.expires_at) {
			Storage.Remove(storageKey(address, username));
			return null;
		}

		return data.token;
	} catch (e) {
		Storage.Remove(storageKey(address, username));
		return null;
	}
}

export function setToken(address, username, token, rememberDevice) {
	if (!address || !username || !token || !rememberDevice) {
		return;
	}

	Storage.Set(
		storageKey(address, username),
		JSON.stringify({
			token: token,
			expires_at: Date.now() + trustDurationMs(rememberDevice),
			remember: rememberDevice,
		})
	);
}

export function clearToken(address, username) {
	if (!address || !username) {
		return;
	}

	Storage.Remove(storageKey(address, username));
}
