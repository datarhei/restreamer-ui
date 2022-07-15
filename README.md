# Restreamer-UI

The user interface of the Restreamer for the connection to the [datarhei Core](https://github.com/datarhei/core)application.

- React
- Material-UI (MUI)

## Development

### For the Restreamer interface:

```
$ git clone github.com/datarhei/restreamer-ui
$ cd restreamer-ui
$ yarn install
$ npm run start
```

Connect the UI with a [datarhei Core](https://github.com/datarhei/core):
http://localhost:3000?address=http://core-ip:core-port

### To add/fix translations:
Locales are located in `src/locals`
```
$ npm run i18n-extract:clean
$ npm run i18n-compile
```

### Known outdated dependencies
Requires MUI 5.2+ & React 18 compatibility. Clappr-Player upgrade (or removal).

```sh
@mui/material                             5.1.1  →            5.9.0     
@mui/styles                              ^5.1.1  →           ^5.9.0     
@testing-library/dom                    ^8.13.0  →          ^8.16.0     
@testing-library/jest-dom                ^4.2.4  →          ^5.16.4     
@testing-library/react                  ^12.1.5  →          ^13.3.0     
@testing-library/user-event             ^13.5.0  →          ^14.2.5     
eslint                                  ^7.32.0  →          ^8.19.0     
hls.js                                 ^0.14.17  →           ^1.1.5     
react                                   ^17.0.2  →          ^18.2.0     
react-dom                               ^17.0.2  →          ^18.2.0     
react-scripts                            ^4.0.3  →           ^5.0.1     
typescript                               ^3.9.7  →           ^4.7.4 
```

## License
See the [LICENSE](./LICENSE) file for licensing information.
