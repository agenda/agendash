const webpack = require('webpack');

module.exports = {
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000/'
    }
  },
  presets: [
    require('@poi/plugin-babel-minify')(),
    require('@poi/plugin-webpackmonitor')()
  ],
  babel: {
    jsx: 'vue'
  },
  webpack(config) {
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'cheap-source-map';
    } else {
      config.devtool = 'none';
    }

    // Remove locales from moment as we don't currently use them
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // https://github.com/moment/moment/issues/2373#issuecomment-346177411
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

    return config;
  }
};
