/**
 * Created by erichua on 22/12/2017.
 */

export default {
  component: require('./AppContainer').default,
  initialState: {
    globalCount: 0
  },
  actions: {
    addGlobalCount: v => v
  },
  asyncActions: (actions) => ({
    addGlobalCountAsync: () => async dispatch => {
      dispatch(actions.addGlobalCount(await (async () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(1000)
          }, 2000)
        })
      })()))
    }
  }),
  reducers: {
    addGlobalCount: (state, action) => ({ ...state, globalCount: state.globalCount + action.payload })
  },
}
