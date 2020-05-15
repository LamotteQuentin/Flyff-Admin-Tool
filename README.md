# Flyff Admin Tool

## License

The source code and the app itslef are inteded to be used accordingly to the attached [license file](./LICENSE.md).

## Requirements

This app is meant to be built and run on **Windows** systems only.
Some calls to PowerShell make it unable to be built for other operating systems but this could be changed if a cross-platform way of managing ODBC systems is found in the future.

<p align="center">
	<img src="https://nklayman.github.io/vue-cli-plugin-electron-builder/hero.png" height="100">
</p>

Flyff Admin Tool uses a [Vue](https://vuejs.org/) + [Electron](https://www.electronjs.org/) stack and relies on the [Vue CLI Plugion Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/) plugin to wrap the VueJS app within an ElectronJS shell.

## Development

This app is being developped using [Visual Studio Code](https://code.visualstudio.com/).

As for its frameworks and other tools, it uses:

- [NodeJS 12](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Vue CLI 4](https://cli.vuejs.org/)

### Install dependencies

The first thing to do when cloning a fresh copy of the project is to install its dependencies (as for any NodeJS project...)!

```sh
yarn install
```

### Run

Using the following command builds the app in development mode and serves it locally.

```sh
yarn electron:serve
```

### Build

The following command bulds the app in production mode.

```sh
yarn electron:build
```

> You can add the `-p always` option to publish it to GitHub.
> See [this guide](https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/recipes.html#auto-update) for more info.
