/**
 * 转账预测的弹框body
 * Created by erichua on 12/10/2017.
 */

import { View, StyleSheet, Text } from 'react-native'
import PropTypes from 'prop-types'

import React, { Component } from 'react'
import {PrimaryButton} from 'apps/webankPro/bizComponents'
import { ProUI } from 'apps/webankPro/values'
import { cardWithSpace } from '../../../../utils/filters'

export default class PredictTransferDialogBody extends Component {
  static propTypes = {
    title: PropTypes.string,
    name: PropTypes.string,
    cardNo: PropTypes.string,
    bankName: PropTypes.string,
    onPressTransfer: PropTypes.func
  }
  render () {
    return (
      <View style={styles.content}>
        {this.props.title && <Text style={styles.title}>{this.props.title}</Text>}
        {this.props.name ? <Text style={[styles.text]}>{this.props.name}</Text> : null}
        {this.props.cardNo ? <Text style={[styles.text]} >{cardWithSpace(this.props.cardNo)}</Text> : null}
        {this.props.bankName ? <Text style={[styles.text]}>{this.props.bankName}</Text> : null}
        <PrimaryButton onPress={this.props.onPressTransfer} text='给TA转账' style={{marginTop: ProUI.spaceY.medium}} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: ProUI.color.moduleBackground,
    minHeight: 84,
    justifyContent: 'center',
    paddingBottom: ProUI.spaceY.large,
    paddingHorizontal: ProUI.spaceX.large
  },
  title: {
    color: ProUI.color.primary,
    fontSize: ProUI.fontSize.large,
    lineHeight: ProUI.lineHeight.large,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  text: {
    color: ProUI.color.primary,
    fontSize: ProUI.fontSize.medium,
    lineHeight: ProUI.lineHeight.medium,
    textAlign: 'center',
    marginTop: ProUI.spaceY.small
  }
})
