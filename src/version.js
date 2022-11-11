import pkg from '../package.json';

const Core = '^16.10.1';
const FFmpeg = '^4.1.0 || ^5.0.0';
const UI = pkg.bundle ? pkg.bundle : pkg.name + ' v' + pkg.version;
const Version = pkg.version;

export { Core, FFmpeg, UI, Version };
