/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-07T07:22:42.484Z.
 */
import React from 'react'
import { View, Text } from 'react-native'
import EntryList from '../../../bizComponents/EntryList'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'

import Button from './components/ThemeRect'
import { ThemeProvider, Theme, Toast, Dialog, Loading, WeBaseScene } from '@webank/trident'
import Demo from '@webank/trident/trident-ui/Demo'

export default class UIScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'UIScene'
  })

  render () {
    return (
      <View style={{
        flex: 1,
        backgroundColor: Theme.Color.backgroundPrimary
      }}>
        <EntryList>
          <Button />

          <PrimaryButton text={`Change Theme (${this.props.theme})`} onPress={() => {
            this.props.changeTheme(this.props.theme === 'light' ? 'dark' : 'light')
          }} />
        </EntryList>
        <View style={{backgroundColor: '#fff'}}>
          <Demo />
        </View>
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
