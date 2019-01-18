/**
 * Created by vengeanliu on 17/3/2.
 */

'use strict'
import {
    Text
} from 'react-native'

import React, {Component} from 'react'

export default class HeaderLabel extends Component {
  render () {
    return (
      <Text style={{alignItems: 'center', color: '#979797', fontSize: 14, height: 25, lineHeight: 25, backgroundColor: '#efefef', paddingLeft: 25, paddingRight: 25}}>{this.props.text ? this.props.text : this.props.children}</Text>
    )
  };
};
