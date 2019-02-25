/**
 * Created by sines on 2018-02-23T10:24:03.393Z.
 */
// import * as services from './services'
import { createModuleConnect } from 'library/reduxUtils'

const moduleConfig = {
  moduleName: 'example',
  initialState: {
    moduleCount: 0
  },
  actions: {
    addModuleCount: v => v
  },
  asyncActions: (actions) => ({
  }),
  reducers: {
    addModuleCount: (state, action)  => ({...state, moduleCount: state.moduleCount + action.payload})
  }
}

export default createModuleConnect(moduleConfig)()
