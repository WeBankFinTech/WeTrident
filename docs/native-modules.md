---
id: native-modules
title: 使用原生组件
---
`react-native-device-info` 这个项目支持了大部分常见的原生信息获取的能力，所以我们不再自己全新开发而是直接选择它来实现我们获取版本号的能力。

1. npm安装
```shell
npm install --save react-native-device-info
```

2. Podfile中添加该组件

```shell
# ios/Podfile中添加如下依赖
pod 'RNDeviceInfo', :path => '../node_modules/react-native-device-info'
```
运行 `pod install`

3. 重新编译原生项目
如果编译失败，请重启Xcode尝试。

4. 使用插件
```js
DeviceInfo.getVersion()
```

我们已经能成功的获取到版本号，完善 `VersionScene` 的界面即可。
```js
// modules/about/VersionScene/VersionScene.js
import React from 'react'
import { View, Text, Image, Linking } from 'react-native'
import { WeBaseScene } from '@webank/trident'
import DeviceInfo from 'react-native-device-info'

export default class VersionScene extends WeBaseScene {
  static navigationOptions = () => ({
    headerTitle: '关于我们'
  })

  render () {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 120
      }}>
        <Image style={{
          borderRadius: 60,
          width: 120,
          height: 120
        }} source={require('./assets/images/icon.png')} />
        <Text style={{
          paddingTop: 16
        }}>Trident Framework Demo {DeviceInfo.getVersion()}({DeviceInfo.getBuildNumber()})</Text>

        <Text
          style={{ color: '#53b4ff' }}
          onPress={() => Linking.openURL('http://trident.webank.com')}>
          Trident Website
        </Text>
      </View>
    )
  }
}
```

至此我们的WeBookStore也基本成型，接着我们详细介绍一些Trident为了方面调试做的一些工作。