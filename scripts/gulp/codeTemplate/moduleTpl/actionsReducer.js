/**
 * Created by {{author}} on {{createTime}}.
 */

import { createModuleConnect } from 'utils'
// import * as services from './services'

const moduleConfig = {
  moduleName: '{{moduleName}}',
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
