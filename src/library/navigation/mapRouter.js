export default (sceneConfig) => {
  const routerConfigs = {}
  sceneConfig.forEach(scene => {
    routerConfigs[scene] = {
      screen: scene,
      navigationOptions: () => ({
        title: scene.toString()
      })
    }
  })

  return routerConfigs
}