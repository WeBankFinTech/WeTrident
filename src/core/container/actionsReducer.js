import { createGlobalConnect } from '../../utils'

const AppContainerConfig = {
  initialState: {
    count: 0
  },
  actions: {
    addCount: v => v
  },
  asyncActions: (actions) => ({
  }),
  reducers: {
    addCount: (state, action) => ({...state, count: state.count + action.payload})
  }
}
export default createGlobalConnect(AppContainerConfig)
