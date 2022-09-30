import { name, version, bundle } from '../package.json';

const Core = '^16.11.0';
const FFmpeg = '^4.1.0 || ^5.0.0';
const UI = bundle ? bundle : name + ' v' + version;
const Version = version;

export { Core, FFmpeg, UI, Version };
