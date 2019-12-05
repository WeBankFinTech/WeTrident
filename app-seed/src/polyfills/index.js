import { polyfillConsole, disableConsole } from '@unpourtous/rn-console-polyfill'
import { RNEnv } from '@webank/trident'

// 某些环境不太一致，可以在这里统一 polyfill
polyfillConsole()
if (!RNEnv.isDev()) {
  disableConsole()
}
