# Restreamer-UI

The user interface of the Restreamer for the connection to the [datarhei Core](https://github.com/datarhei/core) application.

-   React
-   Material-UI (MUI)

## Development

Please checkout the `dev` branch and base your pull request on this branch.

### For the Restreamer interface:

```
$ git clone --branch dev github.com/datarhei/restreamer-ui
$ cd restreamer-ui
$ yarn install
$ npm run start
```

Connect the UI with a [datarhei Core](https://github.com/datarhei/core):
http://localhost:3000?address=http://core-ip:core-port

### To add/fix translations:

Locales are located in `src/locales`

```
$ npm run i18n-extract:clean
$ npm run i18n-compile
```

In order to contribute translations, please visit [Restreamer on poeditor.com](https://poeditor.com/join/project/ogATl3F48K)

## License

See the [LICENSE](./LICENSE) file for licensing information.
