/**
 * 负责导出此模块的reducer和router到App级别
 * Created by sines on 2018-02-23T10:24:03.394Z.
 */

export default {
  sceneList: require('./sceneList').default,
  toString: () => require('./actionsReducer').default.moduleName
}
