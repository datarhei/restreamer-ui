import { name, version, bundle } from '../package.json';

const Core = '^16.9.0';
const FFmpeg = '^4.1.0 || ^5.0.0';
const UI = bundle ? bundle : name + ' v' + version;

export { Core, FFmpeg, UI };
