const url = require('url');

const config = {
  builders: {
    android: {
      entry: './src/index.ts',
      buildDir: 'build/android',
      dllBuildDir: 'build/android/dll',
      stack: ['react-native', 'android'],
      defines: {
        __CLIENT__: true
      },
      enabled: true
    },
    ios: {
      entry: './src/index.ts',
      buildDir: 'build/ios',
      dllBuildDir: 'build/ios/dll',
      stack: ['react-native', 'ios'],
      defines: {
        __CLIENT__: true
      },
      enabled: true
    },
    test: {
      stack: ['react-native-web', 'server'],
      roles: ['test'],
      defines: {
        __TEST__: true
      }
    }
  },
  options: {
    stack: ['apollo', 'react', 'styled-components', 'es6', 'ts', 'webpack'],
    cache: '../../.cache',
    webpackDll: true,
    reactHotLoader: false,
    persistGraphQL: false,
    defines: {
      __DEV__: process.env.NODE_ENV !== 'production',
      __API_URL__: '"http://localhost:8080/graphql"',
      __WEBSITE_URL__: '"http://localhost:3000"'
    }
  }
};

if (process.env.NODE_ENV === 'production') {
  config.builders.android.enabled = true;
  config.builders.ios.enabled = true;
  config.options.defines.__API_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com/graphql"';
  config.options.defines.__WEBSITE_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com"';
  // Generating source maps for production will slowdown compilation for roughly 25%
  config.options.sourceMap = false;
}

const extraDefines = {};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;
