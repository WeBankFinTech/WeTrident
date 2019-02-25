import { createGlobalConnect } from 'library/reduxUtils'

const AppContainerConfig = {
  initialState: {
    globalCount: 0
  },
  actions: {
    addGlobalCount: v => v
  },
  asyncActions: (actions) => ({
  }),
  reducers: {
    addGlobalCount: (state, action) => ({...state, globalCount: state.globalCount + action.payload})
  }
}

export default AppContainerConfig
// export default createGlobalConnect(AppContainerConfig)
