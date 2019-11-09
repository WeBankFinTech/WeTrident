/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-07T07:22:42.484Z.
 */
import React from 'react'
import { View, Text } from 'react-native'
import { WeBaseScene } from '@webank/trident'
import Loading from '@webank/trident/library/uiComponent/popup/Loading'
import Dialog from '@webank/trident/library/uiComponent/popup/Dialog'
import Toast from '@webank/trident/library/uiComponent/popup/Toast'
import EntryList from '../../../bizComponents/EntryList'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'

import Button from './components/Button'

export default class UIScene extends WeBaseScene {
  count = 0

  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'UIScene'
  })

  render () {
    return (
      <View>
        <EntryList>
          <Button />

          <PrimaryButton text={`Change Theme (${this.props.theme})`} onPress={() => {
            this.props.changeTheme(this.count++ % 2 === 0 ? 'dark' : 'light')
          }} />

          <PrimaryButton text={'Dialog'} onPress={this._showDialog} />
          <PrimaryButton text={'Loading'} onPress={() => {
            Loading.show()
            this.props.addCount(100)
            setTimeout(() => {
              Loading.hide()
            }, 1000)
          }} />
          <PrimaryButton text={'Toast'} onPress={() => {Toast.show('Hello Trident')}} />
          <PrimaryButton text={'CustomDialog'} onPress={() => { Toast.show('TODO')}} />
        </EntryList>
        {/*<JSONTree data={this.props} hideRoot={true} getItemString={(type, data, itemType, itemString) => <Text>{type}</Text>} />*/}
      </View>
    )
  }

  _showDialog () {
    const id = Dialog.show({
      texts: ['Hello Trident'],
      items: [{
        text: 'Ok!',
        onItemPress: () => Dialog.hide(id)
      }, {
        text: 'Cancel',
        onItemPress: () => Dialog.hide(id)
      }]
    })
  }
}
