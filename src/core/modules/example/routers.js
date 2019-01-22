/* eslint-disable comma-dangle */
/**
 * 定义模块内的所有router，会导出给最外层使用
 * Created by erichua on 2017-12-27T12:44:18.634Z.
 */

const routerConfigs = {}
require('./sceneList').default.forEach(scene => {
  routerConfigs[scene] = {
    screen: scene,
    navigationOptions: () => ({
      title: scene.toString()
    })
  }
})

export default routerConfigs
