/**
 * 单元测试 - 测试 html 资源生成
 * @Author: Junting.liu
 * @Date: 2019-07-27 10:39:12
 * @Last Modified by: Junting.liu
 * @Last Modified time: 2019-07-27 10:57:43
 */
const glob = require('glob-all');

describe('测试 html 文件是否生成', () => {
  it('应该生产 html 文件', (done) => {
    const files = glob.sync([
      './dist/index.html',
      './dist/search.html',
    ]);

    if (files.length) {
      done();
    } else {
      throw new Error('没有生成相关的 html 文件');
    }
  });
});
