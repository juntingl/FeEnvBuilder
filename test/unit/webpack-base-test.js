/**
 * 单元测试 - 测试 webpack 基础配置文件
 * @Author: Junting.liu
 * @Date: 2019-07-27 11:38:28
 * @Last Modified by: Junting.liu
 * @Last Modified time: 2019-07-30 15:51:01
 */
const path = require('path');
const assert = require('assert');

describe('webpack.base.js 文件测试', () => {
  const baseConfig = require('../../lib/webpack.base.js');

  console.log(baseConfig.entry);
  it('entry', () => {
    // 判断 entry index 的值
    assert.equal(baseConfig.entry.index.indexOf('/test/smoke/template/src/index/index.js') > -1, true);
    assert.equal(baseConfig.entry.search.indexOf('/test/smoke/template/src/search/index.js') > -1, true);
  });
});
