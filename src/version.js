import { name, version, bundle } from '../package.json';

const Core = '^15.0.0 || ^16.0.0';
const FFmpeg = '^4.1.0 || ^5.0.0';
const UI = bundle ? bundle : name + ' v' + version;

export { Core, FFmpeg, UI };
