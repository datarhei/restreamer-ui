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
```sh
@testing-library/dom          ^8.13.0  →  ^8.19.0
@testing-library/jest-dom      ^4.2.4  →  ^5.16.5
@testing-library/user-event   ^13.5.0  →  ^14.4.3
eslint                        ^7.32.0  →  ^8.26.0
hls.js                       ^0.14.17  →   ^1.2.4
react-router-dom               ^6.3.0  →   ^6.4.3
react-scripts                  ^4.0.3  →   ^5.0.1
```

## License
See the [LICENSE](./LICENSE) file for licensing information.
