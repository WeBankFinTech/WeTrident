import { createModuleConnect } from './../../../utils'
/**
 * Created by sines on 2018-02-23T10:24:03.393Z.
 */
// import * as services from './services'

const moduleConfig = {
  moduleName: 'example',
  initialState: {
  },
  actions: {
    // addModuleCount: v => v
  },
  asyncActions: (actions) => ({
  }),
  reducers: {
    // addModuleCount: (state, action) => ({...state, count: action.payload})
  }
}

export default createModuleConnect(moduleConfig)()
