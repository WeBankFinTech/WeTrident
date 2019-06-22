---
id: navigation
title: 导航系统
---

主要的页面已经生成，可能你已经迫不及待的想试一下让页面串联起来。在Trident App中你可以非常轻松的通过模块名和页面名进行跳转。通过 AppNavigator.$moduleName.$sceneName()即可完成跳转。
## 普通跳转
按上面规则，可以改写BookListScene如下，完成到BookDetailScene的跳转。

```jsx
// modules/book/BookListScene/BookListScene.js

/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-06-02T16:07:03.705Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator } from '@webank/trident'
import { WeTouchable } from '@unpourtous/react-native-touchable'

export default class BookListScene extends Component {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'BookListScene'
  })

  render () {
    return (
      <View>
        <Text>Hello BookListScene</Text>

        <WeTouchable onPress={() => {
          AppNavigator.book.BookDetailScene()
        }}>
          <Text>Navigate to Book Detail</Text>
        </WeTouchable>
      </View>
    )
  }
}

```

## 带参数跳转
上面显示的是一种非常普通的跳转情况，那如果我们需要带参数跳到下个页面如何携带并在下一个页面获取呢？下面展示如何使用跳转参数： 

``` js 
// BookListScene render
  render () {
    return (
      <View>
        <Text>Hello BookListScene</Text>

        <WeTouchable onPress={() => {
          AppNavigator.book.BookDetailScene({
            ISBN: 'selected ISBN'
          })
        }}>
          <Text>Navigate to Book Detail</Text>
        </WeTouchable>
      </View>
    )
  }
```

``` js
// BookDetailScene.js render
  render () {
    return (
      <View>
        {/* ... */}
        <Text>BookId: {this.params.bookId}</Text>
      </View>
    )
  }
```


## 生命周期
相比react component的生命周期，trident提供的生命周期更容易使用，我们用onResume和onPause分别来表示对应页面状态都变化。其中融合了页面创建，页面恢复，App整体前后台切换。
### onResume 
在每个页面首次进入和恢复的时候都会调用，比 componentDidMount特别的是，在App切换到后台切回来以及Trident的页面切会到该页时也会调用。

### onPause 
在每个页面离开会调用，比 componentWillUnMount特别的是，在App切换到后台也会调用。

特别说明: Trident的生命周期不影响 react component、react-navigation、AppState提供的生命周期，如果需要更为精细的控制可以考虑使用她们。

## 外部拉起支持
```shell
# iOS模拟schema拉起
xcrun simctl openurl booted wbstore:///example/DemoScene?title=TestSchemaJump
```

```shell
# Android模拟schema拉起
adb shell am start -W -a android.intent.action.VIEW -d wbstore:///example/DemoScene?title=TestSchemaJump com.trident.wbstore
```

## 自定义导航栏
## 自定义标题文字
```js
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title
  })
```

### 自定义标题

```js
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: <Text style={{color: 'red'}}>红色标题</Text>
  })
```


