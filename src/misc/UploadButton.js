import React from 'react';

import FormInlineButton from './FormInlineButton';

export default function UploadButton({
	label = '',
	acceptTypes = [],
	onStart = function () {},
	onError = function () {},
	onUpload = function (data, extension) {},
	variant = 'outlined',
	color = 'primary',
	disabled = false,
}) {
	const accept = acceptTypes.map((t) => t.mimetype);

	const handleUpload = (event) => {
		const handler = (event) => {
			const files = event.target.files;

			if (files.length === 0) {
				// no files selected
				onError({
					type: 'nofiles',
				});
				return;
			}

			const file = files[0];

			let type = null;
			for (let t of acceptTypes) {
				const accept = t.mimetype.split('/');
				const actual = file.type.split('/');

				if (accept[0] !== actual[0]) {
					continue;
				}

				if (accept[1] === '*' || accept[1] === actual[1]) {
					type = t;
					break;
				}
			}

			if (type === null) {
				// not one of the allowed mimetypes
				onError({
					type: 'mimetype',
					actual: file.type,
					allowed: accept.slice(),
				});
				return;
			}

			if (file.size > type.maxSize) {
				// the file is too big
				onError({
					type: 'size',
					actual: file.size,
					allowed: type.maxSize,
				});
				return;
			}

			let reader = new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onloadend = async () => {
				if (reader.result === null) {
					// reading the file failed
					onError({
						type: 'read',
						message: reader.error.message,
					});
					return;
				}

				onUpload(reader.result, type.extension, type.mimetype);
			};
		};

		onStart();

		handler(event);

		// reset the value such that the onChange event will be triggered again
		// if the same file gets selected again
		event.target.value = null;
	};

	return (
		<FormInlineButton component="label" variant={variant} color={color} disabled={disabled}>
			{label}
			<input accept={accept.join(',')} type="file" hidden onChange={handleUpload} />
		</FormInlineButton>
	);
}
