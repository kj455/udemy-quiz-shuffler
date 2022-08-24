import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_icon: './assets/icon.png',
      default_popup: './dist/popup/index.html',
    },
    background: {
      service_worker: './dist/background/index.global.js',
    },
    icons: {
      16: './assets/icon.png',
      48: './assets/icon.png',
      128: './assets/icon.png',
    },
    permissions: ['tabs', 'activeTab'],
    content_scripts: [
      {
        matches: ['*://www.udemy.com/*/quiz/*'],
        js: ['./dist/contentScripts/index.global.js'],
      },
    ],
    content_security_policy: {
      extension_pages: isDev
        ? // this is required on dev for Vite script to load
          `script-src 'self' http://localhost:${port}; object-src 'self' http://localhost:${port}`
        : "script-src 'self'; object-src 'self'",
    },
  };

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts;
    manifest.permissions?.push('webNavigation');
  }

  return manifest
}
