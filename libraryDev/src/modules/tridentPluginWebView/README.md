## WebView - WeTrident Plugin

WeTrident 项目的 WebView 插件，支持以下特性

* 页面标题自动切换
* JS SDK，可自定义处理api
* 错误重试视图


## Install

```
$ tdt plugin add @webank/trident-plugin-webview
```

## Usage

### 页面加载

```
AppNavigator.tridentPluginWebview.WebViewScene({
  url: 'https://www.webank.com'
})
```

## JS SDK

WeTrident WebView 会在 window 上挂载`TridentWebViewBridge`属性，通过该属性可以调用 WebView 的内置 api 与自定义 api。

### 内置 API

**Toast**

```
TridentWebViewBridge.send('toast', {
  text: 'hello world'
}, res => {
  console.log('调用成功', res)
}, err => {
  console.log('调用失败', err)
})
```

**Loading**

显示/隐藏 trident 的`Loading`组件

* **show: [Boolean]** - 显示/隐藏`Loading`组件

```
TridentWebViewBridge.send('loading', {
  show: true
}, res => {
  console.log('调用成功', res)
}, err => {
  console.log('调用失败', err)
})
```

**setNavBarRightButton**

自定义导航栏右边按钮

* **show: [Boolean]** - 显示/隐藏导航栏右边按钮
* **text: [String]** - 导航栏按钮文字，默认显示为`···`

```
TridentWebViewBridge.send('setNavBarRightButton', {
  show: true,
  text: '完成'
}, res => {
  console.log('点击导航栏', res)
})
```

### 自定义 API

```
import WebViewService from '@webank/trident-plugin-webview/services/WebViewService'
```

开发者可以增加 WebView 处理的 api 列表，通过`WebViewService.addApiHandler`和`WebViewService.addAsyncApiHandler`进行注册 api。

**1. WebViewService.addApiHandler(key:String, handler:function)**

添加同步处理 api，WebView 调用后立即返回结果

```
// in trident proj
WebViewService.addApiHandler('syncApi', args => {
  console.log('接收api参数', args)
})


// in web
TridentWebViewBridge.send('syncApi', {
  params: 'test'
}, res => {
  console.log('调用成功', res)
})
```

**2. WebViewService.addAsyncApiHandler(key:String, handler:function)**

添加异步处理 api，`hanlder`返回`promise`

```
// in trident proj
WebViewService.addAsyncApiHandler('asyncApi', args => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('OK')
    }, 3000)
  })
})


// in web
TridentWebViewBridge.send('asyncApi', {
  params: 'test'
}, res => {
  console.log('promise.resolve', res)
}, err => {
  console.log('promise.reject', err)
})
```
