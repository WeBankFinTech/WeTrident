---
id: feedback
title: Feedback
---

WeTrident 项目的意见反馈插件，是对腾讯 [吐个槽](https://tucao.qq.com/) 平台的封装，开发者可快速为项目添加意见反馈模块。关于腾讯吐个槽平台更多说明可查看[吐个槽接入文档](https://tucao.qq.com/helper/WXPGuide)。

## Install

```
$ tdt plugin add @webank/trident-plugin-feedback
```

## Usage

**😆 先前往吐个槽平台申请应用id**，然后可以跳转意见反馈模块了 👇

```
AppNavigator.tridentPluginFeedback.FeedbackScene({
  title: '用户反馈',
  prodID: 107751,
  nickname: "河蟹",
  avatar: "http://wx.qlogo.cn/mmopen/AnqmlwDJ37mQSv19wETm4QPfVualHOmShB0z6NoKp22kSv50nC6vQR3ibqf6VwWa63xZ1LJ8qdfHJjEcicW2j8LdZzg6qs7y0k/0",
  openid: "trident_123",
  clientInfo: " iPhone OS 10.3.1 / 3.2.0.43 / 0 "
})
```

### 参数说明

|Property|Type|Description|Required|
|:-:|:-:|:-:|:-:|
| prodID |number|吐个槽平台应用id|**Yes**|
| title |string|页面标题|No|
|
| nickname |string|当前用户昵称|No|
| avatar |string|用户头像，一般是图片链接 必须要支持https|No|
| openid |string|用户唯一标识，由接入方生成|No|
|
| clientInfo |string|客户端信息|No|
| clientVersion |string|客户端版本号|No|
| os |string|操作系统|No|
| osVersion |string|操作系统版本号|No|
| netType |string|网络类型|No|
| imei |string|设备id（iOS 不能直接拿 IMEI，可以 mac 地址之类信息 md5 加密）|No|
| customInfo |string|自定义字段，长度为 256|No|

仅 prodID 为必选参数，其余参数可选。

#### 关于登录态信息，你可能需要了解 [在吐个槽中传递自己的登录态](https://tucao.qq.com/helper/configLogonState)。

#### 关于自定义参数，你可能需要了解 [在吐个槽中传递自定义参数](https://tucao.qq.com/helper/configCustomParameter)。

