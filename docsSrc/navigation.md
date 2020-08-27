---
id: navigation
title: 页面间导航
---

WeTrident App中你可以非常轻松的通过模块名和页面名进行跳转。通过`AppNavigator.$moduleName.$sceneName()`即可完成跳转。这样的设计主要是为了达到如下几个目的： 

1. 用法统一，一个规则适用于App内所有跳转。
1. 隔离依赖，因为AppNavigator的方法都是动态添加的，页面间相互跳转时避免了引入目标的模块。
1. 这样的结构可以让使用者明确的知道目标页面所在模块。
2. 清晰的表明各个模块之间的跳转依赖关系。

这样的设计和Trident的模块划分完美结合，为WeTrident以模块为粒度的按需加载提供了便利。同时，导航的统一也让基于页面的数据上报和运营功能实现变得容易。

## 普通跳转
按上面规则，可以改写BookListScene如下，完成到BookDetailScene的跳转。

```jsx
// modules/book/BookListScene/BookListScene.js
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator, WeBaseScene } from '@webank/trident'
import { WeTouchable } from '@unpourtous/react-native-touchable'

export default class BookListScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'BookListScene'
  })

  render () {
    return (
      <View>
        <WeTouchable onPress={() => {
          AppNavigator.book.BookDetailScene()
        }}>
          <Text>Navigate to BookDetailScene</Text>
        </WeTouchable>
      </View>
    )
  }
}
```

## 带参数跳转
上面显示的是一种非常普通的跳转情况，那如果我们需要带参数跳到下个页面如何携带并在下一个页面获取呢？下面展示如何使用跳转参数： 

``` js 
// modules/book/BookListScene/BookListScene.js
render () {
  return (
    <View>
      <WeTouchable onPress={() => {
        // 携带参数跳转
        AppNavigator.book.BookDetailScene({
          ISBN: 'ISBN_NO'
        })
      }}>
        <Text>Navigate to BookDetailScene With params</Text>
      </WeTouchable>
    </View>
  )
}
```

``` js
// modules/book/BookDetailScene/BookDetailScene.js
render () {
  return (
    <View>
      {/* 通过 this.params来读取上个页面带过来的参数 */}
      <Text>ISBN: {this.params.ISBN}</Text>
    </View>
  )
}
```


## 生命周期
相比react component的生命周期，trident提供的生命周期更容易使用，我们用onResume和onPause分别来表示对应页面状态都变化。其中融合了页面创建，页面恢复，App整体前后台切换。
### onResume 
在每个页面首次进入和恢复的时候都会调用，比 componentDidMount特别的是，在App切换到后台切回来以及WeTrident的页面切会到该页时也会调用。

### onPause 
在每个页面离开会调用，比 componentWillUnMount特别的是，在App切换到后台也会调用。

特别说明: WeTrident的生命周期不影响 react component、react-navigation、AppState提供的生命周期，如果需要更为精细的控制可以考虑使用她们。



## 自定义导航栏
我们需要在首页的右上角加上一个`关于我们`的按钮。本部分给你介绍如何自定义导航栏。因为WeTrident使用了`react-navigation@1.2.2`作为底层导航库，所以这里的配置支持所有`react-navigation@1.2.2`的配置。当前的需求只需要配置`title`和`headerRight`即可。

```js
  static navigationOptions = () => ({
    headerTitle: '书架',

    headerRight: (
      <NavRightButton onPress={() => { AppNavigator.about.VersionScene() }} title={'关于我们'} />
    ),
  })
```

### 动态配置
前面的配置方式都是静态的，如果需要动态的更新某些数据按上面的做法，不容易做到，如下方式可以实现动态配置。
```js
export default class ResultScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || '借阅完成',

    // 自定义返回按钮
    headerLeft: null,
    // 使用动态配置的 onRightBtnPress
    headerRight: (
      <NavRightButton onPress={() => { params.onRightBtnPress && params.onRightBtnPress() }} title={'完成'} />
    ),
  })

  componentDidMount () {
    // 动态配置onRightBtnPress
    this.setParams({
      onRightBtnPress: () => {
        AppNavigator.goBack([AppNavigator.book.BookListScene])
      }
    })
  }
  // ... more code
}

```

更多配置见`react-navigation`官方文档。

到这里，页面已经可以很容易的按我们的要求串联起来了，那下一步将会学习数据状态的管理。
