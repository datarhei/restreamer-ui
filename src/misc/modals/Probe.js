import React from 'react';

import TextareaModal from './Textarea';

const Component = function ({ open = false, data = '', title = '', onClose = null, onHelp = null }) {
	return <TextareaModal open={open} title={title} onClose={onClose} onHelp={onHelp} rows={18} value={data} readOnly allowCopy />;
};

export default Component;
