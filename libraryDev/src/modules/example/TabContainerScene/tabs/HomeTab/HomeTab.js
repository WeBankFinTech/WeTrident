/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-10-24T08:41:28.998Z.
 */
import React from 'react'
import { View } from 'react-native'
import { WeBaseScene, AppNavigator, Button, Theme, ActionSheet, NavBar } from '@webank/trident'
import EntryList from '../../../../../bizComponents/EntryList'

export default class HomeTab extends WeBaseScene {
  onResume (fromScene, toScene) {
    super.onResume(fromScene, toScene)
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <NavBar
          title='Home'
          hideLeftButton
        />
        <EntryList style={[{
          backgroundColor: Theme.Color.backgroundPrimary
        }, this.props.style]}
        >

          <Button
            text='Navigation' onPress={() => {
              AppNavigator.example.NavigationScene()
            }}
          />

          <Button
            text='Network' onPress={() => {
              AppNavigator.example.NetworkScene()
            }}
          />

          <Button
            text='State Management' onPress={() => {
              AppNavigator.example.StateManagementScene()
            }}
          />
          <Button
            text='State Key Demo' style={{ marginTop: 10 }} onPress={() => {
              AppNavigator.example.StateKeyHomeScene()
            }}
          />
          <Button
            text='Console log' onPress={() => {
              ActionSheet.show({
                header: 'console不同格式log',
                items: [{
                  text: 'string',
                  onPress: () => {
                    console.log('打印string：', '123456789')
                  }
                }, {
                  text: 'number',
                  onPress: () => {
                    console.log('打印number：', 123456789)
                  }
                }, {
                  text: 'boolean',
                  onPress: () => {
                    console.log('打印boolean：', Math.random() * 100 > 50)
                  }
                }, {
                  text: 'object',
                  onPress: () => {
                    console.log('打印object：', { a: 1, b: 2 })
                  }
                }, {
                  text: 'array',
                  onPress: () => {
                    console.log('打印array：', [1, 2, 3, 4, 5, 6])
                  }
                }]
              })
            }}
          />

          <Button
            text='Plugin Store' onPress={() => {
              AppNavigator.example.PluginStoreScene()
            }}
          />
        </EntryList>
      </View>
    )
  }
}
