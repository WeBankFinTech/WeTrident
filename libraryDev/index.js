/** @format */
import './src/polyfills'
import { AppRegistry } from 'react-native'
import AppEntry from './src'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => AppEntry)
