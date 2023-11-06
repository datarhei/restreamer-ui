import React from 'react';

import FormInlineButton from './FormInlineButton';

export default function UploadButton(props) {
	const { acceptType, label, onError, onStart, onUpload, ...other } = props;

	const acceptString = props.acceptTypes.map((t) => t.mimetype).join(',');

	const handleUpload = (event) => {
		const handler = (event) => {
			const files = event.target.files;

			if (files.length === 0) {
				// no files selected
				props.onError({
					type: 'nofiles',
				});
				return;
			}

			const file = files[0];

			let type = null;
			for (let t of props.acceptTypes) {
				if (t.mimetype === file.type) {
					type = t;
					break;
				}
			}

			if (type === null) {
				// not one of the allowed mimetypes
				props.onError({
					type: 'mimetype',
					actual: file.type,
					allowed: acceptString,
				});
				return;
			}

			if (file.size > type.maxSize) {
				// the file is too big
				props.onError({
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
					props.onError({
						type: 'read',
						message: reader.error.message,
					});
					return;
				}

				props.onUpload(reader.result, type.extension);
			};
		};

		props.onStart();

		handler(event);

		// reset the value such that the onChange event will be triggered again
		// if the same file gets selected again
		event.target.value = null;
	};

	return (
		<FormInlineButton component="label" {...other}>
			{props.label}
			<input accept={acceptString} type="file" hidden onChange={handleUpload} />
		</FormInlineButton>
	);
}

UploadButton.defaultProps = {
	label: '',
	acceptTypes: [],
	onError: function () {},
	onUpload: function (data, extension) {},
};
