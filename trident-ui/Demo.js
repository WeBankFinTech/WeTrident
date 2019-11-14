/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-04-23T03:47:50.328Z.
 */
import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import {FinancialInput, List, Button, Row, Column, Icon} from './index'

export default class Demo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      amount: '12'
    }
  }

  _renderSection (title) {
    return <Text style={{paddingTop: 15, paddingBottom: 5, fontSize: 20, fontWeight: 'bold'}}>{title}:</Text>
  }

  _renderItem (text) {
    return <View style={styles.border}><Text style={{}}>{text}</Text></View>
  }

  render () {
    return (
      <ScrollView>
        {this._renderSection('Layout')}
        <Row>
          <Column.CrossCenter style={[{flex: 1}, styles.border]}>
            {this._renderItem('column1')}
            {this._renderItem('column2')}
            {this._renderItem('column3')}
          </Column.CrossCenter>

          <Column.MainStart.CrossCenter style={[{flex: 1}, styles.border]}>
            {this._renderItem('column1')}
          </Column.MainStart.CrossCenter>
          <Column.MainCenter.CrossCenter style={[{flex: 1}, styles.border]}>
            {this._renderItem('column2')}
          </Column.MainCenter.CrossCenter>
          <Column.MainEnd.CrossCenter style={[{flex: 1}, styles.border]}>
            {this._renderItem('column3')}
          </Column.MainEnd.CrossCenter>
        </Row>

        {this._renderSection('Button')}
        <Button text={'button'} style={{marginTop: 10}} onPress={() => {
          console.warn('点击了按钮')
        }} />
        <Button disabled text={'disabled'}  style={{marginTop: 10}} />

        {this._renderSection('Input')}
        <FinancialInput
          // autoFocus
          topInfo={'头部提示信息'}
          bottomInfo={'底部提示信息'}
          warning={'警告'}
          amount={this.state.amount}
          onChange={(newAmount) => {
            this.setState({
              amount: newAmount
            })
          }}
            onFocus={() => {
            console.warn('onFocus')
          }}
            onBlur={() => {
            console.warn('onBlur')
          }}
            onClear={() => {
            this.setState({
              amount: ''
            })
          }}
        />

        {this._renderSection('List')}
        <List data={[
          {name: '名称', content: '内容内容内容内容内容内容内容内容内容内容内容', onPress: () => console.warn('list1')},
          {content: '只有内容', onPress: () => console.warn('list2')},
          {name: '名称', content: '内容（不可修改，自定义样式）阿斯顿发发多少sad非法所得分', itemContentTextStyle: {color: 'green', fontSize: 20}},
          {content: '只有内容（不可修改）'},
        ]}
              itemViewStyle={{backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 10}}
              itemNameTextStyle={{color: 'gray', fontSize: 16}}
              itemContentTextStyle={{color: 'blue', fontSize: 16}}
        />

        {this._renderSection('Icon')}
        <Row>
          <Icon name={Icon.Names.clear} />
          <Icon name={Icon.Names.clear} width={60} />
        </Row>
        <Row>
          <Icon name={Icon.Names.right_arrow} />
          <Icon name={Icon.Names.right_arrow} height={100} />
          <Icon name={Icon.Names.right_arrow} width={100} />
          <Icon name={Icon.Names.right_arrow} height={100} width={100} />
        </Row>

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  border: {
    borderColor: 'gray',
    borderWidth: 1
  }
})
