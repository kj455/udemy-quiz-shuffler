![1280x540_white](https://user-images.githubusercontent.com/38521709/186534468-6349a6b2-eb3d-4c46-b757-6d70bef3fdcd.png)

<p align="center">
  Udemy Quiz Shuffler is a chrome extension that shuffles the Udemy quiz choices.
</p>

<p align="center">
  <a href="https://github.com/scaffdog/scaffdog/actions?workflow=CI"><img src="https://img.shields.io/github/workflow/status/kj455/udemy-quiz-shuffler/Test?logo=github&style=flat-square" alt="GitHub Workflow Status" /></a>
  <a href="#"><img src="https://img.shields.io/chrome-web-store/rating/mbljgefddojilenlhlmfejolfefibgml" alt="rating" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/scaffdog/scaffdog?label=license&style=flat-square" alt="MIT LICENSE" /></a>
</p>

# Udemy Quiz Shuffler

A chrome extension to shuffle udemy quiz choices.

The shuffle result changes each time the page is reloaded.

If you move to the previous or next question, the order is maintained as long as you do not reload.

![udemy-quiz-shuffler](https://user-images.githubusercontent.com/38521709/186393162-c3eef57a-0b3b-46b3-8ae1-c9bcc7b09f25.gif)



## Usage

### Development

```bash
yarn dev
```

Then **load extension in browser with the `extension/` folder**.

For Firefox developers, you can run the following command instead:

```bash
yarn start:firefox
```

`web-ext` auto reload the extension when `extension/` files changed.

> While Vite handles HMR automatically in the most of the case, [Extensions Reloader](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) is still recommanded for cleaner hard reloading.

### Build

To build the extension, run

```bash
yarn build
```

And then pack files under `extension`, you can upload `extension.crx` or `extension.xpi` to appropriate extension store.

## Credits

This repo was made based on:
- https://github.com/antfu/vitesse-webext
- https://github.com/quolpr/react-vite-webext
