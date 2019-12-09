/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-10-24T08:41:28.998Z.
 */
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { WeBaseScene, AppNavigator, Button, Theme, dimens } from '@webank/trident'
import NavBar from '../../components/NavBar'
import EntryList from '../../../../../bizComponents/EntryList'

export default class HomeTab extends WeBaseScene {
  onResume (fromScene, toScene) {
    super.onResume(fromScene, toScene)
  }

  render () {
    return (
      <View style={{ flex: 1, paddingTop: dimens.TOTAL_NAV_BAR_HEIGHT }}>
        <NavBar
          title={'HomeTab'}
          hideLeftButton
        />
        {/*<View style={styles.main}>*/}
          {/*<Button*/}
            {/*text={'Open Drawer'}*/}
            {/*style={styles.button}*/}
            {/*onPress={() => {*/}
              {/*this.props.navigation.navigate('DrawerOpen')*/}
            {/*}} />*/}
        {/*</View>*/}
        <EntryList style={[{
          backgroundColor: Theme.Color.backgroundPrimary
        }, this.props.style]}>
          <Button text={'Trident-Framework'} onPress={() => {
            AppNavigator.example.FrameworkScene()
          }} />

          <Button text={'Trident-UI'} onPress={() => {
            AppNavigator.ui.UIScene()
          }} />

          <Button text={'Plugin Store'} onPress={() => {
            AppNavigator.example.PluginStoreScene()
          }} />

          {/*<Button text={'TabView'} onPress={() => {*/}
          {/*// AppNavigator.example.PluginStoreScene()*/}
          {/*AppNavigator.tabExample.TabContainerScene({*/}
          {/*// initialTab: 'Setting'*/}
          {/*})*/}
          {/*}} />*/}
        </EntryList>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20
  },
  button: {
    width: '100%'
  }
})
