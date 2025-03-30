import { defineConfig } from 'cypress'

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  fixturesFolder: 'cypress/fixtures',
  defaultBrowser: 'chrome',
  // nodeVersion: 'system',

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    async setupNodeEvents(on, config) {},
  },

  env: {
    home: 'https://daily-joke.vercel.app',
    random: 'https://daily-joke.vercel.app/random',
    categories: 'https://daily-joke.vercel.app/categories',
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
