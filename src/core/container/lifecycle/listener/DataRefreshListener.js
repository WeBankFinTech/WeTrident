/**
 * Created by erichua on 11/10/2017.
 */

import LifecycleLisener from './LifecycleLisener'
export default class DataRefreshLisener extends LifecycleLisener {
  constructor (refreshWealthFunc) {
    super()
    this.refreshWealthFunc = refreshWealthFunc
    this.lastRefreshTs = 0
  }

  onAppResume (isFirst) {
    if (!isFirst && (new Date().getTime() - this.lastRefreshTs) > 15000) {
      this.lastRefreshTs = new Date().getTime()
      this.refreshWealthFunc && this.refreshWealthFunc(isFirst)
    }
  }

  onAppPause () {

  }
}
