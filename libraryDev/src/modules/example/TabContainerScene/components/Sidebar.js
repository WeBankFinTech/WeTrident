import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Theme, dimens, Button } from '@webank/trident'
import { SafeAreaView } from '@unpourtous/react-navigation'
import EntryList from '../../../../bizComponents/EntryList'

const sidebarWidth = dimens.WINDOW_WIDTH - 64

export default class Sidebar extends Component {
  open () {
    this.props.navigation.navigate('DrawerOpen')
  }

  close () {
    this.props.navigation.navigate('DrawerClose')
  }

  toggle () {
    this.props.navigation.navigate('DrawerToggle')
  }

  render () {
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
        <EntryList style={[{
          backgroundColor: Theme.Color.backgroundPrimary
        }, this.props.style]}
        >

          <Button
            text='Close Drawer' onPress={() => {
              console.log(this.props.navigation)
              this.close()
            }}
          />

        </EntryList>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: sidebarWidth,
    height: dimens.WINDOW_HEIGHT,
    backgroundColor: 'transparent',
    paddingTop: 50 + dimens.STATUS_BAR_HEIGHT
  }
})
