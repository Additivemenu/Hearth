import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: 'Hearth',
  description: 'Personal browser dashboard — replaces the new tab page.',
  version: pkg.version,
  chrome_url_overrides: {
    newtab: 'src/newtab/index.html',
  },
  permissions: ['tabs', 'storage'],
  action: {
    default_title: 'Hearth',
  },
})
