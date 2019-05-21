/** @format */

import { AppRegistry } from 'react-native'
import AppEntry from './src/core'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => AppEntry)
