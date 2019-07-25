const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');


const prodConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(c|le|sc)ss$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    // CSS 文件压缩
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
    // 通过 cdn 的方式分离基础包
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
  // 优化，提取公共包 commons
  optimization: {
    splitChunks: {
      minSize: 0, // 分离包体积最小
      cacheGroups: {
        commons: {
          // test: /(react|react-dom)/,
          // name: 'vendors',
          // chunks: 'all'
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
};

module.exports = merge(baseConfig, prodConfig);
