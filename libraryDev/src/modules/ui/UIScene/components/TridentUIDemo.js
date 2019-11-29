/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-04-23T03:47:50.328Z.
 */
import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native'
import {
  FinancialInput, List, Button, Row, Column, Icon,
  Dialog, Loading, Toast, Popup, ActionSheet,
  Table, Checkbox
} from '@webank/trident/trident-ui'
import WeTouchable from '@webank/trident/trident-ui/lib/WeTouchable'

export default class TridentUIDemo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      amount: '12',
      isChecked: false
    }
  }

  _renderSection (title) {
    return <Text style={{ paddingTop: 15, paddingBottom: 5, fontSize: 20, fontWeight: 'bold' }}>{title}:</Text>
  }

  _renderItem (text) {
    return <View style={styles.border}><Text style={{}}>{text}</Text></View>
  }

  render () {
    return (
      <ScrollView style={{ margin: 10 }}>
        {this._renderSection('Checkbox')}
        <Row>
          <Text style={{ marginRight: 5 }}>点击选中</Text>
          <Checkbox checked={this.state.checked} onPress={() => {
            this.setState({
              checked: !this.state.checked
            })
          }} />
        </Row>
        <Row.CrossCenter style={{ marginTop: 10 }}>
          <Text style={{ marginRight: 5 }}>disabled</Text>
          <Checkbox checked={false} disabled={true} />
        </Row.CrossCenter>

        {this._renderSection('Table')}
        <Table borderColor={'#000'} align={'center'} fontSize={16} borderWidth={2}>
          <Table.Tr>
            <Table.Th row={1}>标题1</Table.Th>
            <Table.Th row={2}>标题2</Table.Th>
            <Table.Th row={3}>标题3</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Td row={1}>td1</Table.Td>
            <Table.Td row={2}>td2</Table.Td>
            <Table.Td row={3}>td3</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td row={3}>td1</Table.Td>
            <Table.Td row={3}>td3</Table.Td>
          </Table.Tr>
        </Table>

        {this._renderSection('List')}
        <List style={{ backgroundColor: '#fff' }} onItemPress={() => {

        }}>
          <List.Item data={{
            label: '最简单'
          }} />
          <List.Item data={{
            label: '可点击',
            iconRight: Icon.Names.right_arrow,
            onPress: () => {
              Toast.show('点了我啦')
            }
          }} />
          {/*<List.Item data={{*/}
          {/*  label: '不可点击',*/}
          {/*  iconRight: Icon.Names.right_arrow,*/}
          {/*  disabled: true,*/}
          {/*  onPress: () => {*/}
          {/*    Toast.show('点了我啦')*/}
          {/*  }*/}
          {/*}} />*/}
          <List.Item data={{
            icon: Icon.Names.clear,
            label: '带有图表和loading',
            loading: true
          }} />
          <List.Item data={{
            label: '带有状态',
            status: '状态'
          }} />
          <List.Item data={{
            label: '带有状态说明',
            status: '状态',
            subStatus: '状态说明',
            iconRight: Icon.Names.right_arrow
          }} />
        </List>

        {this._renderSection('Popup')}
        <Button style={{ marginTop: 10 }} text={'展示ActionSheet'} onPress={() => {
          ActionSheet.show({
            header: '题目',
            items: [{
              text: '选项1',
              onPress: (item, index) => {
                Toast.show(item.text)
              }
            }, {
              text: '选项2',
              isWarning: true,
              onPress: (item, index) => {
                Toast.show(item.text)
              }
            }, {
              text: '选项3',
              subhead: 'xxx',
              onPress: (item, index) => {
                Toast.show(item.text)
              }
            }]
          })
        }} />
        <Button style={{ marginTop: 10 }} text={'展示自定义的Popup'} onPress={() => {
          const id = Popup.show(
            <View
              style={{ backgroundColor: '#fff', marginVertical: 20, paddingHorizontal: 20, paddingVertical: 10 }}>
              <TridentUIDemo />
              <Button style={{ marginTop: 10 }} text={'关闭Popup'} onPress={() => {
                Popup.hide(id)
              }} />
            </View>
          )
        }} />
        <Button style={{ marginTop: 10 }} text={'展示Toast'} onPress={() => {
          Toast.show('a toast')
        }} />
        <Button style={{ marginTop: 10 }} text={'展示Toast(包含Icon)'} onPress={() => {
          Toast.show('a toast', Icon.Names.clear)
        }} />
        <Button style={{ marginTop: 10 }} text={'展示Loading（3秒钟）'} onPress={() => {
          Loading.show()
          setTimeout(() => {
            Loading.hide()
          }, 3000)
        }} />
        <Button style={{ marginTop: 10 }} text={'触发Dialog'} onPress={() => {
          const id = Dialog.show({
            title: 'Trident UI介绍',
            texts: ['它是一套在WeBank团队内容被使用过的，经受住洗礼的UI框架'],
            items: [{
              text: '关闭',
              onPress: () => {
                Dialog.hide(id)
              }
            }]
          }, {
            autoClose: true
          })
        }} />

        {this._renderSection('Layout')}
        <Row>
          <Column.CrossCenter style={[{ flex: 1 }, styles.border]}>
            {this._renderItem('column1')}
            {this._renderItem('column2')}
            {this._renderItem('column3')}
          </Column.CrossCenter>

          <Column.MainStart.CrossCenter style={[{ flex: 1 }, styles.border]}>
            {this._renderItem('column1')}
          </Column.MainStart.CrossCenter>
          <Column.MainCenter.CrossCenter style={[{ flex: 1 }, styles.border]}>
            {this._renderItem('column2')}
          </Column.MainCenter.CrossCenter>
          <Column.MainEnd.CrossCenter style={[{ flex: 1 }, styles.border]}>
            {this._renderItem('column3')}
          </Column.MainEnd.CrossCenter>
        </Row>

        {this._renderSection('Button')}
        <Button text={'button'} style={{ marginTop: 10 }} onPress={() => {
          console.log('点击了按钮')
        }} />
        <Button disabled text={'disabled'} style={{ marginTop: 10 }} />

        {this._renderSection('Input')}
        <FinancialInput
          // autoFocus
          currencyCode={'CNY'}
          topInfo={'请输入印度卢布（头部提示信息）'}
          bottomInfo={'底部提示信息'}
          warning={'警告'}
          amount={this.state.amount}
          onChange={(newAmount) => {
            this.setState({
              amount: newAmount
            })
          }}
          onFocus={() => {
            console.log('onFocus')
          }}
          onBlur={() => {
            console.log('onFocus')
          }}
          onClear={() => {
            this.setState({
              amount: ''
            })
          }}
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
