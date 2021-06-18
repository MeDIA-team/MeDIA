module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
    'plugin:vue/recommended',
    'plugin:nuxt/recommended',
  ],
  rules: {
    'no-console': 0,
  },
}
