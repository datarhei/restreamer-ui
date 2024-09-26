import React from 'react';

import { i18n } from '@lingui/core';

export default function Number({ value = 0, digits = 0, minDigits = 0 }) {
	const options = {
		minimumFractionDigits: minDigits,
		maximumFractionDigits: digits,
	};

	if (options.minimumFractionDigits > options.maximumFractionDigits) {
		options.maximumFractionDigits = options.minimumFractionDigits;
	}

	return <React.Fragment>{i18n.number(value, options)}</React.Fragment>;
}
