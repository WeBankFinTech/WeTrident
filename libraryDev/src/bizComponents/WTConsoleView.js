/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-10-24T06:08:28.443Z.
 */
import React, { Component } from 'react'
import { List } from '@webank/trident'
import { ScrollView, Text } from 'react-native'

class WTConsoleView extends Component {
  static addLog (log) {
    WTConsoleView.log.push(log)
  }

  static log = []

  constructor (props) {
    super(props)
    this.state = {
      logList: WTConsoleView.log
    }
  }

  render () {
    return (
      <ScrollView style={{ padding: 10, backgroundColor: '#fff' }}>
        <Text style={{ paddingTop: 15, paddingBottom: 5, fontSize: 15, fontWeight: 'bold' }}>自动记录点击按钮:</Text>
        <List
          style={{ backgroundColor: '#fff' }} onItemPress={() => {

          }}
        >
          {this.state.logList ? this.state.logList.map((item, index) => {
            const { id = '' } = item.payload || {}
            return (
              <List.Item
                key={index}
                data={{
                  label: `点击按钮: ${id}`
                }}
                labelStyl={{ flex: 1 }}
              />
            )
          }) : null}
        </List>
      </ScrollView>
    )
  }
}

export { WTConsoleView }
