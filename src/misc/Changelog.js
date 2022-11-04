import React from 'react';

import { Trans } from '@lingui/macro';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ReactMarkdown from 'react-markdown';
import SemverGt from 'semver/functions/gt';
import SemverLte from 'semver/functions/lte';
import SemverValid from 'semver/functions/valid';

import Dialog from './modals/Dialog';

export default function Changelog(props) {
	const [$data, setData] = React.useState('');

	React.useEffect(() => {
		(async () => {
			await onMount();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onMount = async () => {
		let data = await loadData();
		data = filter(data, props.current, props.previous);

		setData(data);
	};

	const loadData = async () => {
		let response = null;

		try {
			response = await fetch('CHANGELOG.md', {
				method: 'GET',
			});
		} catch (err) {
			return '';
		}

		if (response.ok === false) {
			return '';
		}

		return await response.text();
	};

	const filter = (data, current, previous) => {
		let lines = data.split('\n');
		let filteredLines = [];

		let copy = true;

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].startsWith('### ')) {
				let version = lines[i].replace('### ', '');

				if (SemverValid(version) === null) {
					if (copy === true) {
						filteredLines.push(lines[i]);
					}

					continue;
				}

				if (current.length === 0) {
					current = version;
				}

				if (previous.length === 0) {
					previous = version;
				}

				if (SemverLte(version, current) && SemverGt(version, previous)) {
					copy = true;
				} else {
					copy = false;
				}
			}

			if (copy === true) {
				filteredLines.push(lines[i]);
			}
		}

		return filteredLines.join('\n');
	};

	if ($data.length === 0 || $data.startsWith('<!DOCTYPE')) {
		return null;
	}

	return (
		<Dialog
			open={props.open}
			onClose={props.onClose}
			title={<Trans>Changelog</Trans>}
			maxWidth={980}
			buttonsRight={
				<Button variant="outlined" color="primary" onClick={props.onClose}>
					<Trans>Dismiss</Trans>
				</Button>
			}
		>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<ReactMarkdown>{$data}</ReactMarkdown>
				</Grid>
			</Grid>
		</Dialog>
	);
}

Changelog.defaultProps = {
	open: false,
	current: '',
	previous: '',
	onClose: () => {},
};
