import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  timeout: 60000,
  retries: 0,
  testDir: 'tests',
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    video: 'off',
    screenshot: 'off',
    extraHTTPHeaders: {
      'Authorization': `Token ${process.env.ACCESS_TOKEN}`
    }
  },
  projects: [
    { name: 'setup', testMatch: 'auth.setup.ts'},
    {
      name: 'Chromium',
      dependencies: ['setup'],
      use: { browserName: 'chromium' , storageState: '.auth/user.json'}      
    },
    {
      name: 'Firefox',
      dependencies: ['setup'],
      use: { browserName: 'firefox' , storageState: '.auth/user.json'}      
    },
    {
      name: 'Webkit',
      dependencies: ['setup'],
      use: { browserName: 'webkit' , storageState: '.auth/user.json'}      
    },
  ],
}

export default config
