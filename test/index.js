const path = require('path');

process.chdir(path.join(__dirname, 'smoke/template'));

describe('builder-webpack 测试', () => {
  require('./unit/webpack-base-test');
});
