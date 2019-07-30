/**
 *  冒烟测试
 * @Author: Junting.liu
 * @Date: 2019-07-27 10:38:00
 * @Last Modified by: Junting.liu
 * @Last Modified time: 2019-07-30 16:10:40
 */

/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
  timeout: '10000ms'
});

// 需要进入到执行构建项目目录里
process.chdir(path.join(__dirname, 'template'));

// 每次构建之前先删除 dist 目录
rimraf('./dist', () => {
  const prodConfig = require('../../lib/webpack.prod.js');

  // 执行构建
  webpack(prodConfig, (err, stats) => {
    if (err) {
      console.error(err);
      process.exit(2); // 返回错误码
    }

    // 打印执行信息
    console.log(stats.toString({
      colors: true,
      modules: false, // 不显示
      children: false,
      chunkModules: false
    }));

    console.log('\n' + 'Webpack build success, begin mocha test...');
    mocha.addFile(path.join(__dirname, 'html-test.js'));
    mocha.addFile(path.join(__dirname, 'css-js-test.js'));
    mocha.run();
  });
});
