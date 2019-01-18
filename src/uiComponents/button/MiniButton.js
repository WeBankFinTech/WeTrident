/**
 * Created by vengeanliu on 17/2/27.
 */

'use strict'
import {
    View,
    StyleSheet,
    Text,
    PixelRatio
} from 'react-native'

import React, {Component} from 'react'
import WeTouchable from '../ext/WeTouchable'

export default class extends Component {
  render () {
    return (
      <WeTouchable style={{borderRadius: 10}} onPress={this.props.onPress}>
        <View style={[styles.button, this.props.style]}>
          <Text style={[styles.text, this.props.textStyle]}>{this.props.text}</Text>
        </View>
      </WeTouchable>
    )
  };
};

const styles = StyleSheet.create({
  button: {
    width: 65,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#dcb35f',
    borderWidth: 1 / PixelRatio.get()
  },
  text: {
    fontSize: 14,
    color: '#dcb35f'
  }
})
