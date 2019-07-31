const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const autoprefixer = require('autoprefixer');
// 获取项目当前路径
const projectRoot = process.cwd();

// 动态获取页面模块输出 entry 和 htmlWebpackPlugin 配置
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  // 匹配规则的文件目录路径
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));
  console.log('entryFiles:', path.join(projectRoot, './src/*/index.js'));
  Object.keys(entryFiles).map((index) => {
    //
    const entryFile = entryFiles[index];
    // 匹配出页面模块名字
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    // 设置输出内容属性、值
    entry[pageName] = entryFile;
    return htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(projectRoot, `./src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        // 使用 SplitChunksPlugin 分离基础包的时候，需要注入入口 html
        chunks: ['vendors', pageName],
        inject: true, // 注入打包后的 js、css 等文件
        minify: {
          // 压缩参数
          html5: true,
          collapseWhitespace: true, // 去除空格
          preserveLineBreaks: false, // 是否保留换行符
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      }),
    );
  });
  // 输出配置
  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();
console.log('entry: ', entry)

module.exports = {
  // 入口
  entry,
  // 构建完资源输出目录
  output: {
    path: path.join(projectRoot, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  // 资源解析或模块增强
  module: {
    // 资源解析
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1rem = 75px
              remPrecision: 8, // px 转换 rem 时保留 8 位小数点
            },
          },
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  // 兼容浏览器最近两个版本，使用程度比例 >1% 和 iOS 7 系统
                  overrideBrowserslist: ['last 2 version', '>1%', 'iOS 7'],
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpeg|jpg|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './img/[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './fonts/[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      // {
      //   test: /\.(png|jpeg|jpg|svg|gif)$/,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         limit: 10240 // 小于等于 10kb 自动转换 base64
      //       }
      //     }
      //   ]
      // }
    ],
  },
  // 插件
  plugins: [
    new CleanWebpackPlugin(), // 目录清理
    // CSS 提取独立文件，与 style-loader 是互斥的，style-loader 是插入到
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new FriendlyErrorsWebpackPlugin(), // 日志信息友好
    function doneErrorPlugin() {
      // webpack 4 写法；
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('- -watch') === -1) {
          console.log('build error'); // eslint-disable-line
          process.exit(1);
        }
      });
    },
  ].concat(htmlWebpackPlugins),
  stats: 'errors-only', // 输出信息级别
};
