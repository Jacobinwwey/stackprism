import { defineManifest } from '@crxjs/vite-plugin'
import pkg from '../package.json' with { type: 'json' }

export default defineManifest({
  manifest_version: 3,
  name: '__MSG_appName__',
  description: '__MSG_appDesc__',
  default_locale: 'zh_CN',
  version: pkg.version,
  permissions: ['activeTab', 'scripting', 'tabs', 'storage', 'webRequest', 'webNavigation'],
  host_permissions: ['<all_urls>'],
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module'
  },
  icons: {
    16: 'icons/icon16.png',
    32: 'icons/icon32.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png'
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/content/content-observer.ts'],
      run_at: 'document_idle'
    }
  ],
  action: {
    default_title: 'StackPrism',
    default_popup: 'src/ui/popup/index.html',
    default_icon: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png'
    }
  },
  options_ui: {
    page: 'src/ui/settings/index.html',
    open_in_tab: true
  },
  web_accessible_resources: [
    {
      resources: ['rules/*', 'tech-links.json', 'injected/page-detector.iife.js', 'injected/page-source-search.iife.js'],
      matches: ['http://*/*', 'https://*/*']
    }
  ]
})
