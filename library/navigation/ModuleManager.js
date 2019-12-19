import { generateRouteName } from './NavigationUtils'
import { createGlobalConnect, createModuleConnect, createSceneConnect } from '../reduxUtils'
import { combineReducers } from 'redux'

export default class ModuleManager {
  static moduleList = []

  static modules

  static container

  static connectedContainer

  static init (modules, container) {
    this.moduleList = modules
    this.container = container
  }

  /**
   * 添加按需加载的模块到模块列表
   * @param dyModule
   * @returns {*}
   */
  static addDyModule (dyModule) {
    if (typeof dyModule === 'function') {
      // 判断重复
      const wrappedModule = createModuleConnect(dyModule())()
      const module = dyModule(this.connectedContainer, wrappedModule)

      if (!this.moduleList.find(item => item.moduleName === module.moduleName)) {
        this.moduleList.push(module)
      }
      return module
    }
  }

  static flatModule (connectedModules) {
    const flatRoutes = {}
    const moduleNames = Object.keys(connectedModules.routers)
    for (const moduleName of moduleNames) {
      const sceneNames = Object.keys(connectedModules.routers[moduleName])
      for (const sceneName of sceneNames) {
        const routeName = generateRouteName(moduleName, sceneName)
        flatRoutes[routeName] = connectedModules.routers[moduleName][sceneName]
      }
    }
    return flatRoutes
  }

  /**
   * Connect both modules and container
   */
  static connectModulesAll () {
    const connectedContainer = createGlobalConnect(this.container)(this.container.component)
    this.connectedContainer = connectedContainer
    const connectedModules = this.connectModules(connectedContainer)
    return {
      connectedContainer,
      connectedModules
    }
  }

  static connectModules (connectedContainer) {
    const reducers = {}
    const routers = {}
    this.moduleList.forEach(moduleItem => {
      const wrappedModule = createModuleConnect(moduleItem)()

      const wrappedSceneList = []
      reducers[moduleItem.moduleName] = combineReducers({
        modulePrivate: wrappedModule.reducer,
        ...(moduleItem.sceneList.reduce((result, getSceneItem) => {
          const sceneConfig = getSceneItem(connectedContainer, wrappedModule)
          const wrappedScene = createSceneConnect(sceneConfig)(sceneConfig.component)
          wrappedSceneList.push(wrappedScene)
          let sceneReducer = wrappedScene.reducer

          if (sceneConfig.childComponent && sceneConfig.childComponent.length > 0) {
            const childComponents = {}
            for (const childComponent of sceneConfig.childComponent) {
              const childComponentConfig = childComponent(connectedContainer, wrappedModule)
              const wrappedComponent = createSceneConnect(childComponentConfig)(childComponentConfig.component)
              childComponents[wrappedComponent] = wrappedComponent.reducer
            }
            sceneReducer = combineReducers({
              scenePrivate: wrappedScene.reducer,
              ...childComponents
            })
          }

          return {
            ...result,
            [wrappedScene]: sceneReducer
          }
        }, {}))
      })
      routers[moduleItem.moduleName] = wrappedSceneList.reduce((result, scene) => ({
        ...result,
        [scene]: {
          screen: scene,
          navigationOptions: () => ({
            title: scene.toString()
          })
        }
      }), {})
    })

    return {
      routers: routers,
      reducer: combineReducers(reducers),
      toString: () => 'modules'
    }
  }
}
