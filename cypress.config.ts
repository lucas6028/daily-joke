import { defineConfig } from 'cypress'

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  fixturesFolder: 'cypress/fixtures',
  defaultBrowser: 'chrome',
  nodeVersion: 'system',

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    async setupNodeEvents(on, config) {},
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  },

  env: {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
