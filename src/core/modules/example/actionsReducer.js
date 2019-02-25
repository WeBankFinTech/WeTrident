/**
 * Created by sines on 2018-02-23T10:24:03.393Z.
 */
// import * as services from './services'
import { createModuleConnect } from 'library/reduxUtils'

const moduleConfig = {
  moduleName: 'example',
  initialState: {
    count: 0
  },
  actions: {
    addCount: v => v
  },
  asyncActions: (actions) => ({
  }),
  reducers: {
    addCount: (state, action)  => ({...state, count: state.count + action.payload})
  }
}

export default createModuleConnect(moduleConfig)()
