import React from 'react';

import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import * as plurals from 'make-plural/plurals';

import { messages as EN } from './locales/en/messages.js';
import { messages as DA } from './locales/da/messages.js';
import { messages as DE } from './locales/de/messages.js';
import { messages as EL } from './locales/el/messages.js';
import { messages as ES } from './locales/es/messages.js';
import { messages as FR } from './locales/fr/messages.js';
import { messages as IT } from './locales/it/messages.js';
import { messages as KO } from './locales/ko/messages.js';
import { messages as PL } from './locales/pl/messages.js';
import { messages as PT } from './locales/pt/messages.js';
import { messages as RU } from './locales/ru/messages.js';
import { messages as SL } from './locales/sl/messages.js';
import { messages as TR } from './locales/tr/messages.js';
import * as Storage from './utils/storage';

i18n.loadLocaleData('en', { plurals: plurals.en });
i18n.loadLocaleData('da', { plurals: plurals.da });
i18n.loadLocaleData('de', { plurals: plurals.de });
i18n.loadLocaleData('el', { plurals: plurals.el });
i18n.loadLocaleData('es', { plurals: plurals.es });
i18n.loadLocaleData('fr', { plurals: plurals.fr });
i18n.loadLocaleData('it', { plurals: plurals.it });
i18n.loadLocaleData('ko', { plurals: plurals.ko });
i18n.loadLocaleData('pl', { plurals: plurals.pl });
i18n.loadLocaleData('pt', { plurals: plurals.pt });
i18n.loadLocaleData('ru', { plurals: plurals.ru });
i18n.loadLocaleData('sl', { plurals: plurals.sl });
i18n.loadLocaleData('tr', { plurals: plurals.tr });
i18n.load({
	en: EN,
	da: DA,
	de: DE,
	el: EL,
	es: ES,
	fr: FR,
	it: IT,
	ko: KO,
	pl: PL,
	pt: PT,
	ru: RU,
	sl: SL,
	tr: TR,
});

const getLanguage = (defaultLanguage, supportedLanguages) => {
	let lang = Storage.Get('language');
	if (supportedLanguages.indexOf(lang) === -1) {
		lang = getBrowserLanguage(defaultLanguage);
	}

	if (supportedLanguages.indexOf(lang) === -1) {
		lang = defaultLanguage;
	}

	Storage.Set('language', lang);

	return lang;
};

const getBrowserLanguage = (defaultLanguage) => {
	let lang = window.navigator.language;

	const match = lang.match(/^[a-z]+/);
	if (!match) {
		return defaultLanguage;
	}

	return match[0].toLowerCase();
};

i18n.activate(getLanguage('en', ['en', 'da', 'de', 'el', 'es', 'fr', 'it', 'ko', 'pl', 'pt', 'ru', 'sl', 'tr']));

export default function Provider(props) {
	return <I18nProvider i18n={i18n}>{props.children}</I18nProvider>;
}
