module.exports = {
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaFeatures: {
      jsx: false
    }
  },
  env: {
    browser: true,
    node: true
  },
  globals: {
    THREE: true,
    THREEx: true,
    _: true,
    $: true,
    Utils: true,
    TweenMax: true,
    TimelineMax: true
  }
};
