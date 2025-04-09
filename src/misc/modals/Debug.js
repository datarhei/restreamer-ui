import React from 'react';

import TextareaModal from './Textarea';

const Component = function ({ open = false, data = '', title = '', onClose = null, onHelp = null }) {
	return (
		<TextareaModal
			open={open}
			title={title}
			onClose={onClose}
			onHelp={onHelp}
			rows={20}
			value={data}
			readOnly
			allowCopy
			allowDownload
			downloadName="report.txt"
			marginBottom="1em"
		/>
	);
};

export default Component;
