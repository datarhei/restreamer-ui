import React from 'react';

import { Trans } from '@lingui/macro';
import Button from '@mui/material/Button';

export default function ActionButton({
	order = 'stop',
	state = 'disconnected',
	reconnect = -1,
	disabled = false,
	onDisconnect = function () {},
	onConnect = function () {},
	onReconnect = function () {},
}) {
	let button = null;

	if (state === 'connecting') {
		button = (
			<Button variant="outlined" fullWidth disabled>
				<Trans>Connecting ...</Trans>
			</Button>
		);
	} else if (state === 'disconnecting') {
		button = (
			<Button variant="outlined" fullWidth disabled>
				<Trans>Disconnecting ...</Trans>
			</Button>
		);
	} else if (state === 'connected') {
		button = (
			<Button variant="outlined" fullWidth color="secondary" disabled={disabled} onClick={onDisconnect}>
				<Trans>Disconnect</Trans>
			</Button>
		);
	} else if (state === 'disconnected') {
		if (reconnect < 0) {
			if (order === 'start') {
				button = (
					<Button variant="outlined" fullWidth color="primary" disabled={disabled} onClick={onReconnect}>
						<Trans>Reconnect</Trans>
					</Button>
				);
			} else {
				button = (
					<Button variant="outlined" fullWidth color="primary" disabled={disabled} onClick={onConnect}>
						<Trans>Connect</Trans>
					</Button>
				);
			}
		} else {
			button = (
				<Button variant="outlined" fullWidth color="secondary" disabled={disabled} onClick={onDisconnect}>
					<Trans>Disconnect</Trans>
				</Button>
			);
		}
	} else if (state === 'error') {
		if (reconnect < 0) {
			button = (
				<Button variant="outlined" fullWidth color="primary" disabled={disabled} onClick={onReconnect}>
					<Trans>Reconnect</Trans>
				</Button>
			);
		} else {
			button = (
				<Button variant="outlined" fullWidth color="secondary" disabled={disabled} onClick={onDisconnect}>
					<Trans>Disconnect</Trans>
				</Button>
			);
		}
	}

	return button;
}
