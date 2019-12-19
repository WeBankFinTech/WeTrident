import { TridentStat } from '@webank/trident'
import { WTConsoleView } from '../../bizComponents/WTConsoleView'

export default (statData = {}) => {
  const TAG = '[TridentStat]'
  switch (statData.type) {
    case TridentStat.StatType.sceneChange: {
      console.log(TAG, statData.type, statData.payload)
      break
    }
    case TridentStat.StatType.userAction: {
      console.log(TAG, statData.type, statData.payload)
      WTConsoleView.addLog(statData) // WTConsole custom data
      break
    }
    case TridentStat.StatType.httpRequest: {
      console.log(TAG, statData.type, statData.payload)
      break
    }
    case TridentStat.StatType.renderError: {
      console.log(TAG, statData.type, statData.payload)
      break
    }
    case TridentStat.StatType.unhandlePromise: {
      console.log(TAG, statData.type, statData.payload)
      break
    }
  }
}
