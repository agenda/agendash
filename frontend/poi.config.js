const webpack = require('webpack');

module.exports = {
  devServer: {
    proxy: 'http://localhost:3000/api/'
  },
  presets: [
    require('poi-preset-babel-minify')(),
    require('poi-preset-webpackmonitor')()
  ],
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
